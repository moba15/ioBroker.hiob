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
var config_sync_service_exports = {};
__export(config_sync_service_exports, {
  addConfigSyncServices: () => addConfigSyncServices
});
module.exports = __toCommonJS(config_sync_service_exports);
var proto = __toESM(require("../../generated/config_sync/config_sync"));
function addConfigSyncServices(gRpcServer, adapter) {
  gRpcServer.addService(proto.ConfigSyncClient.service, {
    GetAvailableConfigs: async (call, callback) => {
      const list = await adapter.templateManager.fetchTemplateSettings();
      callback(
        null,
        new proto.AvailableConfigsResponse({
          configNames: list
        })
      );
    },
    ConfigSyncUp: async (call, callback) => {
      await adapter.templateManager.uploadTemplateSetting(
        call.request.config.name,
        call.request.config.screens.toString(),
        call.request.config.templates.toString()
      );
    },
    ConfigSyncDown: async (call, callback) => {
      const map = await adapter.templateManager.getTemplateSettings(call.request.configName);
      callback(
        null,
        new proto.Config({
          name: call.request.configName,
          screens: map.screens,
          templates: map.widgets
        })
      );
    },
    ConfigCreateDelete: async (call, callback) => {
      if (!call.request.delete) {
        await adapter.templateManager.createNewTemplateSetting(call.request.configName);
      }
      callback(
        null,
        new proto.ConfigCreateDeleteResponse({
          success: true
        })
      );
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addConfigSyncServices
});
//# sourceMappingURL=config-sync-service.js.map
