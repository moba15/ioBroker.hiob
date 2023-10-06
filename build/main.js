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
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var main_exports = {};
__export(main_exports, {
  SamartHomeHandyBis: () => SamartHomeHandyBis
});
module.exports = __toCommonJS(main_exports);
var utils = __toESM(require("@iobroker/adapter-core"));
var import_server = require("./server/server");
var import_listener = require("./listener/listener");
var import_loginmanager = require("./login/loginmanager");
var import_datapacks = require("./server/datapacks");
var import_template_manager = require("./template/template_manager");
class SamartHomeHandyBis extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "hiob"
    });
    this.port = 8095;
    this.keyPath = "";
    this.certPath = "";
    this.useCer = false;
    this.templateManager = new import_template_manager.TemplateManager(this);
    this.listener = new import_listener.Listener(this);
    this.loginManager = new import_loginmanager.LoginManager(this);
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.listener.onStateChange.bind(this.listener));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.setState("info.connection", true, true);
    this.loadConfigs();
    this.initServer();
  }
  loadConfigs() {
    this.port = Number(this.config.port);
    this.certPath = this.config.certPath;
    this.useCer = this.config.useCert;
    this.keyPath = this.config.keyPath;
  }
  initServer() {
    this.server = new import_server.Server(this.port, this.keyPath, this.certPath, this, this.useCer);
    this.server.startServer();
  }
  async getEnumListJSON(id) {
    const list = [];
    if (false) {
      const enumDevices = await this.getForeignObjectsAsync(id, "enum");
      for (const i in enumDevices) {
        const members = enumDevices[i].common.members;
        const dataPoints = [];
        if (!dataPoints) {
          continue;
        }
        for (const z in members) {
          const dataPoint = await this.getForeignObjectAsync(z);
          if (!dataPoint)
            continue;
          dataPoints.push({
            "name": dataPoint.common.name,
            "id": z,
            "role": dataPoint.common.role,
            "otherDetails": dataPoint.common.custom
          });
        }
        const map = {
          "id": enumDevices[i]._id,
          "name": enumDevices[i].common.name,
          "icon": enumDevices[i].common.icon,
          "dataPointMembers": dataPoints
        };
        list.push(map);
      }
    } else {
      for (const type of ["folder", "channel"]) {
        const aliasFolder = await this.getForeignObjectsAsync("alias.0.*", type);
        for (const device in aliasFolder) {
          const dataPoints = [];
          this.log.debug(JSON.stringify(device));
          const aliasStates = await this.getForeignObjectsAsync(device + ".*", "state");
          for (const state in aliasStates) {
            this.log.debug(JSON.stringify(state));
            const dataPoint = await this.getForeignObjectAsync(state);
            dataPoints.push({
              "name": dataPoint.common.name,
              "id": state,
              "role": dataPoint.common.role,
              "otherDetails": dataPoint.common.custom
            });
          }
          const map = {
            "id": aliasFolder[device]._id,
            "name": aliasFolder[device].common.name,
            "icon": aliasFolder[device].common.icon,
            "dataPointMembers": dataPoints
          };
          list.push(map);
        }
      }
    }
    return list;
  }
  async subscribeToDataPoints(dataPoints, client) {
    this.log.debug(JSON.stringify(dataPoints));
    for (const i in dataPoints) {
      const state = await this.getForeignStateAsync(dataPoints[i]);
      if (state) {
        this.subscribeForeignStates(dataPoints[i]);
        client.sendMSG(new import_datapacks.StateChangedDataPack(dataPoints[i], state.val).toJSON(), true);
      }
    }
  }
  onUnload(callback) {
    try {
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new SamartHomeHandyBis(options);
} else {
  (() => new SamartHomeHandyBis())();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SamartHomeHandyBis
});
//# sourceMappingURL=main.js.map
