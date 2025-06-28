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
var config_sync_exports = {};
__export(config_sync_exports, {
  AvailableConfigsRequest: () => AvailableConfigsRequest,
  AvailableConfigsResponse: () => AvailableConfigsResponse,
  Config: () => Config,
  ConfigCreateDeleteRequest: () => ConfigCreateDeleteRequest,
  ConfigCreateDeleteResponse: () => ConfigCreateDeleteResponse,
  ConfigSyncClient: () => ConfigSyncClient,
  ConfigSyncDownRequest: () => ConfigSyncDownRequest,
  ConfigSyncUpRequest: () => ConfigSyncUpRequest,
  ConfigSyncUpResponse: () => ConfigSyncUpResponse,
  SyncType: () => SyncType,
  UnimplementedConfigSyncService: () => UnimplementedConfigSyncService
});
module.exports = __toCommonJS(config_sync_exports);
var pb_1 = __toESM(require("google-protobuf"));
var grpc_1 = __toESM(require("@grpc/grpc-js"));
var _one_of_decls, _one_of_decls2, _one_of_decls3, _one_of_decls4, _one_of_decls5, _one_of_decls6, _one_of_decls7, _one_of_decls8;
var SyncType = /* @__PURE__ */ ((SyncType2) => {
  SyncType2[SyncType2["SYNC_ALL"] = 0] = "SYNC_ALL";
  SyncType2[SyncType2["SYNC_SCREENS"] = 1] = "SYNC_SCREENS";
  SyncType2[SyncType2["SYNC_TEMPLATES"] = 2] = "SYNC_TEMPLATES";
  return SyncType2;
})(SyncType || {});
const _AvailableConfigsRequest = class _AvailableConfigsRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("userId" in data && data.userId != void 0) {
        this.userId = data.userId;
      }
    }
  }
  get userId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set userId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _AvailableConfigsRequest({});
    if (data.userId != null) {
      message.userId = data.userId;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.userId != null) {
      data.userId = this.userId;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.userId.length)
      writer.writeString(1, this.userId);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _AvailableConfigsRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.userId = reader.readString();
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
    return _AvailableConfigsRequest.deserialize(bytes);
  }
};
_one_of_decls = new WeakMap();
let AvailableConfigsRequest = _AvailableConfigsRequest;
const _AvailableConfigsResponse = class _AvailableConfigsResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls2, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], __privateGet(this, _one_of_decls2));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("configNames" in data && data.configNames != void 0) {
        this.configNames = data.configNames;
      }
    }
  }
  get configNames() {
    return pb_1.Message.getFieldWithDefault(this, 1, []);
  }
  set configNames(value) {
    pb_1.Message.setField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _AvailableConfigsResponse({});
    if (data.configNames != null) {
      message.configNames = data.configNames;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.configNames != null) {
      data.configNames = this.configNames;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.configNames.length)
      writer.writeRepeatedString(1, this.configNames);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _AvailableConfigsResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          pb_1.Message.addToRepeatedField(message, 1, reader.readString());
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
    return _AvailableConfigsResponse.deserialize(bytes);
  }
};
_one_of_decls2 = new WeakMap();
let AvailableConfigsResponse = _AvailableConfigsResponse;
const _ConfigSyncUpRequest = class _ConfigSyncUpRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls3, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls3));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("userId" in data && data.userId != void 0) {
        this.userId = data.userId;
      }
      if ("config" in data && data.config != void 0) {
        this.config = data.config;
      }
    }
  }
  get userId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set userId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get config() {
    return pb_1.Message.getWrapperField(this, Config, 3);
  }
  set config(value) {
    pb_1.Message.setWrapperField(this, 3, value);
  }
  get has_config() {
    return pb_1.Message.getField(this, 3) != null;
  }
  static fromObject(data) {
    const message = new _ConfigSyncUpRequest({});
    if (data.userId != null) {
      message.userId = data.userId;
    }
    if (data.config != null) {
      message.config = Config.fromObject(data.config);
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.userId != null) {
      data.userId = this.userId;
    }
    if (this.config != null) {
      data.config = this.config.toObject();
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.userId.length)
      writer.writeString(1, this.userId);
    if (this.has_config)
      writer.writeMessage(3, this.config, () => this.config.serialize(writer));
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _ConfigSyncUpRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.userId = reader.readString();
          break;
        case 3:
          reader.readMessage(message.config, () => message.config = Config.deserialize(reader));
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
    return _ConfigSyncUpRequest.deserialize(bytes);
  }
};
_one_of_decls3 = new WeakMap();
let ConfigSyncUpRequest = _ConfigSyncUpRequest;
const _ConfigSyncUpResponse = class _ConfigSyncUpResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls4, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls4));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("userId" in data && data.userId != void 0) {
        this.userId = data.userId;
      }
      if ("success" in data && data.success != void 0) {
        this.success = data.success;
      }
    }
  }
  get userId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set userId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get success() {
    return pb_1.Message.getFieldWithDefault(this, 2, false);
  }
  set success(value) {
    pb_1.Message.setField(this, 2, value);
  }
  static fromObject(data) {
    const message = new _ConfigSyncUpResponse({});
    if (data.userId != null) {
      message.userId = data.userId;
    }
    if (data.success != null) {
      message.success = data.success;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.userId != null) {
      data.userId = this.userId;
    }
    if (this.success != null) {
      data.success = this.success;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.userId.length)
      writer.writeString(1, this.userId);
    if (this.success != false)
      writer.writeBool(2, this.success);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _ConfigSyncUpResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.userId = reader.readString();
          break;
        case 2:
          message.success = reader.readBool();
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
    return _ConfigSyncUpResponse.deserialize(bytes);
  }
};
_one_of_decls4 = new WeakMap();
let ConfigSyncUpResponse = _ConfigSyncUpResponse;
const _ConfigSyncDownRequest = class _ConfigSyncDownRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls5, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls5));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("userId" in data && data.userId != void 0) {
        this.userId = data.userId;
      }
      if ("configName" in data && data.configName != void 0) {
        this.configName = data.configName;
      }
      if ("syncType" in data && data.syncType != void 0) {
        this.syncType = data.syncType;
      }
    }
  }
  get userId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set userId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get configName() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set configName(value) {
    pb_1.Message.setField(this, 2, value);
  }
  get syncType() {
    return pb_1.Message.getFieldWithDefault(this, 3, 0 /* SYNC_ALL */);
  }
  set syncType(value) {
    pb_1.Message.setField(this, 3, value);
  }
  static fromObject(data) {
    const message = new _ConfigSyncDownRequest({});
    if (data.userId != null) {
      message.userId = data.userId;
    }
    if (data.configName != null) {
      message.configName = data.configName;
    }
    if (data.syncType != null) {
      message.syncType = data.syncType;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.userId != null) {
      data.userId = this.userId;
    }
    if (this.configName != null) {
      data.configName = this.configName;
    }
    if (this.syncType != null) {
      data.syncType = this.syncType;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.userId.length)
      writer.writeString(1, this.userId);
    if (this.configName.length)
      writer.writeString(2, this.configName);
    if (this.syncType != 0 /* SYNC_ALL */)
      writer.writeEnum(3, this.syncType);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _ConfigSyncDownRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.userId = reader.readString();
          break;
        case 2:
          message.configName = reader.readString();
          break;
        case 3:
          message.syncType = reader.readEnum();
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
    return _ConfigSyncDownRequest.deserialize(bytes);
  }
};
_one_of_decls5 = new WeakMap();
let ConfigSyncDownRequest = _ConfigSyncDownRequest;
const _ConfigCreateDeleteRequest = class _ConfigCreateDeleteRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls6, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls6));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("userId" in data && data.userId != void 0) {
        this.userId = data.userId;
      }
      if ("configName" in data && data.configName != void 0) {
        this.configName = data.configName;
      }
      if ("delete" in data && data.delete != void 0) {
        this.delete = data.delete;
      }
    }
  }
  get userId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set userId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get configName() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set configName(value) {
    pb_1.Message.setField(this, 2, value);
  }
  get delete() {
    return pb_1.Message.getFieldWithDefault(this, 3, false);
  }
  set delete(value) {
    pb_1.Message.setField(this, 3, value);
  }
  static fromObject(data) {
    const message = new _ConfigCreateDeleteRequest({});
    if (data.userId != null) {
      message.userId = data.userId;
    }
    if (data.configName != null) {
      message.configName = data.configName;
    }
    if (data.delete != null) {
      message.delete = data.delete;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.userId != null) {
      data.userId = this.userId;
    }
    if (this.configName != null) {
      data.configName = this.configName;
    }
    if (this.delete != null) {
      data.delete = this.delete;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.userId.length)
      writer.writeString(1, this.userId);
    if (this.configName.length)
      writer.writeString(2, this.configName);
    if (this.delete != false)
      writer.writeBool(3, this.delete);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _ConfigCreateDeleteRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.userId = reader.readString();
          break;
        case 2:
          message.configName = reader.readString();
          break;
        case 3:
          message.delete = reader.readBool();
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
    return _ConfigCreateDeleteRequest.deserialize(bytes);
  }
};
_one_of_decls6 = new WeakMap();
let ConfigCreateDeleteRequest = _ConfigCreateDeleteRequest;
const _ConfigCreateDeleteResponse = class _ConfigCreateDeleteResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls7, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [2], __privateGet(this, _one_of_decls7));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("userId" in data && data.userId != void 0) {
        this.userId = data.userId;
      }
      if ("configNames" in data && data.configNames != void 0) {
        this.configNames = data.configNames;
      }
      if ("success" in data && data.success != void 0) {
        this.success = data.success;
      }
    }
  }
  get userId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set userId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get configNames() {
    return pb_1.Message.getFieldWithDefault(this, 2, []);
  }
  set configNames(value) {
    pb_1.Message.setField(this, 2, value);
  }
  get success() {
    return pb_1.Message.getFieldWithDefault(this, 3, false);
  }
  set success(value) {
    pb_1.Message.setField(this, 3, value);
  }
  static fromObject(data) {
    const message = new _ConfigCreateDeleteResponse({});
    if (data.userId != null) {
      message.userId = data.userId;
    }
    if (data.configNames != null) {
      message.configNames = data.configNames;
    }
    if (data.success != null) {
      message.success = data.success;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.userId != null) {
      data.userId = this.userId;
    }
    if (this.configNames != null) {
      data.configNames = this.configNames;
    }
    if (this.success != null) {
      data.success = this.success;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.userId.length)
      writer.writeString(1, this.userId);
    if (this.configNames.length)
      writer.writeRepeatedString(2, this.configNames);
    if (this.success != false)
      writer.writeBool(3, this.success);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _ConfigCreateDeleteResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.userId = reader.readString();
          break;
        case 2:
          pb_1.Message.addToRepeatedField(message, 2, reader.readString());
          break;
        case 3:
          message.success = reader.readBool();
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
    return _ConfigCreateDeleteResponse.deserialize(bytes);
  }
};
_one_of_decls7 = new WeakMap();
let ConfigCreateDeleteResponse = _ConfigCreateDeleteResponse;
const _Config = class _Config extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls8, [[2], [3]]);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls8));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("name" in data && data.name != void 0) {
        this.name = data.name;
      }
      if ("screens" in data && data.screens != void 0) {
        this.screens = data.screens;
      }
      if ("templates" in data && data.templates != void 0) {
        this.templates = data.templates;
      }
    }
  }
  get name() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set name(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get screens() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set screens(value) {
    pb_1.Message.setOneofField(this, 2, __privateGet(this, _one_of_decls8)[0], value);
  }
  get has_screens() {
    return pb_1.Message.getField(this, 2) != null;
  }
  get templates() {
    return pb_1.Message.getFieldWithDefault(this, 3, "");
  }
  set templates(value) {
    pb_1.Message.setOneofField(this, 3, __privateGet(this, _one_of_decls8)[1], value);
  }
  get has_templates() {
    return pb_1.Message.getField(this, 3) != null;
  }
  get _screens() {
    const cases = {
      0: "none",
      2: "screens"
    };
    return cases[pb_1.Message.computeOneofCase(this, [2])];
  }
  get _templates() {
    const cases = {
      0: "none",
      3: "templates"
    };
    return cases[pb_1.Message.computeOneofCase(this, [3])];
  }
  static fromObject(data) {
    const message = new _Config({});
    if (data.name != null) {
      message.name = data.name;
    }
    if (data.screens != null) {
      message.screens = data.screens;
    }
    if (data.templates != null) {
      message.templates = data.templates;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.name != null) {
      data.name = this.name;
    }
    if (this.screens != null) {
      data.screens = this.screens;
    }
    if (this.templates != null) {
      data.templates = this.templates;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.name.length)
      writer.writeString(1, this.name);
    if (this.has_screens)
      writer.writeString(2, this.screens);
    if (this.has_templates)
      writer.writeString(3, this.templates);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _Config();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.name = reader.readString();
          break;
        case 2:
          message.screens = reader.readString();
          break;
        case 3:
          message.templates = reader.readString();
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
    return _Config.deserialize(bytes);
  }
};
_one_of_decls8 = new WeakMap();
let Config = _Config;
class UnimplementedConfigSyncService {
}
UnimplementedConfigSyncService.definition = {
  GetAvailableConfigs: {
    path: "/ConfigSync/GetAvailableConfigs",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => AvailableConfigsRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => AvailableConfigsResponse.deserialize(new Uint8Array(bytes))
  },
  ConfigSyncUp: {
    path: "/ConfigSync/ConfigSyncUp",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => ConfigSyncUpRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => ConfigSyncUpResponse.deserialize(new Uint8Array(bytes))
  },
  ConfigSyncDown: {
    path: "/ConfigSync/ConfigSyncDown",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => ConfigSyncDownRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => Config.deserialize(new Uint8Array(bytes))
  },
  ConfigCreateDelete: {
    path: "/ConfigSync/ConfigCreateDelete",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => ConfigCreateDeleteRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => ConfigCreateDeleteResponse.deserialize(new Uint8Array(bytes))
  }
};
class ConfigSyncClient extends grpc_1.makeGenericClientConstructor(UnimplementedConfigSyncService.definition, "ConfigSync", {}) {
  constructor(address, credentials, options) {
    super(address, credentials, options);
    this.GetAvailableConfigs = (message, metadata, options, callback) => {
      return super.GetAvailableConfigs(message, metadata, options, callback);
    };
    this.ConfigSyncUp = (message, metadata, options, callback) => {
      return super.ConfigSyncUp(message, metadata, options, callback);
    };
    this.ConfigSyncDown = (message, metadata, options, callback) => {
      return super.ConfigSyncDown(message, metadata, options, callback);
    };
    this.ConfigCreateDelete = (message, metadata, options, callback) => {
      return super.ConfigCreateDelete(message, metadata, options, callback);
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvailableConfigsRequest,
  AvailableConfigsResponse,
  Config,
  ConfigCreateDeleteRequest,
  ConfigCreateDeleteResponse,
  ConfigSyncClient,
  ConfigSyncDownRequest,
  ConfigSyncUpRequest,
  ConfigSyncUpResponse,
  SyncType,
  UnimplementedConfigSyncService
});
//# sourceMappingURL=config_sync.js.map
