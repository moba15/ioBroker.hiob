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
var device_manager_exports = {};
__export(device_manager_exports, {
  DeviceManager: () => DeviceManager
});
module.exports = __toCommonJS(device_manager_exports);
class DeviceManager {
  constructor(adapter) {
    this.adapter = adapter;
  }
  async handleMessage(obj) {
    if (obj.command === "getDevices") {
      try {
        const devices = await this.adapter.getChannelsOfAsync("devices");
        const result = [];
        for (const device of devices) {
          const idParts = device._id.split(".");
          const shortId = idParts[idParts.length - 1];
          if (idParts[idParts.length - 2] === "devices") {
            let name = shortId;
            if (device.common && device.common.name) {
              if (typeof device.common.name === "string") {
                name = device.common.name;
              } else if (typeof device.common.name === "object" && device.common.name.en) {
                name = device.common.name.en;
              }
            }
            const approvedState = await this.adapter.getStateAsync(`devices.${shortId}.approved`);
            const approved = approvedState ? !!approvedState.val : false;
            result.push({
              id: shortId,
              name,
              approved
            });
          }
        }
        if (obj.callback) {
          this.adapter.sendTo(obj.from, obj.command, { devices: result }, obj.callback);
        }
      } catch (e) {
        this.adapter.log.error(`Error getting devices: ${e.message}`);
        if (obj.callback) {
          this.adapter.sendTo(obj.from, obj.command, { error: e.message }, obj.callback);
        }
      }
    } else if (obj.command === "setDeviceApproval") {
      if (typeof obj.message === "object" && obj.message && "deviceId" in obj.message && "approved" in obj.message) {
        const deviceId = obj.message.deviceId;
        const approved = obj.message.approved;
        try {
          await this.adapter.setStateAsync(`devices.${deviceId}.approved`, approved, true);
          this.adapter.log.info(`Device ${deviceId} approval set to ${approved} via Admin UI`);
          this.adapter.emit("stateChange", `${this.adapter.namespace}.devices.${deviceId}.approved`, {
            val: approved,
            ack: true,
            ts: Date.now(),
            lc: Date.now(),
            from: `system.adapter.${this.adapter.namespace}`
          });
          if (obj.callback) {
            this.adapter.sendTo(obj.from, obj.command, { success: true }, obj.callback);
          }
        } catch (e) {
          this.adapter.log.error(`Error setting device approval: ${e.message}`);
          if (obj.callback) {
            this.adapter.sendTo(obj.from, obj.command, { error: e.message }, obj.callback);
          }
        }
      } else {
        if (obj.callback) {
          this.adapter.sendTo(obj.from, obj.command, { error: "Invalid parameters" }, obj.callback);
        }
      }
    } else {
      if (obj.callback) {
        this.adapter.sendTo(obj.from, obj.command, { error: "Invalid parameters" }, obj.callback);
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeviceManager
});
//# sourceMappingURL=device-manager.js.map
