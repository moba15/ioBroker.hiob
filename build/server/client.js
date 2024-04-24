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
var client_exports = {};
__export(client_exports, {
  Client: () => Client
});
module.exports = __toCommonJS(client_exports);
var import_datapacks = require("./datapacks");
var import_template_manager = require("../template/template_manager");
var CryptoJS = __toESM(require("crypto-js"));
class Client {
  constructor(socket, server, req, adapter) {
    this.onlySendNotification = false;
    this.socket = socket;
    this.server = server;
    this.req = req;
    this.isConnected = true;
    this.adapter = adapter;
    this.approved = false;
    this.aesKey = "";
    socket.on("message", this.onData.bind(this));
    socket.on("close", this.onEnd.bind(this));
    socket.onerror = this.onError.bind(this);
  }
  close() {
    this.socket.pause();
  }
  async sendMSG(msg, needAproval = false, log = true) {
    var _a;
    if (needAproval && !this.approved) {
      if (log) {
        this.adapter.log.debug("The Client was not approved to get a msg (" + msg + +") " + needAproval);
      }
      return false;
    }
    if (msg["type"] === "loginKey") {
      this.adapter.log.debug("Send MSG( LoginKey ) to Client(" + this.toString() + ")");
    } else {
      this.adapter.log.debug("Send MSG( " + JSON.stringify(msg) + ") to Client(" + this.toString() + ")");
    }
    const send = {
      type: msg["type"],
      content: ""
    };
    if (this.aesKey != "" && Object.keys(msg).length > 1 && ((_a = await this.adapter.getStateAsync("devices." + this.id + ".aesKey_active")) == null ? void 0 : _a.val)) {
      const aes = `${this.aesKey}${msg["type"]}`;
      send["content"] = CryptoJS.AES.encrypt(JSON.stringify(msg), aes).toString();
    } else {
      send["content"] = msg;
    }
    this.socket.send(JSON.stringify(send).toString());
    if (msg["type"] != "loginKey") {
      this.adapter.log.debug("Send MSG( " + JSON.stringify(send) + ") to Client(" + this.toString() + ")");
    }
    return false;
  }
  setAESKey(aesKey) {
    this.aesKey = aesKey;
  }
  setID(id) {
    this.id = id;
  }
  onData(data) {
    var _a, _b;
    try {
      const map = JSON.parse(data);
      if (map && map["content"] != null && typeof map["content"] === "string") {
        if (this.aesKey != "" || map["type"] === "requestLogin") {
          let aes = "";
          if (map["type"] === "requestLogin") {
            aes = `tH8Lm-${map["type"]}`;
          } else {
            aes = `${this.aesKey}${map["type"]}`;
          }
          try {
            const bytes = CryptoJS.AES.decrypt(map["content"], aes);
            map["content"] = (_a = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))) != null ? _a : {};
          } catch (error) {
            this.onWrongAesKey();
            this.adapter.log.warn(`Wrong AES Key - ${error}`);
            return;
          }
        } else {
          if (this.aesKey == "" && map["type"] != "requestLogin") {
            this.adapter.log.warn(`Please enabled AES encryption`);
            this.onWrongAesKey();
            return;
          }
        }
      }
      const content = (_b = map["content"]) != null ? _b : {};
      if (map["type"] === "requestLogin") {
        this.adapter.log.debug("Client(" + this.toString() + ") send requestLogin");
      } else {
        this.adapter.log.debug("Client(" + this.toString() + ") sended msg: " + data + " type: " + map["type"]);
      }
      switch (map["type"]) {
        case "iobStateChangeRequest":
          if (this.approved)
            this.onStateChangeRequest(new import_datapacks.StateChangeRequestPack(content["stateID"], content["value"]));
          break;
        case "enumUpdateRequest":
          if (this.approved)
            this.onEnumUpdateRequest(new import_datapacks.EnumUpdateRequestPack(content["id"]));
          break;
        case "subscribeToDataPoints":
          if (this.approved)
            this.onSubscribeToDataPoints(new import_datapacks.SubscribeToDataPointsPack(content["dataPoints"]));
          break;
        case "subscribeHistory":
          if (this.approved)
            break;
        case "requestLogin":
          if (!content["version"]) {
            this.adapter.log.warn(`Please update the HioB APP!`);
            return;
          }
          this.onLoginRequest(new import_datapacks.RequestLoginPacket(content["deviceName"], content["deviceID"], content["key"], content["version"], content["user"], content["password"]));
          break;
        case "templateSettingCreate":
          this.adapter.log.debug(JSON.stringify(content["name"]));
          this.onTemplateSettingCreate(new import_datapacks.TemplateSettingCreatePack(content["name"]));
          break;
        case "requestTemplatesSettings":
          this.adapter.log.debug("requestTemplatesSettings");
          this.onTemplateSettingsRequest();
          break;
        case "uploadTemplateSetting":
          this.adapter.log.debug("uploadTemplateSetting");
          this.onTemplateUpload(new import_datapacks.TemplateSettingUploadPack(content["name"], content["devices"], content["screens"], content["widgets"]));
          break;
        case "getTemplatesSetting":
          this.adapter.log.debug("getTemplatesSetting");
          this.getTemplatesSetting(content["name"], content["device"], content["screen"], content["widget"]);
          break;
        case "notification":
          this.onNotification(new import_datapacks.NotificationPack(content["onlySendNotification"], content["content"], content["date"]));
          break;
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        this.adapter.log.error("There is something wrong with the sent data: No valid JSON Format");
      }
    }
  }
  onApprove() {
    this.approved = true;
    this.adapter.notificationManager.sendBacklog(this);
  }
  filter(value) {
    return value.isConnected == true;
  }
  onEnd() {
    this.isConnected = false;
    this.setConnection();
    this.adapter.log.debug("Closed connection to Client(" + this.toString() + ")");
    this.server.conClients = this.server.conClients.filter(this.filter.bind(this));
    this.adapter.log.debug("Size: " + this.server.conClients.length.toString());
  }
  onError() {
    this.isConnected = false;
    this.setConnection();
    this.adapter.log.debug("Closed connection to Client(" + this.toString() + ")");
  }
  setConnection() {
    this.adapter.setStateAsync("devices." + this.id + ".connected", this.isConnected, true);
  }
  onStateChangeRequest(request) {
    try {
      this.adapter.setForeignState(request.objectID, request.newValue, false);
    } catch (e) {
      this.adapter.log.warn(`The data point ${request.objectID} does not exist! ${e}`);
    }
  }
  async onEnumUpdateRequest(request) {
    const result = await this.adapter.getEnumListJSON(request.id);
    this.sendMSG(new import_datapacks.EnumUpdatePack(request.id, result).toJSON(), true);
  }
  onSubscribeToDataPoints(sub) {
    this.adapter.subscribeToDataPoints(sub.dataPoints, this);
  }
  /* onSubscribeToHistory(sub: SubscribeToDataPointsHistory): void {
      // this.adapter.historyManager.subscribeToHistory(sub.dataPoint, sub.start, sub.end, this, sub.minInterval);
  } */
  onLoginRequest(requestLoginPacket) {
    this.setConnection();
    this.adapter.loginManager.onLoginRequest(this, requestLoginPacket);
  }
  onWrongAesKey() {
    this.adapter.loginManager.onWrongAesKey(this);
  }
  async onTemplateSettingsRequest() {
    const list = await this.adapter.templateManager.fetchTemplateSettings();
    this.sendMSG(new import_datapacks.TemplateSettingsRequestedPack(list).toJSON(), true);
  }
  async onTemplateSettingCreate(templateSettingCreatePack) {
    this.adapter.log.debug("OnTemplateSettingCreate: " + templateSettingCreatePack.name);
    await this.adapter.templateManager.createNewTemplateSetting(new import_template_manager.TemplateSettings(templateSettingCreatePack.name));
    this.sendMSG(new import_datapacks.TemplateSettingCreatePack(templateSettingCreatePack.name).toJSON(), true);
  }
  async onTemplateUpload(uploadTemplateSettingPack) {
    await this.adapter.templateManager.uploadTemplateSetting(uploadTemplateSettingPack.name, uploadTemplateSettingPack.devices, uploadTemplateSettingPack.screens, uploadTemplateSettingPack.widgets);
    this.sendMSG(new import_datapacks.TemplateSettingUploadSuccessPack().toJSON(), true);
  }
  async getTemplatesSetting(name, device, screen, widget) {
    this.adapter.log.debug("NAME: " + name);
    const map = await this.adapter.templateManager.getTemplateSettings(name);
    this.sendMSG(new import_datapacks.GetTemplateSettingPack(device ? map["devices"] : null, screen ? map["screens"] : null, widget ? map["widgets"] : null).toJSON(), true);
  }
  onNotification(pack) {
    if (pack.onlySendNotification != void 0) {
      this.onlySendNotification = pack.onlySendNotification;
    }
  }
  toString() {
    return JSON.stringify(this.req.socket.address()) + ":" + this.req.socket.remotePort + " id: " + this.id;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client
});
//# sourceMappingURL=client.js.map
