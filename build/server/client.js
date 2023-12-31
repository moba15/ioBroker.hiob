"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var client_exports = {};
__export(client_exports, {
  Client: () => Client
});
module.exports = __toCommonJS(client_exports);
var import_datapacks = require("./datapacks");
var import_template_manager = require("../template/template_manager");
class Client {
  constructor(socket, server, req, adapter) {
    this.onlySendNotification = false;
    this.socket = socket;
    this.server = server;
    this.req = req;
    this.isConnected = true;
    this.adapter = adapter;
    this.approved = false;
    socket.on("message", this.onData.bind(this));
    socket.on("close", this.onEnd.bind(this));
    socket.onerror = this.onError.bind(this);
  }
  close() {
    this.socket.pause();
  }
  sendMSG(msg, needAproval = false) {
    if (needAproval && !this.approved) {
      this.adapter.log.debug("The Client was not approved to get a msg (" + msg + +")" + needAproval);
      return false;
    }
    this.socket.send(msg);
    this.adapter.log.debug("Send MSG( " + msg + ") to Client(" + this.toString() + ")");
    return false;
  }
  onData(data) {
    var _a;
    try {
      const map = JSON.parse(data);
      const content = (_a = map["content"]) != null ? _a : {};
      this.adapter.log.debug("Client(" + this.toString() + ") sended msg: " + data + "type: " + map["type"]);
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
            this.onSubscribeToHistory(new import_datapacks.SubscribeToDataPointsHistory(content["dataPoint"], content["end"], content["start"], content["interval"]));
          break;
        case "requestLogin":
          this.onLoginRequest(new import_datapacks.RequestLoginPacket(content["deviceName"], content["deviceID"], content["key"], content["user"], content["password"]));
          break;
        case "templateSettingCreate":
          this.adapter.log.debug(content["name"]);
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
  }
  filter(value) {
    return value.isConnected == true;
  }
  onEnd() {
    this.setConnection();
    this.isConnected = false;
    this.adapter.log.debug("Closed connection to Client(" + this.toString() + ")");
    this.server.conClients = this.server.conClients.filter(this.filter.bind(this));
    this.adapter.log.debug("Size: " + this.server.conClients.length.toString());
  }
  onError() {
    this.setConnection();
    this.isConnected = false;
    this.adapter.log.debug("Closed connection to Client(" + this.toString() + ")");
  }
  setConnection() {
  }
  onStateChangeRequest(request) {
    this.adapter.setForeignState(request.objectID, request.newValue, false);
  }
  async onEnumUpdateRequest(request) {
    const result = await this.adapter.getEnumListJSON(request.id);
    this.sendMSG(new import_datapacks.EnumUpdatePack(request.id, result).toJSON(), true);
  }
  onSubscribeToDataPoints(sub) {
    this.adapter.subscribeToDataPoints(sub.dataPoints, this);
  }
  onSubscribeToHistory(sub) {
  }
  onLoginRequest(requestLoginPacket) {
    this.adapter.loginManager.onLoginRequest(this, requestLoginPacket);
  }
  async onTemplateSettingsRequest() {
    const list = await this.adapter.templateManager.fetchTemplateSettings();
    this.sendMSG(new import_datapacks.TemplateSettingsRequestedPack(list).toJSON(), true);
  }
  async onTemplateSettingCreate(templateSettingCreatePack) {
    this.adapter.log.debug("OnTemplateSettingCreate: " + templateSettingCreatePack.name);
    await this.adapter.templateManager.createNewTemplateSetting(new import_template_manager.TemplateSettings(templateSettingCreatePack.name), this);
    this.sendMSG(new import_datapacks.TemplateSettingCreatePack(templateSettingCreatePack.name).toJSON(), true);
  }
  async onTemplateUpload(uploadTemplateSettingPack) {
    await this.adapter.templateManager.uploadTemplateSetting(uploadTemplateSettingPack.name, uploadTemplateSettingPack.devices, uploadTemplateSettingPack.screens, uploadTemplateSettingPack.widgets, this);
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
    return this.req.socket.address() + ":" + this.req.socket.remotePort;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client
});
//# sourceMappingURL=client.js.map
