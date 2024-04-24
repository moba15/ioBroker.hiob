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
var notification_manager_exports = {};
__export(notification_manager_exports, {
  NotificationManager: () => NotificationManager
});
module.exports = __toCommonJS(notification_manager_exports);
var import_listener = require("../listener/listener");
var import_datapacks = require("../server/datapacks");
class NotificationManager {
  constructor(adapter) {
    this.backlog = {};
    this.adapter = adapter;
    this.init();
  }
  init() {
    this.adapter.listener.on(import_listener.Events.StateChange, this.onStateChange.bind(this));
  }
  async onStateChange(event) {
    var _a;
    const match = event.objectID.match("(hiob.\\d*.devices.)(.*)(.sendNotification)");
    if (match && match[2] && !event.ack) {
      const deviceID = match[2];
      const client = (_a = this.adapter.server) == null ? void 0 : _a.getClient(deviceID);
      this.sendNotificationLocal(client, deviceID, event.value);
      this.adapter.setState(event.objectID, { ack: true });
    }
  }
  async sendNotificationLocal(client, deviceID, notification) {
    if (client != void 0 && (client == null ? void 0 : client.isConnected)) {
      client.sendMSG(new import_datapacks.NotificationPack(false, notification, /* @__PURE__ */ new Date()).toJSON(), true);
    } else {
      const currentBacklogState = await this.adapter.getStateAsync("devices." + deviceID + ".notificationBacklog");
      if (currentBacklogState) {
        let currentBacklogRaw = currentBacklogState.val;
        if (currentBacklogRaw != void 0 && currentBacklogRaw === "") {
          currentBacklogRaw = "[]";
        }
        const currentBacklogArray = JSON.parse(currentBacklogRaw);
        currentBacklogArray.push(notification);
        if (currentBacklogArray.length > 250) {
          currentBacklogArray.shift();
        }
        await this.adapter.setStateAsync("devices." + deviceID + ".notificationBacklog", JSON.stringify(currentBacklogArray), true);
      }
    }
  }
  async sendBacklog(client) {
    if (client) {
      if (client.isConnected) {
        const currentBacklogState = await this.adapter.getStateAsync("devices." + client.id + ".notificationBacklog");
        if (currentBacklogState) {
          let currentBacklogRaw = currentBacklogState.val;
          if (currentBacklogRaw != void 0 && currentBacklogRaw === "") {
            currentBacklogRaw = "[]";
          }
          const currentBacklogArray = JSON.parse(currentBacklogRaw);
          for (const i of currentBacklogArray) {
            client.sendMSG(new import_datapacks.NotificationPack(false, i, /* @__PURE__ */ new Date()).toJSON(), true);
          }
          await this.adapter.setStateAsync("devices." + client.id + ".notificationBacklog", JSON.stringify([]), true);
        }
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NotificationManager
});
//# sourceMappingURL=notification_manager.js.map
