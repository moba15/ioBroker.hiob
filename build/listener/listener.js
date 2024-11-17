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
var import_async_mutex = require("async-mutex");
var Events = /* @__PURE__ */ ((Events2) => {
  Events2["StateChange"] = "stateChanged";
  return Events2;
})(Events || {});
const _Listener = class _Listener extends import_stream.EventEmitter {
  constructor(adapter) {
    super();
    this.busy = false;
    this.subsribedStates = /* @__PURE__ */ new Map();
    this.subscribedStates = /* @__PURE__ */ new Set();
    this.pendingSubscribeStates = /* @__PURE__ */ new Set();
    this.mutex = new import_async_mutex.Mutex();
    this.adapter = adapter;
  }
  onStateChange(id, state) {
    var _a;
    if (state != null) {
      if (!id.startsWith("hiob.")) {
        const adapaterKey = id.split(".")[0] + "." + id.split(".")[1];
        if (this.subscribedStates.has(id)) {
          if (this.adapter.valueDatapoints[id] == null) {
            this.adapter.valueDatapoints[id] = {};
          }
          this.adapter.valueDatapoints[id].val = state.val;
          this.adapter.valueDatapoints[id].ack = state.ack;
          (_a = this.adapter.server) == null ? void 0 : _a.broadcastMsg(
            new import_datapacks.StateChangedDataPack(id, state.val, state.ack, state.lc, state.ts).toJSON()
          );
        }
      }
      this.emit("stateChanged" /* StateChange */, new StateChangeEvent(id, state.val, state.ack));
      this.emit("stateChanged" /* StateChange */ + id, new StateChangeEvent(id, state.val, state.ack));
    } else {
      this.emit("stateDeleted", new StateChangeEvent(id, null, null));
      this.adapter.log.info(`state ${id} deleted`);
    }
  }
  /**
   * Adds a State id to the pending list
   * @param id The id of the State you want to subscribe to
   */
  addPendingSubscribeState(id) {
    this.mutex.runExclusive(async () => {
      if (this.subscribedStates.has(id)) {
        return;
      }
      this.pendingSubscribeStates.add(id);
      const adapaterKey = id.split(".")[0] + "." + id.split(".")[1];
      if (this.subsribedStates.has(adapaterKey)) {
        const t = this.subsribedStates.get(adapaterKey);
        if (!t.subscribed.has(id)) {
          t == null ? void 0 : t.pending.add(id);
        } else {
          this.adapter.log.debug("Already has subscribed to " + id + "!");
        }
      } else {
        this.subsribedStates.set(adapaterKey, { overThreshold: false, subscribed: /* @__PURE__ */ new Set(), pending: /* @__PURE__ */ new Set([id]) });
      }
    });
  }
  /**
   * Subscribes to all States listed in the pending (see addPendingSubscribeState)
   * If there are more than 50 subscriptions for one instance it subscribses to all changes inside this instance
   */
  subscribeToPendingStates() {
    this.mutex.runExclusive(async () => {
      if (this.subscribedStates.size >= _Listener.subscribtionThresholdPerInstance) {
        this.pendingSubscribeStates.forEach((e) => this.subscribedStates.add(e));
        this.pendingSubscribeStates.clear();
      } else {
        for (const [adapaterKey, subsribedStatesStatus] of this.subsribedStates) {
          if (subsribedStatesStatus.pending.size > 0) {
            if (subsribedStatesStatus.overThreshold) {
              subsribedStatesStatus.pending.forEach((e) => subsribedStatesStatus.subscribed.add(e));
            } else {
              const newSubscriptionSize = subsribedStatesStatus.pending.size + subsribedStatesStatus.subscribed.size;
              if (newSubscriptionSize > _Listener.subscribtionThresholdPerInstance && !adapaterKey.startsWith("alias.")) {
                subsribedStatesStatus.pending.forEach((e) => {
                  subsribedStatesStatus.subscribed.add(e);
                });
                this.adapter.log.debug("More than " + _Listener.subscribtionThresholdPerInstance + " states of " + adapaterKey + " were subscribed. Now only listening to " + adapaterKey + ".*");
                await this.adapter.subscribeForeignStatesAsync(adapaterKey + ".*");
                for (const i of subsribedStatesStatus.subscribed) {
                  this.adapter.unsubscribeForeignStatesAsync(i);
                }
              } else {
                subsribedStatesStatus.pending.forEach((e) => {
                  subsribedStatesStatus.subscribed.add(e);
                  this.adapter.subscribeForeignStates(e);
                });
              }
            }
            subsribedStatesStatus.pending.clear();
          }
        }
      }
    });
  }
};
_Listener.subscribtionThresholdPerInstance = 15;
let Listener = _Listener;
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
