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
    this.approveLogins = false;
    this.adapter = adapter;
    this.adapter.listener.on(import_listener.Events.StateChange, this.onStateChange.bind(this));
    this.pendingClients = [];
  }
  async onStateChange(event) {
    if (event.objectID.startsWith("hiob.")) {
      const splited = event.objectID.split(".");
      if (splited.length > 4 && splited[2] == "devices" && splited[4] == "approved") {
        const deviceID = splited[3];
        const cl = this.pendingClients.find((e) => e.id == deviceID);
        if (cl && event.value) {
          await this.setAndSendLoginKeys(deviceID, cl);
        } else {
          this.adapter.log.debug("No pending client found");
        }
      } else if (splited[2] == "approveNextLogins") {
        if (event.value) {
          if (this.approveLoginsTimeout) {
            clearTimeout(this.approveLoginsTimeout);
          }
          this.approveLogins = true;
          this.approveLoginsTimeout = setTimeout(() => {
            this.approveLogins = false;
            this.approveLoginsTimeout = void 0;
            this.adapter.setStateAsync("approveNextLogins", false, true);
          }, 1e3 * 60);
        } else {
          this.approveLogins = false;
        }
      }
    }
  }
  async setAndSendLoginKeys(deviceID, cl) {
    const keys = await this.genKey();
    await this.adapter.setStateAsync("devices." + deviceID + ".key", keys[1], true);
    cl.sendMSG(new import_datapacks.LoginKeyPacket(keys[0]).toJSON(), false);
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
    let apr = true;
    if (!approved || !approved.val) {
      this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): not approved");
      apr = false;
    }
    if (keyState == null || keyState.val == null) {
      apr = false;
    }
    if (!loginRequestData.key) {
      apr = false;
    }
    if (needPWD && !(needPWD == null ? void 0 : needPWD.val)) {
      if (!loginRequestData.user || !loginRequestData.password || !await this.adapter.checkPasswordAsync(loginRequestData.user, loginRequestData.password)) {
        this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong password");
        apr = false;
      }
    }
    if (keyState != null && keyState.val != null && !bcrypt.compare(keyState.val.toString(), loginRequestData.key)) {
      this.adapter.log.debug("Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong key");
      apr = false;
    }
    if (!apr && this.approveLogins) {
      await this.adapter.setStateAsync("devices." + deviceIDRep + ".approved", true, true);
      await this.setAndSendLoginKeys(deviceIDRep, client);
      apr = true;
    }
    return apr;
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
    await this.adapter.setObjectNotExistsAsync("devices." + deviceIDRep + ".sendNotification", {
      type: "state",
      common: {
        name: "Send Notification",
        type: "string",
        role: "indicator",
        def: "",
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.subscribeStatesAsync("devices." + deviceIDRep + ".sendNotification");
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
