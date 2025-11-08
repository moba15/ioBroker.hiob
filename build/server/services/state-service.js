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
      const authStatus = (0, import_authenticator.checkAuthentication)(call.metadata);
      if (authStatus.code != grpc.status.OK) {
        call.emit("error", authStatus);
        return;
      }
      const result = await adapter.subscribeToDataPointsProto(call.request.stateIds, call);
      const id = call.metadata.get("deviceId")[0].toString();
      adapter.listener.addWriter(id, call);
    },
    UpdateValue: (call, _callback) => {
      adapter.log.debug(`Update value for state ${call.request.stateId} to ${call.request.value}`);
      const authStatus = (0, import_authenticator.checkAuthentication)(call.metadata);
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
    GetAllObjects: async (call, callback) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      const result = [];
      if (call.request.filterPatterns.length != 0) {
        let objects = await adapter.getForeignObjectsAsync("system.adapter.*.alive");
        for (const objectId in objects) {
          const object = objects[objectId];
          result.push(
            new proto.State({
              stateId: objectId,
              common: new proto.State.StateCommon({
                name: (_b = (_a = object.common.name) == null ? void 0 : _a.toString()) != null ? _b : "No name found",
                unit: object.common.unit,
                desc: (_d = (_c = object.common.desc) == null ? void 0 : _c.toString()) != null ? _d : "No name found",
                max: object.common.max,
                min: object.common.min,
                type: (_f = (_e = object.common.type) == null ? void 0 : _e.toString()) != null ? _f : "No name found",
                step: object.common.step,
                read: object.common.read,
                write: object.common.write,
                role: object.common.role
              })
            })
          );
        }
        for (const filterPattern of call.request.filterPatterns) {
          objects = await adapter.getForeignObjectsAsync(`${filterPattern}.*`);
          for (const objectId in objects) {
            const object = objects[objectId];
            result.push(
              new proto.State({
                stateId: objectId,
                common: new proto.State.StateCommon({
                  name: (_h = (_g = object.common.name) == null ? void 0 : _g.toString()) != null ? _h : "No name found",
                  unit: object.common.unit,
                  desc: (_j = (_i = object.common.desc) == null ? void 0 : _i.toString()) != null ? _j : "No name found",
                  max: object.common.max,
                  min: object.common.min,
                  type: (_l = (_k = object.common.type) == null ? void 0 : _k.toString()) != null ? _l : "No name found",
                  step: object.common.step,
                  read: object.common.read,
                  write: object.common.write,
                  role: object.common.role
                })
              })
            );
          }
        }
      } else {
        const objects = await adapter.getForeignObjectsAsync("*");
        for (const objectId in objects) {
          const object = objects[objectId];
          result.push(
            new proto.State({
              stateId: objectId,
              common: new proto.State.StateCommon({
                name: (_n = (_m = object.common.name) == null ? void 0 : _m.toString()) != null ? _n : "No name found",
                unit: object.common.unit,
                desc: (_p = (_o = object.common.desc) == null ? void 0 : _o.toString()) != null ? _p : "No name found",
                max: object.common.max,
                min: object.common.min,
                type: (_r = (_q = object.common.type) == null ? void 0 : _q.toString()) != null ? _r : "No name found",
                step: object.common.step,
                read: object.common.read,
                write: object.common.write,
                role: object.common.role
              })
            })
          );
        }
      }
      callback(null, new proto.AllObjectsResults({ states: result }));
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addStateServices
});
//# sourceMappingURL=state-service.js.map
