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
var import_notification_manager = require("./notification/notification_manager");
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
    this.clientinfos = {};
    this.valueDatapoints = {};
    this.lang = "de";
    this.templateManager = new import_template_manager.TemplateManager(this);
    this.listener = new import_listener.Listener(this);
    this.notificationManager = new import_notification_manager.NotificationManager(this);
    this.loginManager = new import_loginmanager.LoginManager(this);
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.listener.onStateChange.bind(this.listener));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.server = void 0;
  }
  async onReady() {
    this.setState("info.connection", true, true);
    if (this.config.port < 1025) {
      this.log.warn(`Port is automatically changed because it is less than 1025 - ${this.config.port}`);
      this.config.port = 8095;
    } else if (this.config.port > 65535) {
      this.log.warn(`Port will be changed automatically as it is greater than 65535 - ${this.config.port}`);
      this.config.port = 8095;
    }
    const check_port = await this.getPortAsync(this.config.port);
    if (check_port != this.config.port) {
      this.log.warn(`Port ${this.config.port} is used!! Change to port ${check_port}.`);
      this.config.port = check_port;
    }
    await this.setObjectNotExistsAsync("approveNextLogins", {
      type: "state",
      common: {
        name: {
          en: "Connected",
          de: "Verbunden",
          ru: "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435",
          pt: "Conectado",
          nl: "Verbonden",
          fr: "Connect\xE9",
          it: "Collegato",
          es: "Conectado",
          pl: "Po\u0142\u0105czone",
          uk: "\u0417\u0432'\u044F\u0437\u0430\u0442\u0438\u0441\u044F",
          "zh-cn": "\u5DF2\u8FDE\u63A5"
        },
        type: "boolean",
        role: "button",
        def: false,
        read: true,
        write: true
      },
      native: {}
    });
    await this.setStateAsync("approveNextLogins", false, true);
    this.subscribeStates("approveNextLogins");
    this.subscribeStates("*");
    this.check_aes_key();
    this.loadConfigs();
    this.initServer();
    const obj = await this.getForeignObjectAsync("system.config");
    if (obj && obj.common && obj.common.language) {
      try {
        this.lang = obj.common.language === this.lang ? this.lang : obj.common.language;
      } catch (e) {
      }
    }
  }
  loadConfigs() {
    this.port = Number(this.config.port);
    this.certPath = this.config.certPath;
    this.useCer = this.config.useCert;
    this.keyPath = this.config.keyPath;
  }
  async check_aes_key() {
    const channels = await this.getChannelsAsync();
    for (const element of channels) {
      const id = `${this.namespace}.devices`;
      if (element["_id"].startsWith(id)) {
        const state = await this.getStateAsync(`${element["_id"]}.aesKey`);
        if (state != null && state.val != null) {
          if (state.val.toString().length === 6) {
            const shaAes = this.encrypt(state.val.toString());
            await this.setStateAsync(`${element["_id"]}.aesKey`, shaAes, true);
          }
        }
      }
    }
  }
  initServer() {
    this.server = new import_server.Server(this.port, this.keyPath, this.certPath, this, this.useCer);
    this.server.startServer();
  }
  async getEnumListJSON(id) {
    const list = [];
    const enumDevices = await this.getForeignObjectsAsync(id, "enum");
    for (const i in enumDevices) {
      const members = enumDevices[i].common.members;
      if (!members) {
        continue;
      }
      const dataPoints = [];
      if (!dataPoints) {
        continue;
      }
      for (const z of members) {
        const dataPoint = await this.getForeignObjectAsync(z);
        if (!dataPoint)
          continue;
        const name = dataPoint.common.name;
        if (typeof name == "object") {
          const translated = name;
          const translatedString = translated[this.lang];
          if (translatedString) {
            dataPoints.push({
              name: translatedString,
              id: z,
              role: dataPoint.common.role,
              otherDetails: dataPoint.common.custom
            });
          } else {
            dataPoints.push({
              name,
              id: z,
              role: dataPoint.common.role,
              otherDetails: dataPoint.common.custom
            });
          }
        } else {
          dataPoints.push({
            name,
            id: z,
            role: dataPoint.common.role,
            otherDetails: dataPoint.common.custom
          });
        }
      }
      const map = {
        id: enumDevices[i]._id,
        name: enumDevices[i].common.name,
        icon: enumDevices[i].common.icon,
        dataPointMembers: dataPoints
      };
      list.push(map);
    }
    return list;
  }
  async subscribeToDataPoints(dataPoints, client) {
    this.log.debug(JSON.stringify(dataPoints));
    const all_dp = [];
    for (const i in dataPoints) {
      let state = null;
      try {
        if (this.valueDatapoints[dataPoints[i]] == null) {
          this.valueDatapoints[dataPoints[i]] = {};
          state = await this.getForeignStateAsync(dataPoints[i]);
          this.log.debug("Use getForeignStateAsync");
        } else {
          this.log.debug("Use memory");
          state = {
            val: this.valueDatapoints[dataPoints[i]].val,
            ack: this.valueDatapoints[dataPoints[i]].ack
          };
        }
      } catch (e) {
        this.log.warn("App tried to request to a deleted datapoint. " + dataPoints[i]);
        continue;
      }
      if (state) {
        if (state.ts != null) {
          this.valueDatapoints[dataPoints[i]].val = state.val;
          this.valueDatapoints[dataPoints[i]].ack = state.ack;
        }
        const map = {
          objectID: dataPoints[i],
          value: state.val,
          ack: state.ack
        };
        all_dp.push(map);
        this.subscribeForeignStates(dataPoints[i]);
      } else {
        this.log.warn("App tried to request to a deleted datapoint. " + dataPoints[i]);
      }
    }
    if (all_dp.length > 0) {
      client.sendMSG(new import_datapacks.AnswerSubscribeToDataPointsPack(all_dp).toJSON(), true);
    }
  }
  onUnload(callback) {
    try {
      this.loginManager.stop();
      this.server = void 0;
      callback();
    } catch (e) {
      callback();
    }
  }
  onMessage(obj) {
    var _a;
    if (typeof obj === "object" && obj.message) {
      if (obj.command === "send") {
        this.log.debug("send command");
        const message = obj.message;
        if ("notification" in message && "uuid" in message) {
          const cl = (_a = this.server) == null ? void 0 : _a.getClient(message["uuid"]);
          this.notificationManager.sendNotificationLocal(cl, message["uuid"], JSON.stringify(message["notification"]));
          if (obj.callback)
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
        } else {
          if (obj.callback)
            this.sendTo(obj.from, obj.command, "Error received", obj.callback);
        }
      }
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
