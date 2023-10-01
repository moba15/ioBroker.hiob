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
var datapoint_history_data_exports = {};
__export(datapoint_history_data_exports, {
  DatapointHistoryData: () => DatapointHistoryData
});
module.exports = __toCommonJS(datapoint_history_data_exports);
class DatapointHistoryData {
  constructor(datapoint, method, lastUpadted, lowerBound, upperBound) {
    this.datapoint = datapoint;
    this.method = method;
    this.lastUpdated = lastUpadted;
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DatapointHistoryData
});
//# sourceMappingURL=datapoint_history_data.js.map
