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
  createUserForNotificationService: () => createUserForNotificationService
});
module.exports = __toCommonJS(notifications_service_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_supabase_config = require("../supabase/supabase-config");
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
  adapter.log.debug(`User for notification service created successfully with uuid ${uuid}`);
  return uuid;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUserForNotificationService
});
//# sourceMappingURL=notifications-service.js.map
