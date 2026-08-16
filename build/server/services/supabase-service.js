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
var supabase_service_exports = {};
__export(supabase_service_exports, {
  createSupabaseUser: () => createSupabaseUser,
  getAuthenticatedSupabaseClient: () => getAuthenticatedSupabaseClient,
  loginSupabaseUser: () => loginSupabaseUser,
  logoutSupabaseUser: () => logoutSupabaseUser
});
module.exports = __toCommonJS(supabase_service_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_supabase_config = require("../supabase/supabase-config");
let authenticatedClient = null;
function getAuthenticatedSupabaseClient() {
  return authenticatedClient;
}
async function createSupabaseUser(adapter, password) {
  var _a;
  adapter.log.debug("Creating user in Supabase");
  if (!import_supabase_config.SUPABASE_ANON_KEY) {
    adapter.log.error("Failed to create user in Supabase: missing SUPABASE_ANON_KEY");
    return null;
  }
  const supabase = (0, import_supabase_js.createClient)(import_supabase_config.SUPABASE_URL, import_supabase_config.SUPABASE_ANON_KEY);
  const { data, error } = await supabase.functions.invoke("registerNewUser", {
    // Pass an object directly. Supabase handles JSON.stringify automatically.
    body: { password }
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
        adapter.log.debug(
          `Failed to parse Edge Function error context: ${e instanceof Error ? e.message : String(e)}`
        );
      }
    }
    adapter.log.error(`Failed to create user in Supabase: ${errorMessage}`);
    return null;
  }
  const uuid = (_a = data == null ? void 0 : data.user) == null ? void 0 : _a.id;
  if (!uuid) {
    adapter.log.error("Failed to create user in Supabase: no uuid returned by function");
    return null;
  }
  adapter.log.debug(`User created successfully in Supabase with uuid ${uuid} and password ${password}`);
  return uuid;
}
async function loginSupabaseUser(adapter, userUuid, password) {
  adapter.log.debug(`Attempting to log into Supabase for user ${userUuid}`);
  if (!import_supabase_config.SUPABASE_ANON_KEY) {
    adapter.log.error("Failed to login to Supabase: missing SUPABASE_ANON_KEY");
    return "Error: Missing Configuration";
  }
  if (!userUuid || !password) {
    authenticatedClient = null;
    return "Logged out";
  }
  const supabase = (0, import_supabase_js.createClient)(import_supabase_config.SUPABASE_URL, import_supabase_config.SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${userUuid.trim()}@hiob-app.local`,
    password: password.trim()
  });
  if (error) {
    adapter.log.error(`Supabase login failed: ${error.message}`);
    authenticatedClient = null;
    return `Error: ${error.message}`;
  }
  if (data.session) {
    adapter.log.debug("Successfully logged into Supabase");
    authenticatedClient = supabase;
    return "Logged in";
  }
  authenticatedClient = null;
  return "Logged out";
}
async function logoutSupabaseUser(adapter) {
  adapter.log.debug("Attempting to log out from Supabase");
  authenticatedClient = null;
  if (!import_supabase_config.SUPABASE_ANON_KEY) {
    return;
  }
  const supabase = (0, import_supabase_js.createClient)(import_supabase_config.SUPABASE_URL, import_supabase_config.SUPABASE_ANON_KEY);
  const { error } = await supabase.auth.signOut();
  if (error) {
    adapter.log.error(`Supabase logout failed: ${error.message}`);
  } else {
    adapter.log.debug("Successfully logged out from Supabase");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSupabaseUser,
  getAuthenticatedSupabaseClient,
  loginSupabaseUser,
  logoutSupabaseUser
});
//# sourceMappingURL=supabase-service.js.map
