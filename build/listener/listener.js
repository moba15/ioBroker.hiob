"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var listener_exports = {};
__export(listener_exports, {
  Events: () => Events,
  Listener: () => Listener,
  StateChangeEvent: () => StateChangeEvent
});
module.exports = __toCommonJS(listener_exports);
var import_stream = require("stream");
var import_async_mutex = require("async-mutex");
var proto = __toESM(require("../generated/state/state"));
var Events = /* @__PURE__ */ ((Events2) => {
  Events2["StateChange"] = "stateChanged";
  return Events2;
})(Events || {});
const _Listener = class _Listener extends import_stream.EventEmitter {
  constructor(adapter) {
    super();
    this.busy = false;
    this.subscribedStates = /* @__PURE__ */ new Map();
    this.pendingSubscribeStates = /* @__PURE__ */ new Set();
    this.mutex = new import_async_mutex.Mutex();
    this.subscribedWritersMutex = new import_async_mutex.Mutex();
    this.subscribedWriters = [];
    this.adapter = adapter;
  }
  onStateChange(id, state) {
    var _a, _b;
    this.adapter.log.debug(`Send${JSON.stringify(this.pendingSubscribeStates)}`);
    if (state != null) {
      this.adapter.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
      if (!id.startsWith(`${this.adapter.namespace}.`)) {
        const adapterKey = `${id.split(".")[0]}.${id.split(".")[1]}`;
        if (this.subscribedStates.has(adapterKey) && ((_a = this.subscribedStates.get(adapterKey)) == null ? void 0 : _a.subscribed.has(id))) {
          if (this.adapter.valueDatapoints[id] == null) {
            this.adapter.valueDatapoints[id] = {};
          }
          this.adapter.valueDatapoints[id].val = state.val;
          this.adapter.valueDatapoints[id].ack = state.ack;
          const stateValueUpdate = new proto.StateValueUpdate({
            stateId: id,
            acc: state.ack,
            stringValue: (_b = state.val) == null ? void 0 : _b.toString(),
            time: state.ts
          });
          this.subscribedWriters.forEach(
            (e) => e.writer.write(new proto.StatesValueUpdate({ stateUpdates: [stateValueUpdate] }))
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
   *
   * @param id The id of the State you want to subscribe to
   */
  addPendingSubscribeState(id) {
    const adapterKey = `${id.split(".")[0]}.${id.split(".")[1]}`;
    if (!this.subscribedStates.has(adapterKey)) {
      this.adapter.log.debug(`Creating new subscription entry for adapter: ${adapterKey}`);
      this.subscribedStates.set(adapterKey, {
        overThreshold: false,
        subscribed: /* @__PURE__ */ new Set(),
        pending: /* @__PURE__ */ new Set([id])
      });
    } else {
      const subscribedStatesStatus = this.subscribedStates.get(adapterKey);
      if (subscribedStatesStatus && !subscribedStatesStatus.subscribed.has(id)) {
        this.adapter.log.debug(`Adding state ${id} to pending subscriptions for ${adapterKey}`);
        subscribedStatesStatus.pending.add(id);
      } else {
        this.adapter.log.debug(`State ${id} already subscribed for ${adapterKey}`);
      }
    }
  }
  /**
   * Subscribes to all States listed in the pending (see addPendingSubscribeState)
   * If there are more than 50 subscriptions for one instance it subscribses to all changes inside this instance
   */
  subscribeToPendingStates() {
    this.mutex.runExclusive(async () => {
      for (const [adapterKey, subscribedStatesStatus] of this.subscribedStates) {
        if (subscribedStatesStatus.pending.size > 0) {
          this.adapter.log.debug(
            `Processing ${subscribedStatesStatus.pending.size} pending subscriptions for ${adapterKey}`
          );
          if (subscribedStatesStatus.overThreshold) {
            this.adapter.log.debug(
              `Adapter ${adapterKey} already over threshold, adding pending states to subscribed`
            );
            subscribedStatesStatus.pending.forEach((e) => subscribedStatesStatus.subscribed.add(e));
          } else {
            const newSubscriptionSize = subscribedStatesStatus.pending.size + subscribedStatesStatus.subscribed.size;
            if (newSubscriptionSize > _Listener.subscribtionThresholdPerInstance && !adapterKey.startsWith("alias.")) {
              subscribedStatesStatus.pending.forEach((e) => {
                subscribedStatesStatus.subscribed.add(e);
              });
              this.adapter.log.debug(
                `More than ${_Listener.subscribtionThresholdPerInstance} states of ${adapterKey} were subscribed. Now only listening to ${adapterKey}.*`
              );
              await this.adapter.subscribeForeignStatesAsync(`${adapterKey}.*`);
              this.adapter.log.debug(
                `Unsubscribing from ${subscribedStatesStatus.subscribed.size} individual states for ${adapterKey}`
              );
              for (const i of subscribedStatesStatus.subscribed) {
                await this.adapter.unsubscribeForeignStatesAsync(i);
              }
              subscribedStatesStatus.overThreshold = true;
            } else {
              this.adapter.log.debug(
                `Subscribing to ${subscribedStatesStatus.pending.size} individual states for ${adapterKey}`
              );
              subscribedStatesStatus.pending.forEach((e) => {
                subscribedStatesStatus.subscribed.add(e);
                this.adapter.subscribeForeignStates(e);
              });
            }
          }
          subscribedStatesStatus.pending.clear();
        }
      }
    });
  }
  addWriter(device, writer) {
    this.subscribedWritersMutex.runExclusive(() => {
      this.subscribedWriters.push({
        device,
        writer
      });
    });
  }
  removeWriter(device) {
    this.subscribedWritersMutex.runExclusive(() => {
      this.subscribedWriters = this.subscribedWriters.filter((v) => v.device == device);
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
