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
var loginmanager_exports = {};
__export(loginmanager_exports, {
  LoginManager: () => LoginManager
});
module.exports = __toCommonJS(loginmanager_exports);
var import_listener = require("../listener/listener");
var bcrypt = __toESM(require("bcrypt"));
var crypto = __toESM(require("crypto"));
var proto = __toESM(require("../generated/login/login"));
class LoginManager {
  constructor(adapter) {
    this.approveLogins = false;
    this.aesViewTimeout = {};
    this.adapter = adapter;
    this.adapter.listener.on(import_listener.Events.StateChange, this.onStateChange.bind(this));
    this.pendingClients = [];
    this.approveLoginsTimeout = void 0;
    this.pendingClientIds = [];
    this.streams = [];
  }
  onStateChange(event) {
    if (event.objectID.startsWith("hiob.") && !event.ack) {
      const splited = event.objectID.split(".");
      if (splited.length > 4 && splited[2] == "devices") {
        if (splited[4] == "approved") {
          this.adapter.setStateAsync(event.objectID, { ack: true });
        } else if (splited[4] == "noPwdAllowed") {
          this.adapter.setStateAsync(event.objectID, { ack: true });
        }
      } else if (splited[2] == "approveNextLogins") {
        this.setApproveNextLogins(event.value);
      }
    }
  }
  setApproveNextLogins(value) {
    if (value) {
      if (this.approveLoginsTimeout) {
        this.adapter.clearTimeout(this.approveLoginsTimeout);
        this.approveLoginsTimeout = void 0;
      }
      this.approveLogins = true;
      this.approveLoginsTimeout = this.adapter.setTimeout(() => {
        this.approveLogins = false;
        this.approveLoginsTimeout = void 0;
        this.adapter.setStateAsync("approveNextLogins", false, true);
      }, 1e3 * 60);
    } else {
      this.approveLogins = false;
      this.adapter.setStateAsync("approveNextLogins", { ack: true });
    }
  }
  async viewAesKey(deviceID) {
    if (!this.aesViewTimeout[deviceID]) {
      const state = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey`);
      if (state != null && state.val != null) {
        if (state.val.toString().length > 6) {
          const dec_shaAes = this.adapter.decrypt(state.val.toString());
          await this.adapter.setStateAsync(`devices.${deviceID}.aesKey`, dec_shaAes, true);
        }
      } else {
        return;
      }
      this.aesViewTimeout[deviceID] = this.adapter.setTimeout(async () => {
        const state2 = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey`);
        if (state2 != null && state2.val != null) {
          if (state2.val.toString().length === 6) {
            const shaAes = this.adapter.encrypt(state2.val.toString());
            await this.adapter.setStateAsync(`devices.${deviceID}.aesKey`, shaAes, true);
          }
        }
        this.aesViewTimeout[deviceID] = void 0;
      }, 1e3 * 60);
    }
  }
  async setAesStatus(deviceID, cl) {
    var _a;
    const get_aes = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey`);
    const aes_status = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey_active`);
    if (get_aes && get_aes.val && aes_status && aes_status.val) {
      if (get_aes.val.toString().length > 6) {
        get_aes.val = this.adapter.decrypt(get_aes.val.toString());
      }
      cl.setAESKey(get_aes.val.toString());
      this.adapter.log.info("AES encryption enabled!");
    } else {
      cl.setAESKey("");
      if (!((_a = this.adapter.server) == null ? void 0 : _a.useCert)) {
        this.adapter.log.info("AES encryption disabled!");
      }
    }
  }
  stop() {
    this.approveLoginsTimeout && this.adapter.clearTimeout(this.approveLoginsTimeout);
    this.approveLoginsTimeout = void 0;
    if (this.aesViewTimeout && Object.keys(this.aesViewTimeout).length > 0) {
      for (const cl in this.aesViewTimeout) {
        this.aesViewTimeout[cl] && this.adapter.clearTimeout(this.aesViewTimeout[cl]);
        this.aesViewTimeout[cl] = void 0;
      }
    }
    return false;
  }
  async onLoginRequestProto(loginRequest) {
    this.adapter.log.debug(`Client(${loginRequest.toString()}) requested to login`);
    const sessionId = this.genRandomString(12, true);
    this.pendingClientIds.push(sessionId);
    let deviceIDRep = loginRequest.deviceId.replace(".", "-");
    while (deviceIDRep.includes(".")) {
      deviceIDRep = deviceIDRep.replace(".", "-");
    }
    await this.createObjects(deviceIDRep, loginRequest.deviceName, loginRequest.key, "No version");
    void this.adapter.setStateAsync(`devices.${deviceIDRep}.connected`, true, true);
    const validdate = await this.validateLoginRequestProto(loginRequest.deviceName, deviceIDRep, loginRequest);
    if (validdate != proto.LoginResponse.Status.succesfull) {
      this.adapter.log.debug("Login declained");
      return new proto.LoginResponse({ sessionId, status: validdate });
    }
    this.adapter.log.debug("Login approved");
    return new proto.LoginResponse({ sessionId, status: proto.LoginResponse.Status.succesfull });
  }
  async requestApproval(request) {
    this.adapter.log.debug(`Client ${request.deviceName} requests approval`);
    let deviceIDRep = request.deviceId.replace(".", "-");
    while (deviceIDRep.includes(".")) {
      deviceIDRep = deviceIDRep.replace(".", "-");
    }
    const approved = this.approveLogins ? true : await new Promise((resolve, _rejects) => {
      const onChange = (event) => {
        resolve(event.value);
      };
      this.adapter.listener.once(
        `${import_listener.Events.StateChange}hiob.0.devices.${deviceIDRep}.approved`,
        onChange.bind(this)
      );
    });
    this.adapter.log.debug(`Client ${request.deviceName} request for approval: ${approved}`);
    if (approved) {
      this.adapter.log.debug("Generating new key");
      const keys = await this.genKey();
      await this.adapter.setState(`devices.${deviceIDRep}.key`, keys[1], true);
      await this.adapter.setState(`devices.${deviceIDRep}.approved`, true, true);
      return new proto.ApprovalResponse({ key: keys[0], status: proto.ApprovalResponse.Status.aprroved });
    }
    return new proto.ApprovalResponse({ key: "", status: proto.ApprovalResponse.Status.timeout });
  }
  /**
   * This method validdates the Loginrequest based on the key and password
   *
   * @param clientName
   * @param deviceIDRep
   * @param loginRequestData
   * @returns true if valid, false if invalid
   */
  async validateLoginRequestProto(clientName, deviceIDRep, loginRequestData) {
    const approved = await this.adapter.getStateAsync(`devices.${deviceIDRep}.approved`);
    const keyState = await this.adapter.getStateAsync(`devices.${deviceIDRep}.key`);
    const needPWD = await this.adapter.getStateAsync(`devices.${deviceIDRep}.noPwdAllowed`);
    let apr = proto.LoginResponse.Status.succesfull;
    if (!approved || !approved.val) {
      this.adapter.log.debug(
        `Login declined for client: ${clientName} (${loginRequestData.deviceName}): not approved`
      );
      apr = proto.LoginResponse.Status.notApproved;
    }
    if (keyState == null || keyState.val == null) {
      apr = proto.LoginResponse.Status.error;
    }
    if (!loginRequestData.key) {
      apr = proto.LoginResponse.Status.wrongKey;
    }
    if (needPWD && !(needPWD == null ? void 0 : needPWD.val)) {
      if (!loginRequestData.user || !loginRequestData.password || !await this.adapter.checkPasswordAsync(loginRequestData.user, loginRequestData.password)) {
        this.adapter.log.debug(
          `Login declined for client: ${clientName} (${loginRequestData.deviceName}): wrong password`
        );
        apr = proto.LoginResponse.Status.wrongPassword;
      }
    }
    if (loginRequestData.key == null) {
      apr = proto.LoginResponse.Status.wrongKey;
    }
    if (keyState != null && keyState.val != null && loginRequestData.key && !await bcrypt.compare(loginRequestData.key, keyState.val.toString())) {
      this.adapter.log.debug(
        `Login declined for client: ${clientName} (${loginRequestData.deviceName}): wrong key${!await bcrypt.compare(loginRequestData.key, keyState.val.toString())}`
      );
      apr = proto.LoginResponse.Status.wrongKey;
    }
    if (!apr && this.approveLogins) {
      await this.adapter.setStateAsync(`devices.${deviceIDRep}.approved`, true, true);
      apr = proto.LoginResponse.Status.succesfull;
    }
    if (apr == proto.LoginResponse.Status.succesfull) {
      await this.adapter.setStateAsync(`devices.${deviceIDRep}.approved`, true, true);
    } else {
      await this.adapter.setStateAsync(`devices.${deviceIDRep}.approved`, false, true);
    }
    return apr;
  }
  /**
   * This method creates all IoBroker Objects needed for the login request. If they exists this method will not create any
   *
   * @param client
   * @param deviceIDRep Id of the device
   * @param deviceName Name of the device
   * @param key
   * @param version
   */
  async createObjects(deviceIDRep, deviceName, key, version) {
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}`, {
      type: "channel",
      common: {
        name: deviceName,
        desc: "Created by Adapter"
      },
      native: {}
    });
    await this.adapter.setObjectAsync(`devices.${deviceIDRep}`, {
      type: "channel",
      common: {
        name: deviceName,
        desc: "Created by Adapter"
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.connected`, {
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
        role: "info.status",
        desc: "Created by Adapter",
        def: true,
        read: true,
        write: false
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.app_version`, {
      type: "state",
      common: {
        name: {
          en: "APP Version",
          de: "APP-Version",
          ru: "\u0412\u0435\u0440\u0441\u0438\u044F APP",
          pt: "Vers\xE3o do APP",
          nl: "Versie APP",
          fr: "Version APP",
          it: "Versione APP",
          es: "Versi\xF3n APP",
          pl: "Wersja APP",
          uk: "\u0412\u0435\u0440\u0441\u0456\u044F APP",
          "zh-cn": "APP \u7248\u672C"
        },
        type: "string",
        role: "info.firmware",
        desc: "Created by Adapter",
        def: version,
        read: true,
        write: false
      },
      native: {}
    });
    await this.adapter.setStateAsync(`devices.${deviceIDRep}.app_version`, version, true);
    await this.adapter.setObjectAsync(`devices.${deviceIDRep}.name`, {
      type: "state",
      common: {
        name: {
          en: "Name",
          de: "Name",
          ru: "\u0418\u043C\u044F",
          pt: "Nome",
          nl: "Naam",
          fr: "D\xE9nomination",
          it: "Nome",
          es: "Nombre",
          pl: "Nazwa",
          uk: "\u0406\u043C'\u044F",
          "zh-cn": "\u540D\u79F0"
        },
        type: "string",
        role: "info.name",
        desc: "Created by Adapter",
        def: deviceName,
        read: true,
        write: false
      },
      native: {}
    });
    await this.adapter.setStateAsync(`devices.${deviceIDRep}.name`, deviceName, true);
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.id`, {
      type: "state",
      common: {
        name: {
          en: "ID",
          de: "ID",
          ru: "ID",
          pt: "ID",
          nl: "ID",
          fr: "NUM\xC9RO",
          it: "ID",
          es: "ID",
          pl: "ID",
          uk: "\u0406\u041C'\u042F",
          "zh-cn": "\u8EAB\u4EFD\u8BC1"
        },
        type: "string",
        role: "info.address",
        desc: "Created by Adapter",
        def: deviceIDRep,
        read: true,
        write: false
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.key`, {
      type: "state",
      common: {
        name: {
          en: "Key",
          de: "Schl\xFCssel",
          ru: "\u041A\u043B\u044E\u0447",
          pt: "Chaveiro",
          nl: "Sleutel",
          fr: "Cl\xE9",
          it: "Chiave",
          es: "Clave",
          pl: "Klucz",
          uk: "\u0413\u043E\u043B\u043E\u0432\u043D\u0430",
          "zh-cn": "\u5BC6\u94A5"
        },
        type: "string",
        role: "state",
        desc: "Created by Adapter",
        def: key,
        read: false,
        write: false
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.lastConnection`, {
      type: "state",
      common: {
        name: {
          en: "Last Connection",
          de: "Letzte Verbindung",
          ru: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435",
          pt: "\xDAltima conex\xE3o",
          nl: "Laatste verbinding",
          fr: "Derni\xE8re connexion",
          it: "Ultima connessione",
          es: "\xDAltima conexi\xF3n",
          pl: "Ostatnie po\u0142\u0105czenie",
          uk: "\u041E\u0441\u0442\u0430\u043D\u043D\u0454 \u043F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u044F",
          "zh-cn": "\u4E0A\u6B21\u8FDE\u63A5"
        },
        type: "number",
        role: "date",
        desc: "Created by Adapter",
        def: 0,
        read: true,
        write: true
      },
      native: {}
    });
    this.adapter.setState(`devices.${deviceIDRep}.lastConnection`, Date.now(), true);
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.approved`, {
      type: "state",
      common: {
        name: {
          en: "Approved",
          de: "Genehmigt",
          ru: "\u0423\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u043D\u044B\u0435",
          pt: "Aprovado",
          nl: "Goedgekeurd",
          fr: "Approuv\xE9",
          it: "Approvazione",
          es: "Aprobado",
          pl: "Zatwierdzone",
          uk: "\u0417\u0430\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u043D\u044F",
          "zh-cn": "\u6838\u5B9A\u6570"
        },
        type: "boolean",
        role: "switch",
        desc: "Created by Adapter",
        def: false,
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.noPwdAllowed`, {
      type: "state",
      common: {
        name: {
          en: "No Password Allowed",
          de: "Kein Passwort erlaubt",
          ru: "\u0411\u0435\u0437 \u043F\u0430\u0440\u043E\u043B\u044F",
          pt: "Nenhuma senha permitida",
          nl: "Geen wachtwoord toegestaan",
          fr: "Pas de mot de passe autoris\xE9",
          it: "Nessuna password consentita",
          es: "No se admite contrase\xF1a",
          pl: "Brak has\u0142a",
          uk: "\u041D\u0435\u043C\u0430\u0454 \u043F\u0430\u0440\u043E\u043B\u044F",
          "zh-cn": "\u6CA1\u6709\u5141\u8BB8\u7684\u5BC6\u7801"
        },
        type: "boolean",
        role: "switch",
        desc: "Created by Adapter",
        def: false,
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.sendNotification`, {
      type: "state",
      common: {
        name: {
          en: "Send Notification",
          de: "Mitteilung senden",
          ru: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",
          pt: "Enviar notifica\xE7\xE3o",
          nl: "Kennisgeving versturen",
          fr: "Envoyer une notification",
          it: "Invia notifica",
          es: "Enviar notificaci\xF3n",
          pl: "Wy\u015Blij powiadomienie",
          uk: "\u041D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F",
          "zh-cn": "\u53D1\u9001\u901A\u77E5"
        },
        type: "string",
        role: "state",
        //TODO: Indicator
        desc: "Created by Adapter",
        def: "",
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.notificationBacklog`, {
      type: "state",
      common: {
        name: {
          en: "Notification Backlog",
          de: "R\xFCckstand bei der Benachrichtigung",
          ru: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
          pt: "Atraso de notifica\xE7\xE3o",
          nl: "Kennisgeving Achterstand",
          fr: "Carnet de notifications",
          it: "Arretrati di notifica",
          es: "Notificaciones atrasadas",
          pl: "Zaleg\u0142o\u015Bci w powiadomieniach",
          uk: "\u0412\u0456\u0434\u0441\u0442\u0430\u0432\u0430\u043D\u043D\u044F \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u044C",
          "zh-cn": "\u901A\u77E5\u79EF\u538B"
        },
        type: "array",
        role: "state",
        desc: "Created by Adapter",
        def: "",
        read: true,
        write: false
      },
      native: {}
    });
  }
  genRandomString(length, woCharacters) {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-\\/&%$!;<>*+#";
    if (woCharacters) {
      characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(crypto.randomInt(0, charactersLength));
    }
    return result;
  }
  async genKey() {
    const key = this.genRandomString(512, false);
    const hashedKey = await bcrypt.hash(key, 5);
    return [key, hashedKey];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginManager
});
//# sourceMappingURL=loginmanager.js.map
