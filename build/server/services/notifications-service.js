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
var notifications_service_exports = {};
__export(notifications_service_exports, {
  sendNotificationViaSupabase: () => sendNotificationViaSupabase
});
module.exports = __toCommonJS(notifications_service_exports);
var import_supabase_service = require("./supabase-service");
var import_supabase_config = require("../supabase/supabase-config");
var import_node_crypto = require("node:crypto");
function normalizeNotificationContent(content, sourceStateId) {
  if (content == null) {
    return null;
  }
  if (typeof content === "string") {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return null;
    }
    try {
      const parsedContent = JSON.parse(trimmedContent);
      if (parsedContent && typeof parsedContent === "object") {
        const parsedNotification = parsedContent;
        const title = typeof parsedNotification.title === "string" && parsedNotification.title.trim() ? parsedNotification.title.trim() : "Notification";
        const body = typeof parsedNotification.body === "string" && parsedNotification.body.trim() ? parsedNotification.body.trim() : trimmedContent;
        return {
          id: (0, import_node_crypto.randomUUID)().toString(),
          title,
          body,
          data: {
            ...parsedNotification,
            sourceStateId
          },
          ts: Date.now()
        };
      }
    } catch {
    }
    return {
      id: (0, import_node_crypto.randomUUID)().toString(),
      title: "Notification",
      body: trimmedContent,
      data: {
        sourceStateId
      },
      ts: Date.now()
    };
  }
  if (typeof content === "object") {
    const notification = content;
    const title = typeof notification.title === "string" && notification.title.trim() ? notification.title.trim() : "Notification";
    const bodyCandidate = notification.body;
    const body = typeof bodyCandidate === "string" ? bodyCandidate.trim() || "Notification" : bodyCandidate != null ? bodyCandidate.toString().trim() || "Notification" : "Notification";
    return {
      id: (0, import_node_crypto.randomUUID)().toString(),
      title,
      body,
      data: {
        ...notification,
        sourceStateId
      },
      ts: Date.now()
    };
  }
  const fallbackBody = String(content).trim();
  if (!fallbackBody) {
    return null;
  }
  return {
    id: (0, import_node_crypto.randomUUID)().toString(),
    title: "Notification",
    body: fallbackBody,
    data: {
      sourceStateId
    },
    ts: Date.now()
  };
}
async function sendNotificationViaSupabase(adapter, sourceStateId, content) {
  const userUUID = adapter.config.userUUID;
  if (!userUUID) {
    adapter.log.warn(`Cannot send notification for ${sourceStateId}: missing userUUID in adapter config`);
    return false;
  }
  const deviceIdMatch = sourceStateId.match(/\.devices\.([^.]+)\./);
  const deviceId = deviceIdMatch ? deviceIdMatch[1] : null;
  if (!deviceId) {
    adapter.log.warn(`Cannot extract device_id from ${sourceStateId}`);
    return false;
  }
  const notification = normalizeNotificationContent(content, sourceStateId);
  if (!notification) {
    adapter.log.warn(`Cannot send notification for ${sourceStateId}: empty payload`);
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
      if (typeof stateObj.val === "string") {
        const parsed = JSON.parse(stateObj.val);
        if (Array.isArray(parsed)) {
          currentQueue = parsed;
        }
      } else if (Array.isArray(stateObj.val)) {
        currentQueue = stateObj.val;
      }
    } catch (e) {
      adapter.log.warn(`Could not parse notification_queue for ${deviceId}: ${e}`);
    }
  }
  currentQueue.push({
    ...notification
  });
  if (currentQueue.length > MAX_QUEUE_SIZE) {
    const dropped = currentQueue.length - MAX_QUEUE_SIZE;
    currentQueue = currentQueue.slice(dropped);
    adapter.log.warn(
      `Notification queue for ${deviceId} exceeded ${MAX_QUEUE_SIZE}, dropped ${dropped} oldest entries`
    );
  }
  await adapter.setStateAsync(notificationQueueStateId, JSON.stringify(currentQueue), true);
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
    adapter.log.error(`Failed to send notification for ${sourceStateId}: ${errorMessage}`);
    return false;
  }
  adapter.log.debug(
    `Notification for ${sourceStateId} sent successfully via Supabase${data ? `: ${JSON.stringify(data)}` : ""}`
  );
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendNotificationViaSupabase
});
//# sourceMappingURL=notifications-service.js.map
