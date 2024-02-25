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
var history_bound_exports = {};
__export(history_bound_exports, {
  HistoryBound: () => HistoryBound
});
module.exports = __toCommonJS(history_bound_exports);
var HistoryBound = ((HistoryBound2) => {
  HistoryBound2[HistoryBound2["now"] = Date.now()] = "now";
  HistoryBound2[HistoryBound2["end_of_month"] = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getMilliseconds()] = "end_of_month";
  HistoryBound2[HistoryBound2["start_of_month"] = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getMilliseconds()] = "start_of_month";
  return HistoryBound2;
})(HistoryBound || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HistoryBound
});
//# sourceMappingURL=history_bound.js.map
