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
var import_state = require("../../generated/state/state");
var import_authenticator = require("./authenticator/authenticator");
class Test extends import_state.UnimplementedStateUpdateService {
  Subscibe(call) {
    throw new Error("Method not implemented.");
  }
  updateValue(call, callback) {
    throw new Error("Method not implemented.");
  }
  searchState(call, callback) {
    throw new Error("Method not implemented.");
  }
  searchStateStream(call) {
    throw new Error("Method not implemented.");
  }
}
function addStateServices(gRpcServer, adapter) {
  gRpcServer.addService(proto.StateUpdateClient.service, {
    Subscibe: async (call) => {
      const authStatus = (0, import_authenticator.checkAuthentication)(call.metadata);
      if (authStatus.code != grpc.status.OK) {
        call.emit("error", authStatus);
        return;
      }
      const result = await adapter.subscribeToDataPointsProto(call.request.stateIds);
      const stateValueUpdates = result.map((e) => {
        return new proto.StateValueUpdate({
          stateId: e.objectID,
          stringValue: e.val.toString(),
          acc: e.ack,
          time: 0
        });
      });
      call.write(new proto.StatesValueUpdate({ stateUpdates: stateValueUpdates }));
      const id = call.metadata.get("deviceId")[0].toString();
      adapter.listener.addWriter(id, call);
    },
    searchStateStream: async (call) => {
      adapter.log.debug("Start search");
      const firstLevelMap = adapter.stateSearchEngine.getFirstLevel();
      const firstLevelResponse = [];
      for (const [id, adapaterObj] of firstLevelMap) {
        firstLevelResponse.push(new proto.State({
          stateId: id
        }));
      }
      call.write(new proto.SearchStateResponse({ states: firstLevelResponse }));
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addStateServices
});
//# sourceMappingURL=state-service.js.map
