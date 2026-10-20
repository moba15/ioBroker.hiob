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
var supabase_config_exports = {};
__export(supabase_config_exports, {
  getSupabaseAnonKey: () => getSupabaseAnonKey,
  getSupabaseUrl: () => getSupabaseUrl
});
module.exports = __toCommonJS(supabase_config_exports);
function getSupabaseUrl(adapter) {
  return adapter.config.supabaseUrl || "https://chvazplrvwsvznegekqy.supabase.co";
}
function getSupabaseAnonKey(adapter) {
  return adapter.config.supabaseAnonKey || "sb_publishable_3dW4LAbXNar4lLW8iyOLKQ_fucrNUi-";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSupabaseAnonKey,
  getSupabaseUrl
});
//# sourceMappingURL=supabase-config.js.map
