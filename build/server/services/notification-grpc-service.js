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
var notification_grpc_service_exports = {};
__export(notification_grpc_service_exports, {
  addNotificationServices: () => addNotificationServices
});
module.exports = __toCommonJS(notification_grpc_service_exports);
var proto = __toESM(require("../../generated/notification/notification"));
var import_authenticator = require("./authenticator/authenticator");
function addNotificationServices(gRpcServer, adapter) {
  gRpcServer.addService(proto.UnimplementedNotificationServiceService.definition, {
    fetchNotifications: async (call, callback) => {
      var _a;
      try {
        const authStatus = await (0, import_authenticator.checkAuthentication)(call.metadata, adapter);
        if (authStatus.code !== 0) {
          callback({ code: authStatus.code, message: (_a = authStatus.details) != null ? _a : "Unauthenticated" }, null);
          return;
        }
        const request = call.request;
        const deviceId = request.deviceId;
        if (!deviceId) {
          callback({ code: 3, message: "Missing deviceId" }, null);
          return;
        }
        const notificationQueueStateId = `devices.${deviceId}.notification_queue`;
        const stateObj = await adapter.getStateAsync(notificationQueueStateId);
        let currentQueue = [];
        if (stateObj && stateObj.val) {
          try {
            let parsed;
            if (typeof stateObj.val === "string") {
              parsed = JSON.parse(stateObj.val);
            } else if (Array.isArray(stateObj.val)) {
              parsed = stateObj.val;
            } else {
              parsed = [];
            }
            if (Array.isArray(parsed)) {
              currentQueue = parsed.map(
                (item) => proto.NotificationContent.fromObject({
                  id: item.id || "",
                  title: item.title || "",
                  body: item.body || "",
                  ts: item.ts || 0,
                  group: item.group || false,
                  groupKey: item.groupKey,
                  locked: item.locked || false,
                  data: Array.isArray(item.data) ? item.data : []
                })
              );
            }
          } catch (e) {
            adapter.log.warn(`Could not parse notification_queue for ${deviceId}: ${e}`);
          }
        }
        callback(null, proto.FetchNotificationsResponse.fromObject({ notifications: currentQueue }));
      } catch (e) {
        callback({ code: 13, message: e instanceof Error ? e.message : String(e) }, null);
      }
    },
    ackNotifications: async (call, callback) => {
      var _a;
      try {
        const authStatus = await (0, import_authenticator.checkAuthentication)(call.metadata, adapter);
        if (authStatus.code !== 0) {
          callback({ code: authStatus.code, message: (_a = authStatus.details) != null ? _a : "Unauthenticated" }, null);
          return;
        }
        const request = call.request;
        const deviceId = request.deviceId;
        const ackIds = request.notificationIds || [];
        if (!deviceId) {
          callback({ code: 3, message: "Missing deviceId" }, null);
          return;
        }
        if (ackIds.length > 0) {
          const notificationQueueStateId = `devices.${deviceId}.notification_queue`;
          const stateObj = await adapter.getStateAsync(notificationQueueStateId);
          if (stateObj && stateObj.val) {
            try {
              let parsed = [];
              if (typeof stateObj.val === "string") {
                parsed = JSON.parse(stateObj.val);
              } else if (Array.isArray(stateObj.val)) {
                parsed = stateObj.val;
              }
              if (Array.isArray(parsed)) {
                const newQueue = parsed.filter((item) => !ackIds.includes(item.id));
                await adapter.setStateAsync(notificationQueueStateId, JSON.stringify(newQueue), true);
              }
            } catch (e) {
              adapter.log.warn(`Could not parse/update notification_queue for ${deviceId}: ${e}`);
              callback({ code: 13, message: e instanceof Error ? e.message : String(e) }, null);
            }
          }
        }
        callback(null, proto.AckNotificationsResponse.fromObject({ success: true }));
      } catch (e) {
        callback({ code: 13, message: e instanceof Error ? e.message : String(e) }, null);
      }
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addNotificationServices
});
//# sourceMappingURL=notification-grpc-service.js.map
