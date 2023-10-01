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
var loginmanager_exports = {};
__export(loginmanager_exports, {
  LoginManager: () => LoginManager
});
module.exports = __toCommonJS(loginmanager_exports);
var import_listener = require("../listener/listener");
var import_datapacks = require("../server/datapacks");
var bcrypt = __toESM(require("bcrypt"));
var crypto = __toESM(require("crypto"));
class LoginManager {
  constructor(adapter) {
    this.adapter = adapter;
    this.adapter.listener.on(import_listener.Events.StateChange, this.onStateChange.bind(this));
    this.pendingClients = [];
  }
  async onStateChange(event) {
    this.adapter.log.debug("Something changed");
    if (event.objectID.startsWith("hiob-ts.")) {
      this.adapter.log.debug("HioB Datapoint changed");
      const splited = event.objectID.split(".");
      if (splited[2] == "devices" && splited[4] == "approved") {
        this.adapter.log.debug("HioB device Datapoint changed");
        const deviceID = splited[3];
        this.adapter.log.debug("DeviceID: " + deviceID.toString());
        const cl = this.pendingClients.find((e) => e.id == deviceID);
        if (cl && event.value) {
          const keys = await this.genKey();
          await this.adapter.setStateAsync("devices." + deviceID + ".key", keys[1], true);
          cl.sendMSG(new import_datapacks.LoginKeyPacket(keys[0]).toJSON(), false);
        } else {
          this.adapter.log.debug("No pending client found");
        }
      }
    }
  }
  async onLoginRequest(client, loginRequestData) {
    this.adapter.log.debug("Client(" + client.toString() + ") requested to login");
    this.pendingClients.push(client);
    let deviceIDRep = loginRequestData.deviceID.replace(".", "-");
    while (deviceIDRep.includes(".")) {
      deviceIDRep = deviceIDRep.replace(".", "-");
    }
    client.id = deviceIDRep;
    this.createObjects(deviceIDRep, loginRequestData.deviceName, loginRequestData.key);
    this.adapter.subscribeStatesAsync("devices." + deviceIDRep + ".approved");
    this.adapter.setStateAsync("devices." + deviceIDRep + ".connected", true, true);
    if (!await this.validateLoginRequest(client, deviceIDRep, loginRequestData)) {
      this.loginDeclined(client);
      return false;
    }
    this.pendingClients.filter((cl, i) => cl != client);
    client.onApprove();
    client.sendMSG(new import_datapacks.LoginApprovedPacket().toJSON(), false);
    return true;
  }
  async validateLoginRequest(client, deviceIDRep, loginRequestData) {
    const approved = await this.adapter.getStateAsync("devices." + deviceIDRep + ".approved");
    const keyState = await this.adapter.getStateAsync("devices." + deviceIDRep + ".key");
    const needPWD = await this.adapter.getStateAsync("devices." + deviceIDRep + ".noPwdAllowed");
    if (!approved || !approved.val) {
      this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): not approved");
      return false;
    }
    if (keyState == null || keyState.val == null) {
      return false;
    }
    if (!await bcrypt.compare(loginRequestData.key, keyState.val.toString())) {
      this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong key");
      return false;
    }
    return true;
  }
  async createObjects(deviceIDRep, deviceName, key) {
    await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".connected", {
      type: "state",
      common: {
        name: "Connected",
        type: "boolean",
        role: "indicator.reachable",
        def: true,
        read: true,
        write: false
      },
      native: {}
    });
    await this.adapter.setObjectAsync("devices." + deviceIDRep, {
      type: "folder",
      common: {
        name: deviceName
      },
      native: {}
    });
    await this.adapter.setObjectAsync("devices." + deviceIDRep + ".name", {
      type: "state",
      common: {
        name: "Name",
        type: "string",
        role: "info.name",
        def: deviceName,
        read: true,
        write: false
      },
      native: {}
    });
    await this.adapter.setStateAsync("devices." + deviceIDRep + ".name", deviceName, true);
    await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".id", {
      type: "state",
      common: {
        name: "ID",
        type: "string",
        role: "info.address",
        def: deviceIDRep,
        read: true,
        write: false
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".key", {
      type: "state",
      common: {
        name: "Key",
        type: "string",
        role: "key",
        def: key,
        read: false,
        write: false
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".lastConnection", {
      type: "state",
      common: {
        name: "Last Connection",
        type: "number",
        role: "date",
        def: Date.now(),
        read: true,
        write: true
      },
      native: {}
    });
    this.adapter.setState("devices." + deviceIDRep + ".lastConnection", Date.now());
    await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".approved", {
      type: "state",
      common: {
        name: "Approved",
        type: "boolean",
        role: "indicator",
        def: false,
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".noPwdAllowed", {
      type: "state",
      common: {
        name: "No Pwd Allowed",
        type: "boolean",
        role: "indicator",
        def: false,
        read: true,
        write: true
      },
      native: {}
    });
  }
  genRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-\\/&%$!;<>*+#";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(crypto.randomInt(0, charactersLength));
    }
    return result;
  }
  async genKey() {
    const key = this.genRandomString(512);
    const hashedKey = await bcrypt.hash(key, 5);
    return [key, hashedKey];
  }
  loginDeclined(client) {
    client.sendMSG(new import_datapacks.LoginDeclinedPacket().toJSON(), false);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginManager
});
//# sourceMappingURL=loginmanager.js.map
