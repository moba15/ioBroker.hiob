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
var notifications_service_exports = {};
__export(notifications_service_exports, {
  sendNotificationViaSupabase: () => sendNotificationViaSupabase
});
module.exports = __toCommonJS(notifications_service_exports);
var import_supabase_service = require("./supabase-service");
var import_supabase_config = require("../supabase/supabase-config");
var import_node_crypto = require("node:crypto");
var proto = __toESM(require("../../generated/notification/notification"));
function parseStrictNotificationContentPayload(content) {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return null;
  }
  const raw = content;
  if (typeof raw.id !== "string" || !raw.id.trim()) {
    return null;
  }
  if (typeof raw.title !== "string" || !raw.title.trim()) {
    return null;
  }
  if (typeof raw.body !== "string" || !raw.body.trim()) {
    return null;
  }
  if (typeof raw.ts !== "number" || !Number.isFinite(raw.ts) || raw.ts <= 0) {
    return null;
  }
  if (typeof raw.group !== "boolean") {
    return null;
  }
  if (!Array.isArray(raw.data) || raw.data.some((item) => typeof item !== "string")) {
    return null;
  }
  if (raw.groupKey != null && typeof raw.groupKey !== "string") {
    return null;
  }
  if (raw.locked != null && typeof raw.locked !== "boolean") {
    return null;
  }
  return {
    id: raw.id.trim(),
    title: raw.title.trim(),
    body: raw.body.trim(),
    ts: raw.ts,
    group: raw.group,
    data: raw.data,
    groupKey: typeof raw.groupKey === "string" ? raw.groupKey : void 0,
    locked: typeof raw.locked === "boolean" ? raw.locked : false
  };
}
function normalizeNotificationContent(content) {
  if (content == null) {
    return { notification: null, error: "Payload is null or undefined" };
  }
  if (typeof content === "string") {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { notification: null, error: "Payload string is empty" };
    }
    return {
      notification: proto.NotificationContent.fromObject({
        id: (0, import_node_crypto.randomUUID)().toString(),
        title: "Notification",
        body: trimmedContent,
        ts: Date.now(),
        group: false,
        data: [],
        locked: false
      })
    };
  }
  if (typeof content === "object") {
    const strictPayload = parseStrictNotificationContentPayload(content);
    if (!strictPayload) {
      return {
        notification: null,
        error: "Object payload does not satisfy NotificationContent"
      };
    }
    return {
      notification: proto.NotificationContent.fromObject(strictPayload)
    };
  }
  return {
    notification: null,
    error: `Unsupported payload type: ${typeof content}`
  };
}
async function sendNotificationViaSupabase(adapter, deviceId, content) {
  const userUUID = adapter.config.userUUID;
  if (!userUUID) {
    adapter.log.warn(`Cannot send notification to device ${deviceId}: missing userUUID in adapter config`);
    return false;
  }
  const { notification, error: normalizationError } = normalizeNotificationContent(content);
  if (!notification) {
    adapter.log.error(
      `Cannot send notification to device ${deviceId}: ${normalizationError != null ? normalizationError : "invalid notification payload"}`
    );
    return false;
  }
  const anonKey = (0, import_supabase_config.getSupabaseAnonKey)(adapter);
  if (!anonKey) {
    adapter.log.error("Failed to send notification: missing SUPABASE_ANON_KEY");
    return false;
  }
  const MAX_QUEUE_SIZE = 250;
  const notificationQueueStateId = `devices.${deviceId}.notification_queue`;
  const stateObj = await adapter.getStateAsync(notificationQueueStateId);
  let currentQueue = [];
  if (stateObj && stateObj.val) {
    try {
      let parsedQueue = [];
      if (typeof stateObj.val === "string") {
        const parsed = JSON.parse(stateObj.val);
        if (Array.isArray(parsed)) {
          parsedQueue = parsed;
        }
      } else if (Array.isArray(stateObj.val)) {
        parsedQueue = stateObj.val;
      }
      if (parsedQueue.length > 0) {
        currentQueue = parsedQueue.map((item) => {
          const raw = item && typeof item === "object" ? item : {};
          return proto.NotificationContent.fromObject({
            id: typeof raw.id === "string" ? raw.id : "",
            title: typeof raw.title === "string" ? raw.title : "Notification",
            body: typeof raw.body === "string" ? raw.body : "Notification",
            ts: typeof raw.ts === "number" ? raw.ts : 0,
            group: typeof raw.group === "boolean" ? raw.group : false,
            groupKey: typeof raw.groupKey === "string" ? raw.groupKey : void 0,
            locked: typeof raw.locked === "boolean" ? raw.locked : false,
            data: Array.isArray(raw.data) ? raw.data.filter((value) => typeof value === "string") : []
          });
        });
      }
    } catch (e) {
      adapter.log.warn(`Could not parse notification_queue for ${deviceId}: ${e}`);
    }
  }
  currentQueue.push(notification);
  if (currentQueue.length > MAX_QUEUE_SIZE) {
    const dropped = currentQueue.length - MAX_QUEUE_SIZE;
    currentQueue = currentQueue.slice(dropped);
    adapter.log.warn(
      `Notification queue for ${deviceId} exceeded ${MAX_QUEUE_SIZE}, dropped ${dropped} oldest entries`
    );
  }
  await adapter.setStateAsync(
    notificationQueueStateId,
    JSON.stringify(currentQueue.map((item) => item.toObject())),
    true
  );
  const supabase = (0, import_supabase_service.getAuthenticatedSupabaseClient)();
  if (!supabase) {
    adapter.log.error(
      "Failed to send notification: Supabase client is not authenticated. Is the adapter logged in?"
    );
    return false;
  }
  const { error, data } = await supabase.functions.invoke("send-notification", {
    body: {
      user_id: userUUID,
      device_id: deviceId
    }
  });
  if (error) {
    let errorMessage = error.message || String(error);
    if (error.context && typeof error.context.text === "function") {
      try {
        const textBody = await error.context.text();
        try {
          const responseBody = JSON.parse(textBody);
          if (responseBody && responseBody.error) {
            errorMessage += ` - Details: ${typeof responseBody.error === "object" ? JSON.stringify(responseBody.error) : responseBody.error}`;
          } else if (textBody) {
            errorMessage += ` - Details: ${textBody}`;
          }
        } catch {
          if (textBody) {
            errorMessage += ` - Details: ${textBody}`;
          }
        }
      } catch (e) {
        adapter.log.debug(
          `Failed to parse Edge Function error context: ${e instanceof Error ? e.message : String(e)}`
        );
      }
    }
    if (errorMessage === error.message || errorMessage === String(error)) {
      try {
        const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error));
        if (errorString !== "{}") {
          errorMessage += ` - Full Error: ${errorString}`;
        }
      } catch {
      }
    }
    adapter.log.error(`Failed to send notification to device ${deviceId}: ${errorMessage}`);
    return false;
  }
  adapter.log.debug(
    `Notification to device ${deviceId} sent successfully via Supabase${data ? `: ${JSON.stringify(data)}` : ""}`
  );
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendNotificationViaSupabase
});
//# sourceMappingURL=notifications-service.js.map
