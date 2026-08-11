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
  createUserForNotificationService: () => createUserForNotificationService,
  sendNotificationViaSupabase: () => sendNotificationViaSupabase
});
module.exports = __toCommonJS(notifications_service_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_supabase_config = require("../supabase/supabase-config");
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
          title,
          body,
          data: {
            ...parsedNotification,
            sourceStateId
          }
        };
      }
    } catch {
    }
    return {
      title: "Notification",
      body: trimmedContent,
      data: {
        sourceStateId
      }
    };
  }
  if (typeof content === "object") {
    const notification = content;
    const title = typeof notification.title === "string" && notification.title.trim() ? notification.title.trim() : "Notification";
    const bodyCandidate = notification.body;
    const body = typeof bodyCandidate === "string" ? bodyCandidate.trim() || "Notification" : bodyCandidate != null ? String(bodyCandidate) : "Notification";
    return {
      title,
      body,
      data: {
        ...notification,
        sourceStateId
      }
    };
  }
  const fallbackBody = String(content).trim();
  if (!fallbackBody) {
    return null;
  }
  return {
    title: "Notification",
    body: fallbackBody,
    data: {
      sourceStateId
    }
  };
}
async function createUserForNotificationService(adapter, password) {
  var _a;
  adapter.log.debug("Creating user for notification service");
  if (!import_supabase_config.SUPABASE_ANON_KEY) {
    adapter.log.error("Failed to create user for notification service: missing SUPABASE_ANON_KEY");
    return null;
  }
  const supabase = (0, import_supabase_js.createClient)(import_supabase_config.SUPABASE_URL, import_supabase_config.SUPABASE_ANON_KEY);
  const { data, error } = await supabase.functions.invoke("registerNewUser", {
    // Pass an object directly. Supabase handles JSON.stringify automatically.
    body: { password }
  });
  if (error) {
    adapter.log.error(`Failed to create user for notification service: ${error.message}`);
    return null;
  }
  const uuid = (_a = data == null ? void 0 : data.user) == null ? void 0 : _a.id;
  if (!uuid) {
    adapter.log.error("Failed to create user for notification service: no uuid returned by function");
    return null;
  }
  adapter.log.debug(`User for notification service created successfully with uuid ${uuid} and ${password}`);
  return uuid;
}
async function sendNotificationViaSupabase(adapter, sourceStateId, content) {
  const userUUID = adapter.config.userUUID;
  if (!userUUID) {
    adapter.log.warn(`Cannot send notification for ${sourceStateId}: missing userUUID in adapter config`);
    return false;
  }
  const notification = normalizeNotificationContent(content, sourceStateId);
  if (!notification) {
    adapter.log.warn(`Cannot send notification for ${sourceStateId}: empty payload`);
    return false;
  }
  if (!import_supabase_config.SUPABASE_ANON_KEY) {
    adapter.log.error("Failed to send notification: missing SUPABASE_ANON_KEY");
    return false;
  }
  const supabase = (0, import_supabase_js.createClient)(import_supabase_config.SUPABASE_URL, import_supabase_config.SUPABASE_ANON_KEY);
  const { error, data } = await supabase.functions.invoke("send-notification", {
    body: {
      user_id: userUUID,
      title: notification.title,
      body: notification.body,
      data: notification.data
    }
  });
  if (error) {
    let errorMessage = error.message;
    if (error.context && typeof error.context.json === "function") {
      try {
        const responseBody = await error.context.json();
        if (responseBody && responseBody.error) {
          errorMessage = responseBody.error;
        }
      } catch (e) {
        adapter.log.debug(`Failed to parse Edge Function error context: ${e instanceof Error ? e.message : String(e)}`);
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
  createUserForNotificationService,
  sendNotificationViaSupabase
});
//# sourceMappingURL=notifications-service.js.map
