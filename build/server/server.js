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
var import_async_mutex = require("async-mutex");
class Server {
  constructor(port = 4500, keyPath = "key.pem", certPath = "cert.pem", adapter, useCert = false) {
    this.stoped = false;
    this.clientMutex = new import_async_mutex.Mutex();
    this.conClients = [];
    this.messageBacklogForClient = [];
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
      this.adapter.log.info(`error: ${e.message}`);
      this.adapter.setState("info.connection", false, true);
    });
    this.adapter.setState("info.connection", true, true);
    this.socket.on("connection", (socket, req) => {
      this.adapter.log.debug("Client connected");
      this.conClients.push({
        client: new import_client.Client(socket, this, req, this.adapter),
        lastPong: true
      });
      socket.send(new import_datapacks.FirstPingPack().toJSON());
    });
    server == null ? void 0 : server.listen(this.port);
    this.adapter.log.info(`Server started and is listening on port: ${this.port}`);
    this.stoped = false;
    this.startPingPong();
  }
  startPingPong() {
    this.pingPongInterval = this.adapter.setInterval(this.pingAll.bind(this), 15 * 1e3);
  }
  async pingAll() {
    await this.clientMutex.runExclusive(() => {
      this.conClients = this.conClients.filter((e) => {
        if (e.lastPong) {
          return true;
        }
        e.client.onEnd();
        let backlog = this.messageBacklogForClient.find((c) => c.clientId == e.client.id);
        if (!backlog) {
          backlog = { clientId: e.client.id, backlog: [] };
          this.messageBacklogForClient.push(backlog);
        }
        e.client.messageHistoryMutex.runExclusive(() => {
          backlog.backlog.push(...e.client.messageHistory);
        });
        this.sendBacklog(e.client);
        return false;
      });
    });
    this.adapter.log.debug(`Size: ${this.conClients.length.toString()}`);
    this.conClients.forEach((e) => {
      e.lastPong = false;
      e.client.socket.ping();
    });
  }
  sendBacklog(client) {
    const backlog = this.messageBacklogForClient.find((e) => e.clientId == client.id);
    backlog == null ? void 0 : backlog.backlog.forEach((msg) => client.sendMSG(msg, true));
    if (backlog) {
      backlog.backlog = [];
    }
  }
  broadcastMsg(msg) {
    this.conClients.filter((e) => !e.client.onlySendNotification).forEach((element) => {
      if (element.client.isConnected) {
        element.client.sendMSG(msg, true);
      }
    });
  }
  isConnected(deviceID) {
    return this.conClients.some((c) => c.client.isConnected && c.client.id == deviceID);
  }
  getClient(deviceID) {
    var _a;
    return (_a = this.conClients.find((c) => c.client.isConnected && c.client.id == deviceID)) == null ? void 0 : _a.client;
  }
  getClients(deviceID) {
    return this.conClients.filter((c) => c.client.isConnected && c.client.id == deviceID).map((e) => e.client);
  }
  stop() {
    var _a;
    (_a = this.socket) == null ? void 0 : _a.close();
    this.adapter.log.info("Server stoped");
    this.stoped = true;
    this.adapter.clearInterval(this.pingPongInterval);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Server
});
//# sourceMappingURL=server.js.map
