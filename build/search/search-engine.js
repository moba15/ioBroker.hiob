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
var search_engine_exports = {};
__export(search_engine_exports, {
  StateSearchEngine: () => StateSearchEngine
});
module.exports = __toCommonJS(search_engine_exports);
class StateSearchEngine {
  constructor(adapter) {
    this.firstLevel = /* @__PURE__ */ new Map();
    this.adapater = adapter;
  }
  async loadFirstLevel() {
    const allObjects = await this.adapater.getForeignObjectsAsync("*");
    for (const obj in allObjects) {
      const splitted = obj.split(".");
      if (splitted.length < 2) {
        continue;
      }
      const level = splitted[0] + "." + splitted[1];
      if (this.firstLevel.has(level)) {
        continue;
      }
      const adapaterObj = await this.adapater.getForeignObjectAsync(level);
      if (adapaterObj != null) {
        this.firstLevel.set(level, adapaterObj);
      }
    }
  }
  /**
   * Get the first layer of states. So basicly all adapters
   */
  getFirstLevel() {
    return this.firstLevel;
  }
  /**
   * Searches states by pattern
   */
  async searchKeyWord(keyword) {
    const allObjects = await this.adapater.getForeignObjectsAsync("*" + keyword + "*");
    for (const obj in allObjects) {
    }
  }
  getPossibleEnums() {
  }
  getPossibleFunctions() {
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StateSearchEngine
});
//# sourceMappingURL=search-engine.js.map
