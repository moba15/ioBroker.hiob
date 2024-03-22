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
var server_exports = {};
__export(server_exports, {
  Server: () => Server
});
module.exports = __toCommonJS(server_exports);
var ws = __toESM(require("ws"));
var fs = __toESM(require("fs"));
var import_https = require("https");
var import_client = require("./client");
var import_datapacks = require("./datapacks");
class Server {
  constructor(port = 4500, keyPath = "key.pem", certPath = "cert.pem", adapter, useCert = false) {
    this.stoped = false;
    this.conClients = [];
    this.port = port;
    this.certPath = certPath;
    this.keyPath = keyPath;
    this.adapter = adapter;
    this.useCert = useCert;
  }
  startServer() {
    let server;
    if (this.useCert) {
      server = (0, import_https.createServer)({
        cert: fs.readFileSync(this.certPath),
        key: fs.readFileSync(this.keyPath)
      });
      this.adapter.log.info("[Server] Starting secure server...");
      this.socket = new ws.Server({ server });
    } else {
      this.adapter.log.info("[Server] Starting server...");
      this.socket = new ws.Server({ port: this.port });
    }
    this.socket.on("error", (e) => {
      this.adapter.log.info("error: " + e.message);
      this.adapter.setState("info.connection", false, true);
    });
    this.adapter.setState("info.connection", true, true);
    this.socket.on("connection", (socket, req) => {
      this.adapter.log.debug("Client connected");
      this.conClients.push(new import_client.Client(socket, this, req, this.adapter));
      socket.send(new import_datapacks.FirstPingPack().toJSON());
    });
    server == null ? void 0 : server.listen(this.port);
    this.adapter.log.info("Server started and is listening on port: " + this.port);
    this.stoped = false;
  }
  broadcastMsg(msg, notification) {
    this.conClients.filter((e) => !e.onlySendNotification).forEach((element) => {
      if (element.isConnected)
        element.sendMSG(msg, true);
    });
  }
  isConnected(deviceID) {
    return this.conClients.some((c) => c.isConnected && c.id == deviceID);
  }
  getClient(deviceID, onlySendNotificationClient = false) {
    return this.conClients.find(
      (c) => c.isConnected && c.id == deviceID && c.onlySendNotification == onlySendNotificationClient
    );
  }
  stop() {
    var _a;
    for (const client of this.conClients) {
      client.stop();
    }
    (_a = this.socket) == null ? void 0 : _a.close();
    this.adapter.log.info("Server stoped");
    this.stoped = true;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Server
});
//# sourceMappingURL=server.js.map
