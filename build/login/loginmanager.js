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
    this.approveLoginsTimeout = void 0;
  }
  async onStateChange(event) {
    var _a, _b, _c;
    this.adapter.log.debug(JSON.stringify(event));
    if (event.objectID.startsWith("hiob.") && !event.ack) {
      const splited = event.objectID.split(".");
      if (splited.length > 4 && splited[2] == "devices") {
        const deviceID = splited[3];
        if (splited[4] == "approved") {
          const cl = this.pendingClients.find((e) => e.id == deviceID);
          if (cl && event.value) {
            this.setAndSendLoginKeys(deviceID, cl);
          } else {
            const client = (_a = this.adapter.server) == null ? void 0 : _a.getClient(deviceID);
            if (client) {
              this.setAndSendLoginKeys(deviceID, client);
            } else {
              this.adapter.log.debug("No pending client found");
            }
          }
          this.adapter.setStateAsync(event.objectID, { ack: true });
        } else if (splited[4] == "aesKey_active") {
          const cl = this.pendingClients.find((e) => e.id == deviceID);
          if (cl) {
            if (event.value) {
              this.setAesStatus(deviceID, cl);
            } else {
              cl.setAESKey("");
              this.adapter.log.info(`AES encryption disabled!`);
            }
            this.adapter.setState(event.objectID, { ack: true });
          } else {
            const client = (_b = this.adapter.server) == null ? void 0 : _b.getClient(deviceID);
            if (client) {
              this.setAesStatus(deviceID, client);
            } else {
              this.adapter.log.debug("No pending client found");
            }
          }
          this.adapter.setStateAsync(event.objectID, { ack: true });
        } else if (splited[4] == "aesKey_new") {
          const cl = this.pendingClients.find((e) => e.id == deviceID);
          if (cl) {
            if (event.value) {
              this.setAesNewAndSentInfo(deviceID, cl);
            }
            this.adapter.setState(event.objectID, false, true);
          } else {
            const client = (_c = this.adapter.server) == null ? void 0 : _c.getClient(deviceID);
            if (client && event.value) {
              this.setAesNewAndSentInfo(deviceID, client);
            } else {
              this.adapter.log.debug("No pending client found");
            }
          }
          this.adapter.setStateAsync(event.objectID, false, true);
        } else if (splited[4] == "noPwdAllowed") {
          this.adapter.setStateAsync(event.objectID, { ack: true });
        }
      } else if (splited[2] == "approveNextLogins") {
        if (event.value) {
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
    }
  }
  async setAesNewAndSentInfo(deviceID, cl) {
    const random_key = this.genRandomString(6, true);
    await this.adapter.setStateAsync(`devices.${deviceID}.aesKey`, random_key, true);
    cl.aesKey = random_key;
    cl.setAESKey(random_key);
    cl.sendMSG(new import_datapacks.NewAesPacket().toJSON(), false);
  }
  async setAesStatus(deviceID, cl) {
    const get_aes = await this.adapter.getStateAsync(`devices.${deviceID}.aesKey`);
    const aes_status = await this.adapter.getStateAsync("devices." + deviceID + ".aesKey_active");
    if (get_aes && get_aes.val && aes_status && aes_status.val) {
      cl.setAESKey(get_aes.val.toString());
      this.adapter.log.info(`AES encryption enabled!`);
    } else {
      cl.setAESKey("");
      this.adapter.log.info(`AES encryption disabled!`);
    }
  }
  async setAndSendLoginKeys(deviceID, cl) {
    const keys = await this.genKey();
    const aes_status = await this.adapter.getStateAsync("devices." + deviceID + ".aesKey_active");
    if (aes_status && aes_status.val) {
      const aes = await this.adapter.getStateAsync("devices." + deviceID + ".aesKey");
      if (aes != null && aes.val != null) {
        cl.setAESKey(aes.val.toString());
      } else {
        cl.setAESKey("");
      }
    } else {
      cl.setAESKey("");
    }
    await this.adapter.setStateAsync("devices." + deviceID + ".key", keys[1], true);
    for (const current of this.pendingClients) {
      if (current.id == cl.id) {
        current.sendMSG(new import_datapacks.LoginKeyPacket(keys[0]).toJSON(), false);
      }
    }
  }
  async stop() {
    this.approveLoginsTimeout && this.adapter.clearTimeout(this.approveLoginsTimeout);
    this.approveLoginsTimeout = void 0;
    return false;
  }
  async onWrongAesKey(client) {
    this.adapter.log.debug("Client(" + client.toString() + ") send wrong aes!");
    this.wrongAesKey(client);
    return false;
  }
  async onLoginRequest(client, loginRequestData) {
    this.adapter.log.debug("Client(" + client.toString() + ") requested to login");
    this.pendingClients.push(client);
    this.pendingClients = this.pendingClients.filter((cli, i, s) => s.indexOf(cli) == i);
    let deviceIDRep = loginRequestData.deviceID.replace(".", "-");
    while (deviceIDRep.includes(".")) {
      deviceIDRep = deviceIDRep.replace(".", "-");
    }
    client.id = deviceIDRep;
    if (!this.adapter.clientinfos[deviceIDRep] || !this.adapter.clientinfos[deviceIDRep].firstload) {
      this.adapter.clientinfos[deviceIDRep] = {};
    }
    //!Quick fix
    await this.createObjects(
      client,
      deviceIDRep,
      loginRequestData.deviceName,
      loginRequestData.key,
      loginRequestData.version
    );
    this.adapter.clientinfos[deviceIDRep].firstload = true;
    this.adapter.subscribeStatesAsync("devices." + deviceIDRep + ".approved");
    this.adapter.setStateAsync("devices." + deviceIDRep + ".connected", true, true);
    client.setID(deviceIDRep);
    if (!await this.validateLoginRequest(client, deviceIDRep, loginRequestData)) {
      this.loginDeclined(client);
      return false;
    }
    this.pendingClients = this.pendingClients.filter((cl) => cl != client);
    await this.setAesStatus(deviceIDRep, client);
    client.onApprove();
    const version = this.adapter.version != null ? this.adapter.version.toString() : "";
    client.sendMSG(new import_datapacks.LoginApprovedPacket(version).toJSON(), false);
    return true;
  }
  async validateLoginRequest(client, deviceIDRep, loginRequestData) {
    const approved = await this.adapter.getStateAsync("devices." + deviceIDRep + ".approved");
    const keyState = await this.adapter.getStateAsync("devices." + deviceIDRep + ".key");
    const needPWD = await this.adapter.getStateAsync("devices." + deviceIDRep + ".noPwdAllowed");
    let apr = true;
    if (!approved || !approved.val) {
      this.adapter.log.debug(
        "Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): not approved"
      );
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
        this.adapter.log.debug(
          "Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong password"
        );
        apr = false;
      }
    }
    if (loginRequestData.key == null) {
      apr = false;
    }
    if (keyState != null && keyState.val != null && loginRequestData.key && !await bcrypt.compare(loginRequestData.key, keyState.val.toString())) {
      this.adapter.log.debug(
        "Login declined for client: " + client.toString() + " (" + loginRequestData.deviceName + "): wrong key" + !await bcrypt.compare(loginRequestData.key, keyState.val.toString())
      );
      apr = false;
    }
    if (!apr && this.approveLogins) {
      await this.adapter.setStateAsync("devices." + deviceIDRep + ".approved", true, true);
      await this.setAndSendLoginKeys(deviceIDRep, client);
      apr = true;
    }
    return apr;
  }
  async createObjects(client, deviceIDRep, deviceName, key, version) {
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
    await this.adapter.setObjectAsync(`devices.${deviceIDRep}`, {
      type: "channel",
      common: {
        name: deviceName,
        desc: "Created by Adapter"
      },
      native: {}
    });
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
        desc: "Created by Adapter",
        def: "",
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.subscribeStatesAsync(`devices.${deviceIDRep}.sendNotification`);
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey`, {
      type: "state",
      common: {
        name: {
          en: "Insert AES-key into the APP.",
          de: "AES-key in die APP einf\xFCgen.",
          ru: "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044C AES-\u043A\u043B\u044E\u0447 \u0432 APP.",
          pt: "Insira o AES-key no APP.",
          nl: "Plaats AES-toets in de APP.",
          fr: "Ins\xE9rer la touche AES dans l'APP.",
          it: "Inserire AES-chiave nella APP.",
          es: "Inserte AES-key en el APP.",
          pl: "Wstaw klucz AES- do APP.",
          uk: "\u0412\u0441\u0442\u0430\u0432\u0442\u0435 AES-\u043A\u043B\u044E\u0447 \u0443 APP.",
          "zh-cn": "\u5728APP\u4E2D\u63D2\u5165AES\u952E."
        },
        type: "string",
        role: "state",
        desc: "Created by Adapter",
        def: "",
        read: true,
        write: false
      },
      native: {}
    });
    const get_aes = await this.adapter.getStateAsync(`devices.${deviceIDRep}.aesKey`);
    const random_key = this.genRandomString(6, true);
    if (!get_aes || get_aes.val == null || get_aes.val == "") {
      await this.adapter.setStateAsync(`devices.${deviceIDRep}.aesKey`, random_key, true);
      client.aesKey = random_key;
    } else if (get_aes != null && typeof get_aes.val === "string") {
      client.aesKey = get_aes.val;
    } else {
      this.adapter.log.warn("Cannot find AES Key. Please Restart Adapter!");
    }
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey_new`, {
      type: "state",
      common: {
        name: {
          en: "Create new AES-Key",
          de: "Neue AES-Key erstellen",
          ru: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0435 AES-Key",
          pt: "Criar novo AES-Key",
          nl: "Nieuwe AES-sleutel aanmaken",
          fr: "Cr\xE9er une nouvelle cl\xE9 AES",
          it: "Crea nuovo AES-Key",
          es: "Crear nuevo AES-Key",
          pl: "Utw\xF3rz nowy klucz AES-",
          uk: "\u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u043D\u043E\u0432\u0438\u0445 AES-Key",
          "zh-cn": "\u521B\u5EFA\u65B0 AES \u5BC6\u94A5"
        },
        type: "boolean",
        role: "button",
        desc: "Created by Adapter",
        def: false,
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.subscribeStatesAsync(`devices.${deviceIDRep}.aesKey_new`);
    await this.adapter.setObjectNotExistsAsync(`devices.${deviceIDRep}.aesKey_active`, {
      type: "state",
      common: {
        name: {
          en: "AES encryption active",
          de: "AES-Verschl\xFCsselung aktiv",
          ru: "\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0435 \u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u0438\u0435 AES",
          pt: "AES criptografia ativa",
          nl: "AES-versleuteling actief",
          fr: "Cryptage AES actif",
          it: "AES crittografia attiva",
          es: "AES encriptaci\xF3n activa",
          pl: "Aktywne szyfrowanie AES",
          uk: "AES \u0448\u0438\u0444\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0430",
          "zh-cn": "AES \u52A0\u5BC6\u6D3B\u52A8"
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
    await this.adapter.subscribeStatesAsync(`devices.${deviceIDRep}.aesKey_active`);
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
  loginDeclined(client) {
    client.sendMSG(new import_datapacks.LoginDeclinedPacket().toJSON(), false);
  }
  wrongAesKey(client) {
    client.sendMSG(new import_datapacks.WrongAesKeyPack().toJSON(), false);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginManager
});
//# sourceMappingURL=loginmanager.js.map
