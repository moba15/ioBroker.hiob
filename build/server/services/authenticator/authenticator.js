"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var authenticator_exports = {};
__export(authenticator_exports, {
  checkAuthentication: () => checkAuthentication,
  cleanupTokenCache: () => cleanupTokenCache,
  invalidateDeviceTokens: () => invalidateDeviceTokens
});
module.exports = __toCommonJS(authenticator_exports);
var grpc = __toESM(require("@grpc/grpc-js"));
var bcrypt = __toESM(require("bcrypt"));
const validatedTokenCache = /* @__PURE__ */ new Map();
const CACHE_TTL_MS = 5 * 60 * 1e3;
async function checkAuthentication(metadata, adapter) {
  const tokenValues = metadata.get("token");
  const idValues = metadata.get("deviceId");
  if (!idValues || idValues.length !== 1 || !tokenValues || tokenValues.length !== 1) {
    return {
      code: grpc.status.UNAUTHENTICATED,
      details: "Missing required metadata: token and deviceId",
      name: "Not authenticated"
    };
  }
  const deviceId = idValues[0].toString();
  const token = tokenValues[0].toString();
  if (!deviceId || !token) {
    return {
      code: grpc.status.UNAUTHENTICATED,
      details: "Empty token or deviceId",
      name: "Not authenticated"
    };
  }
  const cacheKey = `${deviceId}:${token}`;
  const cachedAt = validatedTokenCache.get(cacheKey);
  if (cachedAt && Date.now() - cachedAt < CACHE_TTL_MS) {
    return { code: grpc.status.OK, name: "", deviceId };
  }
  const approvedState = await adapter.getStateAsync(`devices.${deviceId}.approved`);
  if (!approvedState || !approvedState.val) {
    return {
      code: grpc.status.PERMISSION_DENIED,
      details: `Device ${deviceId} is not approved`,
      name: "Not approved"
    };
  }
  const keyState = await adapter.getStateAsync(`devices.${deviceId}.key`);
  if (!keyState || !keyState.val) {
    return {
      code: grpc.status.UNAUTHENTICATED,
      details: `No key found for device ${deviceId}`,
      name: "No key"
    };
  }
  try {
    const isValid = await bcrypt.compare(token, keyState.val.toString());
    if (!isValid) {
      return {
        code: grpc.status.UNAUTHENTICATED,
        details: "Invalid token",
        name: "Wrong key"
      };
    }
  } catch (e) {
    adapter.log.warn(`Auth error for device ${deviceId}: ${e instanceof Error ? e.message : String(e)}`);
    return {
      code: grpc.status.INTERNAL,
      details: "Authentication check failed",
      name: "Internal error"
    };
  }
  validatedTokenCache.set(cacheKey, Date.now());
  return { code: grpc.status.OK, name: "", deviceId };
}
function cleanupTokenCache() {
  const now = Date.now();
  for (const [key, timestamp] of validatedTokenCache) {
    if (now - timestamp >= CACHE_TTL_MS) {
      validatedTokenCache.delete(key);
    }
  }
}
function invalidateDeviceTokens(deviceId) {
  for (const key of validatedTokenCache.keys()) {
    if (key.startsWith(`${deviceId}:`)) {
      validatedTokenCache.delete(key);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkAuthentication,
  cleanupTokenCache,
  invalidateDeviceTokens
});
//# sourceMappingURL=authenticator.js.map
