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
var state_service_exports = {};
__export(state_service_exports, {
  addStateServices: () => addStateServices
});
module.exports = __toCommonJS(state_service_exports);
var grpc = __toESM(require("@grpc/grpc-js"));
var proto = __toESM(require("../../generated/state/state"));
var import_authenticator = require("./authenticator/authenticator");
function addStateServices(gRpcServer, adapter) {
  gRpcServer.addService(proto.StateUpdateClient.service, {
    Subscibe: async (call) => {
      const authStatus = await (0, import_authenticator.checkAuthentication)(call.metadata, adapter);
      if (authStatus.code != grpc.status.OK) {
        call.emit("error", authStatus);
        return;
      }
      const result = await adapter.subscribeToDataPointsProto(call.request.stateIds, call);
      const id = call.metadata.get("deviceId")[0].toString();
      adapter.listener.addWriter(id, call);
    },
    UpdateValue: async (call, _callback) => {
      adapter.log.debug(`Update value for state ${call.request.stateId} to ${call.request.value}`);
      const authStatus = await (0, import_authenticator.checkAuthentication)(call.metadata, adapter);
      if (authStatus.code != grpc.status.OK) {
        call.emit("error", authStatus);
        return;
      }
      let valueToSet;
      switch (call.request.value) {
        case "stringValue":
          valueToSet = call.request.stringValue;
          break;
        case "boolValue":
          valueToSet = call.request.boolValue;
          break;
        case "doubleValue":
          valueToSet = call.request.doubleValue;
          break;
        case "other":
          valueToSet = call.request.other;
          break;
        default:
          valueToSet = void 0;
      }
      try {
        adapter.setForeignState(call.request.stateId, valueToSet, false);
      } catch (e) {
        adapter.log.warn(`The data point ${call.request.stateId} does not exist! ${e}`);
      }
      _callback(null, new proto.StateValueUpdateResponse({ suc: true }));
    },
    searchStateStream: (call) => {
      adapter.log.debug("Start search");
      const firstLevelMap = adapter.stateSearchEngine.getFirstLevel();
      const firstLevelResponse = [];
      for (const [id] of firstLevelMap) {
        firstLevelResponse.push(
          new proto.State({
            stateId: id
          })
        );
      }
      call.write(new proto.SearchStateResponse({ states: firstLevelResponse }));
    },
    GetAllObjects: async (call) => {
      let result = [];
      const sendBatch = () => {
        if (result.length > 0) {
          call.write(new proto.AllObjectsResults({ states: result }));
          result = [];
        }
      };
      const safeNumber = (val) => {
        if (val === void 0 || val === null) {
          return void 0;
        }
        const num = Number(val);
        return isNaN(num) ? void 0 : Math.round(num);
      };
      const safeBool = (val) => {
        if (val === void 0 || val === null) {
          return false;
        }
        if (typeof val === "boolean") {
          return val;
        }
        return val === "true" || val === 1 || val === "1";
      };
      const pushState = (objectId, object) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        result.push(
          new proto.State({
            stateId: objectId,
            common: new proto.State.StateCommon({
              name: (_b = (_a = object.common.name) == null ? void 0 : _a.toString()) != null ? _b : "No name found",
              unit: (_c = object.common.unit) == null ? void 0 : _c.toString(),
              desc: (_e = (_d = object.common.desc) == null ? void 0 : _d.toString()) != null ? _e : "No name found",
              max: safeNumber(object.common.max),
              min: safeNumber(object.common.min),
              type: (_g = (_f = object.common.type) == null ? void 0 : _f.toString()) != null ? _g : "No name found",
              step: safeNumber(object.common.step),
              read: safeBool(object.common.read),
              write: safeBool(object.common.write),
              role: (_i = (_h = object.common.role) == null ? void 0 : _h.toString()) != null ? _i : ""
            })
          })
        );
        if (result.length >= 100) {
          sendBatch();
        }
      };
      if (call.request.filterPatterns.length != 0) {
        adapter.log.debug(`Get all objects with filter patterns: ${call.request.filterPatterns.join(", ")}`);
        let objects = await adapter.getForeignObjectsAsync("system.adapter.*.alive");
        for (const objectId in objects) {
          pushState(objectId, objects[objectId]);
        }
        for (const filterPattern of call.request.filterPatterns) {
          objects = await adapter.getForeignObjectsAsync(`${filterPattern}.*`);
          for (const objectId in objects) {
            pushState(objectId, objects[objectId]);
          }
        }
      } else {
        const objects = await adapter.getForeignObjectsAsync("*");
        adapter.log.debug(`Get all objects without filter patterns${Object.keys(objects).length}`);
        for (const objectId in objects) {
          pushState(objectId, objects[objectId]);
        }
      }
      sendBatch();
      call.end();
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addStateServices
});
//# sourceMappingURL=state-service.js.map
