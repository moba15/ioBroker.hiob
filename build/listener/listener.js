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
var listener_exports = {};
__export(listener_exports, {
  Events: () => Events,
  Listener: () => Listener,
  StateChangeEvent: () => StateChangeEvent
});
module.exports = __toCommonJS(listener_exports);
var import_stream = require("stream");
var import_datapacks = require("../server/datapacks");
var Events = /* @__PURE__ */ ((Events2) => {
  Events2["StateChange"] = "stateChanged";
  return Events2;
})(Events || {});
class Listener extends import_stream.EventEmitter {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }
  onStateChange(id, state) {
    var _a;
    if (state != null) {
      if (!id.startsWith("hiob.")) {
        if (this.adapter.valueDatapoints[id] == null) {
          this.adapter.valueDatapoints[id] = {};
        }
        this.adapter.valueDatapoints[id].val = state.val;
        this.adapter.valueDatapoints[id].ack = state.ack;
        (_a = this.adapter.server) == null ? void 0 : _a.broadcastMsg(
          new import_datapacks.StateChangedDataPack(id, state.val, state.ack, state.lc, state.ts).toJSON()
        );
      }
      this.emit("stateChanged" /* StateChange */, new StateChangeEvent(id, state.val, state.ack));
    } else {
      this.emit("stateDeleted", new StateChangeEvent(id, null, null));
      this.adapter.log.info(`state ${id} deleted`);
    }
  }
}
class StateChangeEvent {
  constructor(objectID, value, ack) {
    this.objectID = objectID;
    this.value = value;
    this.ack = ack;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Events,
  Listener,
  StateChangeEvent
});
//# sourceMappingURL=listener.js.map
