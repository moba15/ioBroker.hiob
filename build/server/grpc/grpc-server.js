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
var grpc_server_exports = {};
__export(grpc_server_exports, {
  GrpcServer: () => GrpcServer
});
module.exports = __toCommonJS(grpc_server_exports);
var grpc = __toESM(require("@grpc/grpc-js"));
var import_login_service = require("../services/login-service");
var import_state_service = require("../services/state-service");
class GrpcServer {
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
    this.gRpcServer = new grpc.Server();
    this.gRpcServer.bindAsync("0.0.0.0:" + this.port, grpc.ServerCredentials.createInsecure(), () => {
      this.adapter.log.info("Server listening on port: " + this.port);
    });
    if (this.adapter == null) {
      throw Error("Adapater null");
    }
    (0, import_login_service.addLoginServices)(this.gRpcServer, this.adapter);
    (0, import_state_service.addStateServices)(this.gRpcServer, this.adapter);
  }
  broadcastMsg(msg) {
    this.conClients.filter((e) => !e.onlySendNotification).forEach((element) => {
      if (element.isConnected)
        element.sendMSG(msg, true);
    });
  }
  isConnected(deviceID) {
    return this.conClients.some((c) => c.isConnected && c.id == deviceID);
  }
  getClient(deviceID) {
    return this.conClients.find((c) => c.isConnected && c.id == deviceID);
  }
  stop() {
    this.adapter.log.info("Server stoped");
    this.stoped = true;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GrpcServer
});
//# sourceMappingURL=grpc-server.js.map
