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
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var state_exports = {};
__export(state_exports, {
  AllObjectRequest: () => AllObjectRequest,
  AllObjectsResults: () => AllObjectsResults,
  SearchStateRequest: () => SearchStateRequest,
  SearchStateResponse: () => SearchStateResponse,
  State: () => State,
  StateSubscribtion: () => StateSubscribtion,
  StateUpdateClient: () => StateUpdateClient,
  StateValueUpdate: () => StateValueUpdate,
  StateValueUpdateRequest: () => StateValueUpdateRequest,
  StateValueUpdateResponse: () => StateValueUpdateResponse,
  StatesValueUpdate: () => StatesValueUpdate,
  UnimplementedStateUpdateService: () => UnimplementedStateUpdateService
});
module.exports = __toCommonJS(state_exports);
var pb_1 = __toESM(require("google-protobuf"));
var grpc_1 = __toESM(require("@grpc/grpc-js"));
var _one_of_decls, _one_of_decls2, _one_of_decls3, _one_of_decls4, _one_of_decls5, _one_of_decls6, _one_of_decls7, _one_of_decls8, _one_of_decls9, _one_of_decls10;
const _AllObjectsResults = class _AllObjectsResults extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], __privateGet(this, _one_of_decls));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("states" in data && data.states != void 0) {
        this.states = data.states;
      }
    }
  }
  get states() {
    return pb_1.Message.getRepeatedWrapperField(this, State, 1);
  }
  set states(value) {
    pb_1.Message.setRepeatedWrapperField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _AllObjectsResults({});
    if (data.states != null) {
      message.states = data.states.map((item) => State.fromObject(item));
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.states != null) {
      data.states = this.states.map((item) => item.toObject());
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.states.length)
      writer.writeRepeatedMessage(1, this.states, (item) => item.serialize(writer));
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _AllObjectsResults();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          reader.readMessage(message.states, () => pb_1.Message.addToRepeatedWrapperField(message, 1, State.deserialize(reader), State));
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _AllObjectsResults.deserialize(bytes);
  }
};
_one_of_decls = new WeakMap();
let AllObjectsResults = _AllObjectsResults;
const _AllObjectRequest = class _AllObjectRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls2, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls2));
    if (!Array.isArray(data) && typeof data == "object") {
    }
  }
  static fromObject(data) {
    const message = new _AllObjectRequest({});
    return message;
  }
  toObject() {
    const data = {};
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _AllObjectRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _AllObjectRequest.deserialize(bytes);
  }
};
_one_of_decls2 = new WeakMap();
let AllObjectRequest = _AllObjectRequest;
const _StatesValueUpdate = class _StatesValueUpdate extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls3, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [2], __privateGet(this, _one_of_decls3));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("stateUpdates" in data && data.stateUpdates != void 0) {
        this.stateUpdates = data.stateUpdates;
      }
    }
  }
  get stateUpdates() {
    return pb_1.Message.getRepeatedWrapperField(this, StateValueUpdate, 2);
  }
  set stateUpdates(value) {
    pb_1.Message.setRepeatedWrapperField(this, 2, value);
  }
  static fromObject(data) {
    const message = new _StatesValueUpdate({});
    if (data.stateUpdates != null) {
      message.stateUpdates = data.stateUpdates.map((item) => StateValueUpdate.fromObject(item));
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.stateUpdates != null) {
      data.stateUpdates = this.stateUpdates.map((item) => item.toObject());
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.stateUpdates.length)
      writer.writeRepeatedMessage(2, this.stateUpdates, (item) => item.serialize(writer));
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _StatesValueUpdate();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 2:
          reader.readMessage(message.stateUpdates, () => pb_1.Message.addToRepeatedWrapperField(message, 2, StateValueUpdate.deserialize(reader), StateValueUpdate));
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _StatesValueUpdate.deserialize(bytes);
  }
};
_one_of_decls3 = new WeakMap();
let StatesValueUpdate = _StatesValueUpdate;
const _StateValueUpdate = class _StateValueUpdate extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls4, [[4, 5, 6, 99]]);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls4));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("stateId" in data && data.stateId != void 0) {
        this.stateId = data.stateId;
      }
      if ("acc" in data && data.acc != void 0) {
        this.acc = data.acc;
      }
      if ("time" in data && data.time != void 0) {
        this.time = data.time;
      }
      if ("stringValue" in data && data.stringValue != void 0) {
        this.stringValue = data.stringValue;
      }
      if ("boolValue" in data && data.boolValue != void 0) {
        this.boolValue = data.boolValue;
      }
      if ("doubleValue" in data && data.doubleValue != void 0) {
        this.doubleValue = data.doubleValue;
      }
      if ("other" in data && data.other != void 0) {
        this.other = data.other;
      }
    }
  }
  get stateId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set stateId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get acc() {
    return pb_1.Message.getFieldWithDefault(this, 2, false);
  }
  set acc(value) {
    pb_1.Message.setField(this, 2, value);
  }
  get time() {
    return pb_1.Message.getFieldWithDefault(this, 3, 0);
  }
  set time(value) {
    pb_1.Message.setField(this, 3, value);
  }
  get stringValue() {
    return pb_1.Message.getFieldWithDefault(this, 4, "");
  }
  set stringValue(value) {
    pb_1.Message.setOneofField(this, 4, __privateGet(this, _one_of_decls4)[0], value);
  }
  get has_stringValue() {
    return pb_1.Message.getField(this, 4) != null;
  }
  get boolValue() {
    return pb_1.Message.getFieldWithDefault(this, 5, false);
  }
  set boolValue(value) {
    pb_1.Message.setOneofField(this, 5, __privateGet(this, _one_of_decls4)[0], value);
  }
  get has_boolValue() {
    return pb_1.Message.getField(this, 5) != null;
  }
  get doubleValue() {
    return pb_1.Message.getFieldWithDefault(this, 6, 0);
  }
  set doubleValue(value) {
    pb_1.Message.setOneofField(this, 6, __privateGet(this, _one_of_decls4)[0], value);
  }
  get has_doubleValue() {
    return pb_1.Message.getField(this, 6) != null;
  }
  get other() {
    return pb_1.Message.getFieldWithDefault(this, 99, "");
  }
  set other(value) {
    pb_1.Message.setOneofField(this, 99, __privateGet(this, _one_of_decls4)[0], value);
  }
  get has_other() {
    return pb_1.Message.getField(this, 99) != null;
  }
  get value() {
    const cases = {
      0: "none",
      4: "stringValue",
      5: "boolValue",
      6: "doubleValue",
      99: "other"
    };
    return cases[pb_1.Message.computeOneofCase(this, [4, 5, 6, 99])];
  }
  static fromObject(data) {
    const message = new _StateValueUpdate({});
    if (data.stateId != null) {
      message.stateId = data.stateId;
    }
    if (data.acc != null) {
      message.acc = data.acc;
    }
    if (data.time != null) {
      message.time = data.time;
    }
    if (data.stringValue != null) {
      message.stringValue = data.stringValue;
    }
    if (data.boolValue != null) {
      message.boolValue = data.boolValue;
    }
    if (data.doubleValue != null) {
      message.doubleValue = data.doubleValue;
    }
    if (data.other != null) {
      message.other = data.other;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.stateId != null) {
      data.stateId = this.stateId;
    }
    if (this.acc != null) {
      data.acc = this.acc;
    }
    if (this.time != null) {
      data.time = this.time;
    }
    if (this.stringValue != null) {
      data.stringValue = this.stringValue;
    }
    if (this.boolValue != null) {
      data.boolValue = this.boolValue;
    }
    if (this.doubleValue != null) {
      data.doubleValue = this.doubleValue;
    }
    if (this.other != null) {
      data.other = this.other;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.stateId.length)
      writer.writeString(1, this.stateId);
    if (this.acc != false)
      writer.writeBool(2, this.acc);
    if (this.time != 0)
      writer.writeUint64(3, this.time);
    if (this.has_stringValue)
      writer.writeString(4, this.stringValue);
    if (this.has_boolValue)
      writer.writeBool(5, this.boolValue);
    if (this.has_doubleValue)
      writer.writeDouble(6, this.doubleValue);
    if (this.has_other)
      writer.writeString(99, this.other);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _StateValueUpdate();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.stateId = reader.readString();
          break;
        case 2:
          message.acc = reader.readBool();
          break;
        case 3:
          message.time = reader.readUint64();
          break;
        case 4:
          message.stringValue = reader.readString();
          break;
        case 5:
          message.boolValue = reader.readBool();
          break;
        case 6:
          message.doubleValue = reader.readDouble();
          break;
        case 99:
          message.other = reader.readString();
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _StateValueUpdate.deserialize(bytes);
  }
};
_one_of_decls4 = new WeakMap();
let StateValueUpdate = _StateValueUpdate;
const _StateValueUpdateRequest = class _StateValueUpdateRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls5, [[3, 4, 5, 99]]);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls5));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("userId" in data && data.userId != void 0) {
        this.userId = data.userId;
      }
      if ("stateId" in data && data.stateId != void 0) {
        this.stateId = data.stateId;
      }
      if ("stringValue" in data && data.stringValue != void 0) {
        this.stringValue = data.stringValue;
      }
      if ("boolValue" in data && data.boolValue != void 0) {
        this.boolValue = data.boolValue;
      }
      if ("doubleValue" in data && data.doubleValue != void 0) {
        this.doubleValue = data.doubleValue;
      }
      if ("other" in data && data.other != void 0) {
        this.other = data.other;
      }
    }
  }
  get userId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set userId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get stateId() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set stateId(value) {
    pb_1.Message.setField(this, 2, value);
  }
  get stringValue() {
    return pb_1.Message.getFieldWithDefault(this, 3, "");
  }
  set stringValue(value) {
    pb_1.Message.setOneofField(this, 3, __privateGet(this, _one_of_decls5)[0], value);
  }
  get has_stringValue() {
    return pb_1.Message.getField(this, 3) != null;
  }
  get boolValue() {
    return pb_1.Message.getFieldWithDefault(this, 4, false);
  }
  set boolValue(value) {
    pb_1.Message.setOneofField(this, 4, __privateGet(this, _one_of_decls5)[0], value);
  }
  get has_boolValue() {
    return pb_1.Message.getField(this, 4) != null;
  }
  get doubleValue() {
    return pb_1.Message.getFieldWithDefault(this, 5, 0);
  }
  set doubleValue(value) {
    pb_1.Message.setOneofField(this, 5, __privateGet(this, _one_of_decls5)[0], value);
  }
  get has_doubleValue() {
    return pb_1.Message.getField(this, 5) != null;
  }
  get other() {
    return pb_1.Message.getFieldWithDefault(this, 99, "");
  }
  set other(value) {
    pb_1.Message.setOneofField(this, 99, __privateGet(this, _one_of_decls5)[0], value);
  }
  get has_other() {
    return pb_1.Message.getField(this, 99) != null;
  }
  get value() {
    const cases = {
      0: "none",
      3: "stringValue",
      4: "boolValue",
      5: "doubleValue",
      99: "other"
    };
    return cases[pb_1.Message.computeOneofCase(this, [3, 4, 5, 99])];
  }
  static fromObject(data) {
    const message = new _StateValueUpdateRequest({});
    if (data.userId != null) {
      message.userId = data.userId;
    }
    if (data.stateId != null) {
      message.stateId = data.stateId;
    }
    if (data.stringValue != null) {
      message.stringValue = data.stringValue;
    }
    if (data.boolValue != null) {
      message.boolValue = data.boolValue;
    }
    if (data.doubleValue != null) {
      message.doubleValue = data.doubleValue;
    }
    if (data.other != null) {
      message.other = data.other;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.userId != null) {
      data.userId = this.userId;
    }
    if (this.stateId != null) {
      data.stateId = this.stateId;
    }
    if (this.stringValue != null) {
      data.stringValue = this.stringValue;
    }
    if (this.boolValue != null) {
      data.boolValue = this.boolValue;
    }
    if (this.doubleValue != null) {
      data.doubleValue = this.doubleValue;
    }
    if (this.other != null) {
      data.other = this.other;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.userId.length)
      writer.writeString(1, this.userId);
    if (this.stateId.length)
      writer.writeString(2, this.stateId);
    if (this.has_stringValue)
      writer.writeString(3, this.stringValue);
    if (this.has_boolValue)
      writer.writeBool(4, this.boolValue);
    if (this.has_doubleValue)
      writer.writeDouble(5, this.doubleValue);
    if (this.has_other)
      writer.writeString(99, this.other);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _StateValueUpdateRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.userId = reader.readString();
          break;
        case 2:
          message.stateId = reader.readString();
          break;
        case 3:
          message.stringValue = reader.readString();
          break;
        case 4:
          message.boolValue = reader.readBool();
          break;
        case 5:
          message.doubleValue = reader.readDouble();
          break;
        case 99:
          message.other = reader.readString();
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _StateValueUpdateRequest.deserialize(bytes);
  }
};
_one_of_decls5 = new WeakMap();
let StateValueUpdateRequest = _StateValueUpdateRequest;
const _StateValueUpdateResponse = class _StateValueUpdateResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls6, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls6));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("suc" in data && data.suc != void 0) {
        this.suc = data.suc;
      }
    }
  }
  get suc() {
    return pb_1.Message.getFieldWithDefault(this, 1, false);
  }
  set suc(value) {
    pb_1.Message.setField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _StateValueUpdateResponse({});
    if (data.suc != null) {
      message.suc = data.suc;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.suc != null) {
      data.suc = this.suc;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.suc != false)
      writer.writeBool(1, this.suc);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _StateValueUpdateResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.suc = reader.readBool();
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _StateValueUpdateResponse.deserialize(bytes);
  }
};
_one_of_decls6 = new WeakMap();
let StateValueUpdateResponse = _StateValueUpdateResponse;
const _StateSubscribtion = class _StateSubscribtion extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls7, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [3], __privateGet(this, _one_of_decls7));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("type" in data && data.type != void 0) {
        this.type = data.type;
      }
      if ("stateIds" in data && data.stateIds != void 0) {
        this.stateIds = data.stateIds;
      }
    }
  }
  get type() {
    return pb_1.Message.getFieldWithDefault(this, 2, _StateSubscribtion.SubscriptionType.cancle);
  }
  set type(value) {
    pb_1.Message.setField(this, 2, value);
  }
  get stateIds() {
    return pb_1.Message.getFieldWithDefault(this, 3, []);
  }
  set stateIds(value) {
    pb_1.Message.setField(this, 3, value);
  }
  static fromObject(data) {
    const message = new _StateSubscribtion({});
    if (data.type != null) {
      message.type = data.type;
    }
    if (data.stateIds != null) {
      message.stateIds = data.stateIds;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.type != null) {
      data.type = this.type;
    }
    if (this.stateIds != null) {
      data.stateIds = this.stateIds;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.type != _StateSubscribtion.SubscriptionType.cancle)
      writer.writeEnum(2, this.type);
    if (this.stateIds.length)
      writer.writeRepeatedString(3, this.stateIds);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _StateSubscribtion();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 2:
          message.type = reader.readEnum();
          break;
        case 3:
          pb_1.Message.addToRepeatedField(message, 3, reader.readString());
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _StateSubscribtion.deserialize(bytes);
  }
};
_one_of_decls7 = new WeakMap();
let StateSubscribtion = _StateSubscribtion;
((StateSubscribtion2) => {
  let SubscriptionType;
  ((SubscriptionType2) => {
    SubscriptionType2[SubscriptionType2["cancle"] = 0] = "cancle";
    SubscriptionType2[SubscriptionType2["subscripe"] = 1] = "subscripe";
  })(SubscriptionType = StateSubscribtion2.SubscriptionType || (StateSubscribtion2.SubscriptionType = {}));
})(StateSubscribtion || (StateSubscribtion = {}));
const _SearchStateRequest = class _SearchStateRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls8, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls8));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("userId" in data && data.userId != void 0) {
        this.userId = data.userId;
      }
      if ("query" in data && data.query != void 0) {
        this.query = data.query;
      }
    }
  }
  get userId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set userId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get query() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set query(value) {
    pb_1.Message.setField(this, 2, value);
  }
  static fromObject(data) {
    const message = new _SearchStateRequest({});
    if (data.userId != null) {
      message.userId = data.userId;
    }
    if (data.query != null) {
      message.query = data.query;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.userId != null) {
      data.userId = this.userId;
    }
    if (this.query != null) {
      data.query = this.query;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.userId.length)
      writer.writeString(1, this.userId);
    if (this.query.length)
      writer.writeString(2, this.query);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _SearchStateRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.userId = reader.readString();
          break;
        case 2:
          message.query = reader.readString();
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _SearchStateRequest.deserialize(bytes);
  }
};
_one_of_decls8 = new WeakMap();
let SearchStateRequest = _SearchStateRequest;
const _SearchStateResponse = class _SearchStateResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls9, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], __privateGet(this, _one_of_decls9));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("states" in data && data.states != void 0) {
        this.states = data.states;
      }
    }
  }
  get states() {
    return pb_1.Message.getRepeatedWrapperField(this, State, 1);
  }
  set states(value) {
    pb_1.Message.setRepeatedWrapperField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _SearchStateResponse({});
    if (data.states != null) {
      message.states = data.states.map((item) => State.fromObject(item));
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.states != null) {
      data.states = this.states.map((item) => item.toObject());
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.states.length)
      writer.writeRepeatedMessage(1, this.states, (item) => item.serialize(writer));
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _SearchStateResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          reader.readMessage(message.states, () => pb_1.Message.addToRepeatedWrapperField(message, 1, State.deserialize(reader), State));
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _SearchStateResponse.deserialize(bytes);
  }
};
_one_of_decls9 = new WeakMap();
let SearchStateResponse = _SearchStateResponse;
const _State = class _State extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls10, [[3, 4, 5, 99], [6]]);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls10));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("stateId" in data && data.stateId != void 0) {
        this.stateId = data.stateId;
      }
      if ("stringValue" in data && data.stringValue != void 0) {
        this.stringValue = data.stringValue;
      }
      if ("boolValue" in data && data.boolValue != void 0) {
        this.boolValue = data.boolValue;
      }
      if ("doubleValue" in data && data.doubleValue != void 0) {
        this.doubleValue = data.doubleValue;
      }
      if ("other" in data && data.other != void 0) {
        this.other = data.other;
      }
      if ("common" in data && data.common != void 0) {
        this.common = data.common;
      }
    }
  }
  get stateId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set stateId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get stringValue() {
    return pb_1.Message.getFieldWithDefault(this, 3, "");
  }
  set stringValue(value) {
    pb_1.Message.setOneofField(this, 3, __privateGet(this, _one_of_decls10)[0], value);
  }
  get has_stringValue() {
    return pb_1.Message.getField(this, 3) != null;
  }
  get boolValue() {
    return pb_1.Message.getFieldWithDefault(this, 4, false);
  }
  set boolValue(value) {
    pb_1.Message.setOneofField(this, 4, __privateGet(this, _one_of_decls10)[0], value);
  }
  get has_boolValue() {
    return pb_1.Message.getField(this, 4) != null;
  }
  get doubleValue() {
    return pb_1.Message.getFieldWithDefault(this, 5, 0);
  }
  set doubleValue(value) {
    pb_1.Message.setOneofField(this, 5, __privateGet(this, _one_of_decls10)[0], value);
  }
  get has_doubleValue() {
    return pb_1.Message.getField(this, 5) != null;
  }
  get other() {
    return pb_1.Message.getFieldWithDefault(this, 99, "");
  }
  set other(value) {
    pb_1.Message.setOneofField(this, 99, __privateGet(this, _one_of_decls10)[0], value);
  }
  get has_other() {
    return pb_1.Message.getField(this, 99) != null;
  }
  get common() {
    return pb_1.Message.getWrapperField(this, _State.StateCommon, 6);
  }
  set common(value) {
    pb_1.Message.setOneofWrapperField(this, 6, __privateGet(this, _one_of_decls10)[1], value);
  }
  get has_common() {
    return pb_1.Message.getField(this, 6) != null;
  }
  get value() {
    const cases = {
      0: "none",
      3: "stringValue",
      4: "boolValue",
      5: "doubleValue",
      99: "other"
    };
    return cases[pb_1.Message.computeOneofCase(this, [3, 4, 5, 99])];
  }
  get _common() {
    const cases = {
      0: "none",
      6: "common"
    };
    return cases[pb_1.Message.computeOneofCase(this, [6])];
  }
  static fromObject(data) {
    const message = new _State({});
    if (data.stateId != null) {
      message.stateId = data.stateId;
    }
    if (data.stringValue != null) {
      message.stringValue = data.stringValue;
    }
    if (data.boolValue != null) {
      message.boolValue = data.boolValue;
    }
    if (data.doubleValue != null) {
      message.doubleValue = data.doubleValue;
    }
    if (data.other != null) {
      message.other = data.other;
    }
    if (data.common != null) {
      message.common = _State.StateCommon.fromObject(data.common);
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.stateId != null) {
      data.stateId = this.stateId;
    }
    if (this.stringValue != null) {
      data.stringValue = this.stringValue;
    }
    if (this.boolValue != null) {
      data.boolValue = this.boolValue;
    }
    if (this.doubleValue != null) {
      data.doubleValue = this.doubleValue;
    }
    if (this.other != null) {
      data.other = this.other;
    }
    if (this.common != null) {
      data.common = this.common.toObject();
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.stateId.length)
      writer.writeString(1, this.stateId);
    if (this.has_stringValue)
      writer.writeString(3, this.stringValue);
    if (this.has_boolValue)
      writer.writeBool(4, this.boolValue);
    if (this.has_doubleValue)
      writer.writeDouble(5, this.doubleValue);
    if (this.has_other)
      writer.writeString(99, this.other);
    if (this.has_common)
      writer.writeMessage(6, this.common, () => this.common.serialize(writer));
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _State();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.stateId = reader.readString();
          break;
        case 3:
          message.stringValue = reader.readString();
          break;
        case 4:
          message.boolValue = reader.readBool();
          break;
        case 5:
          message.doubleValue = reader.readDouble();
          break;
        case 99:
          message.other = reader.readString();
          break;
        case 6:
          reader.readMessage(message.common, () => message.common = _State.StateCommon.deserialize(reader));
          break;
        default:
          reader.skipField();
      }
    }
    return message;
  }
  serializeBinary() {
    return this.serialize();
  }
  static deserializeBinary(bytes) {
    return _State.deserialize(bytes);
  }
};
_one_of_decls10 = new WeakMap();
let State = _State;
((State2) => {
  var _one_of_decls11;
  const _StateCommon = class _StateCommon extends pb_1.Message {
    constructor(data) {
      super();
      __privateAdd(this, _one_of_decls11, [[7], [8], [9], [10]]);
      pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls11));
      if (!Array.isArray(data) && typeof data == "object") {
        if ("name" in data && data.name != void 0) {
          this.name = data.name;
        }
        if ("desc" in data && data.desc != void 0) {
          this.desc = data.desc;
        }
        if ("type" in data && data.type != void 0) {
          this.type = data.type;
        }
        if ("read" in data && data.read != void 0) {
          this.read = data.read;
        }
        if ("write" in data && data.write != void 0) {
          this.write = data.write;
        }
        if ("role" in data && data.role != void 0) {
          this.role = data.role;
        }
        if ("unit" in data && data.unit != void 0) {
          this.unit = data.unit;
        }
        if ("step" in data && data.step != void 0) {
          this.step = data.step;
        }
        if ("min" in data && data.min != void 0) {
          this.min = data.min;
        }
        if ("max" in data && data.max != void 0) {
          this.max = data.max;
        }
      }
    }
    get name() {
      return pb_1.Message.getFieldWithDefault(this, 1, "");
    }
    set name(value) {
      pb_1.Message.setField(this, 1, value);
    }
    get desc() {
      return pb_1.Message.getFieldWithDefault(this, 2, "");
    }
    set desc(value) {
      pb_1.Message.setField(this, 2, value);
    }
    get type() {
      return pb_1.Message.getFieldWithDefault(this, 3, "");
    }
    set type(value) {
      pb_1.Message.setField(this, 3, value);
    }
    get read() {
      return pb_1.Message.getFieldWithDefault(this, 4, false);
    }
    set read(value) {
      pb_1.Message.setField(this, 4, value);
    }
    get write() {
      return pb_1.Message.getFieldWithDefault(this, 5, false);
    }
    set write(value) {
      pb_1.Message.setField(this, 5, value);
    }
    get role() {
      return pb_1.Message.getFieldWithDefault(this, 6, "");
    }
    set role(value) {
      pb_1.Message.setField(this, 6, value);
    }
    get unit() {
      return pb_1.Message.getFieldWithDefault(this, 7, "");
    }
    set unit(value) {
      pb_1.Message.setOneofField(this, 7, __privateGet(this, _one_of_decls11)[0], value);
    }
    get has_unit() {
      return pb_1.Message.getField(this, 7) != null;
    }
    get step() {
      return pb_1.Message.getFieldWithDefault(this, 8, 0);
    }
    set step(value) {
      pb_1.Message.setOneofField(this, 8, __privateGet(this, _one_of_decls11)[1], value);
    }
    get has_step() {
      return pb_1.Message.getField(this, 8) != null;
    }
    get min() {
      return pb_1.Message.getFieldWithDefault(this, 9, 0);
    }
    set min(value) {
      pb_1.Message.setOneofField(this, 9, __privateGet(this, _one_of_decls11)[2], value);
    }
    get has_min() {
      return pb_1.Message.getField(this, 9) != null;
    }
    get max() {
      return pb_1.Message.getFieldWithDefault(this, 10, 0);
    }
    set max(value) {
      pb_1.Message.setOneofField(this, 10, __privateGet(this, _one_of_decls11)[3], value);
    }
    get has_max() {
      return pb_1.Message.getField(this, 10) != null;
    }
    get _unit() {
      const cases = {
        0: "none",
        7: "unit"
      };
      return cases[pb_1.Message.computeOneofCase(this, [7])];
    }
    get _step() {
      const cases = {
        0: "none",
        8: "step"
      };
      return cases[pb_1.Message.computeOneofCase(this, [8])];
    }
    get _min() {
      const cases = {
        0: "none",
        9: "min"
      };
      return cases[pb_1.Message.computeOneofCase(this, [9])];
    }
    get _max() {
      const cases = {
        0: "none",
        10: "max"
      };
      return cases[pb_1.Message.computeOneofCase(this, [10])];
    }
    static fromObject(data) {
      const message = new _StateCommon({});
      if (data.name != null) {
        message.name = data.name;
      }
      if (data.desc != null) {
        message.desc = data.desc;
      }
      if (data.type != null) {
        message.type = data.type;
      }
      if (data.read != null) {
        message.read = data.read;
      }
      if (data.write != null) {
        message.write = data.write;
      }
      if (data.role != null) {
        message.role = data.role;
      }
      if (data.unit != null) {
        message.unit = data.unit;
      }
      if (data.step != null) {
        message.step = data.step;
      }
      if (data.min != null) {
        message.min = data.min;
      }
      if (data.max != null) {
        message.max = data.max;
      }
      return message;
    }
    toObject() {
      const data = {};
      if (this.name != null) {
        data.name = this.name;
      }
      if (this.desc != null) {
        data.desc = this.desc;
      }
      if (this.type != null) {
        data.type = this.type;
      }
      if (this.read != null) {
        data.read = this.read;
      }
      if (this.write != null) {
        data.write = this.write;
      }
      if (this.role != null) {
        data.role = this.role;
      }
      if (this.unit != null) {
        data.unit = this.unit;
      }
      if (this.step != null) {
        data.step = this.step;
      }
      if (this.min != null) {
        data.min = this.min;
      }
      if (this.max != null) {
        data.max = this.max;
      }
      return data;
    }
    serialize(w) {
      const writer = w || new pb_1.BinaryWriter();
      if (this.name.length)
        writer.writeString(1, this.name);
      if (this.desc.length)
        writer.writeString(2, this.desc);
      if (this.type.length)
        writer.writeString(3, this.type);
      if (this.read != false)
        writer.writeBool(4, this.read);
      if (this.write != false)
        writer.writeBool(5, this.write);
      if (this.role.length)
        writer.writeString(6, this.role);
      if (this.has_unit)
        writer.writeString(7, this.unit);
      if (this.has_step)
        writer.writeInt32(8, this.step);
      if (this.has_min)
        writer.writeInt32(9, this.min);
      if (this.has_max)
        writer.writeInt32(10, this.max);
      if (!w)
        return writer.getResultBuffer();
    }
    static deserialize(bytes) {
      const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _StateCommon();
      while (reader.nextField()) {
        if (reader.isEndGroup())
          break;
        switch (reader.getFieldNumber()) {
          case 1:
            message.name = reader.readString();
            break;
          case 2:
            message.desc = reader.readString();
            break;
          case 3:
            message.type = reader.readString();
            break;
          case 4:
            message.read = reader.readBool();
            break;
          case 5:
            message.write = reader.readBool();
            break;
          case 6:
            message.role = reader.readString();
            break;
          case 7:
            message.unit = reader.readString();
            break;
          case 8:
            message.step = reader.readInt32();
            break;
          case 9:
            message.min = reader.readInt32();
            break;
          case 10:
            message.max = reader.readInt32();
            break;
          default:
            reader.skipField();
        }
      }
      return message;
    }
    serializeBinary() {
      return this.serialize();
    }
    static deserializeBinary(bytes) {
      return _StateCommon.deserialize(bytes);
    }
  };
  _one_of_decls11 = new WeakMap();
  let StateCommon = _StateCommon;
  State2.StateCommon = _StateCommon;
})(State || (State = {}));
class UnimplementedStateUpdateService {
}
UnimplementedStateUpdateService.definition = {
  Subscibe: {
    path: "/StateUpdate/Subscibe",
    requestStream: false,
    responseStream: true,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => StateSubscribtion.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => StatesValueUpdate.deserialize(new Uint8Array(bytes))
  },
  UpdateValue: {
    path: "/StateUpdate/UpdateValue",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => StateValueUpdateRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => StateValueUpdateResponse.deserialize(new Uint8Array(bytes))
  },
  SearchState: {
    path: "/StateUpdate/SearchState",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => SearchStateRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => SearchStateResponse.deserialize(new Uint8Array(bytes))
  },
  SearchStateStream: {
    path: "/StateUpdate/SearchStateStream",
    requestStream: true,
    responseStream: true,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => SearchStateRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => SearchStateResponse.deserialize(new Uint8Array(bytes))
  },
  GetAllObjects: {
    path: "/StateUpdate/GetAllObjects",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => AllObjectRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => AllObjectsResults.deserialize(new Uint8Array(bytes))
  }
};
class StateUpdateClient extends grpc_1.makeGenericClientConstructor(UnimplementedStateUpdateService.definition, "StateUpdate", {}) {
  constructor(address, credentials, options) {
    super(address, credentials, options);
    this.Subscibe = (message, metadata, options) => {
      return super.Subscibe(message, metadata, options);
    };
    this.UpdateValue = (message, metadata, options, callback) => {
      return super.UpdateValue(message, metadata, options, callback);
    };
    this.SearchState = (message, metadata, options, callback) => {
      return super.SearchState(message, metadata, options, callback);
    };
    this.SearchStateStream = (metadata, options) => {
      return super.SearchStateStream(metadata, options);
    };
    this.GetAllObjects = (message, metadata, options, callback) => {
      return super.GetAllObjects(message, metadata, options, callback);
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AllObjectRequest,
  AllObjectsResults,
  SearchStateRequest,
  SearchStateResponse,
  State,
  StateSubscribtion,
  StateUpdateClient,
  StateValueUpdate,
  StateValueUpdateRequest,
  StateValueUpdateResponse,
  StatesValueUpdate,
  UnimplementedStateUpdateService
});
//# sourceMappingURL=state.js.map
