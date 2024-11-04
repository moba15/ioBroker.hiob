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
var login_exports = {};
__export(login_exports, {
  CompatibilityRequest: () => CompatibilityRequest,
  CompatibilityResponse: () => CompatibilityResponse,
  FirstPing: () => FirstPing,
  LoginClient: () => LoginClient,
  LoginRequest: () => LoginRequest,
  LoginResponse: () => LoginResponse,
  NewAesPacket: () => NewAesPacket,
  UnimplementedLoginService: () => UnimplementedLoginService,
  WrongAesKeyPack: () => WrongAesKeyPack
});
module.exports = __toCommonJS(login_exports);
var pb_1 = __toESM(require("google-protobuf"));
var grpc_1 = __toESM(require("@grpc/grpc-js"));
var _one_of_decls, _one_of_decls2, _one_of_decls3, _one_of_decls4, _one_of_decls5, _one_of_decls6, _one_of_decls7;
const _CompatibilityRequest = class _CompatibilityRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("buildnumber" in data && data.buildnumber != void 0) {
        this.buildnumber = data.buildnumber;
      }
      if ("versionumber" in data && data.versionumber != void 0) {
        this.versionumber = data.versionumber;
      }
    }
  }
  get buildnumber() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set buildnumber(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get versionumber() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set versionumber(value) {
    pb_1.Message.setField(this, 2, value);
  }
  static fromObject(data) {
    const message = new _CompatibilityRequest({});
    if (data.buildnumber != null) {
      message.buildnumber = data.buildnumber;
    }
    if (data.versionumber != null) {
      message.versionumber = data.versionumber;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.buildnumber != null) {
      data.buildnumber = this.buildnumber;
    }
    if (this.versionumber != null) {
      data.versionumber = this.versionumber;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.buildnumber.length)
      writer.writeString(1, this.buildnumber);
    if (this.versionumber.length)
      writer.writeString(2, this.versionumber);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _CompatibilityRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.buildnumber = reader.readString();
          break;
        case 2:
          message.versionumber = reader.readString();
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
    return _CompatibilityRequest.deserialize(bytes);
  }
};
_one_of_decls = new WeakMap();
let CompatibilityRequest = _CompatibilityRequest;
const _CompatibilityResponse = class _CompatibilityResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls2, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls2));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("buildnumber" in data && data.buildnumber != void 0) {
        this.buildnumber = data.buildnumber;
      }
      if ("versionumber" in data && data.versionumber != void 0) {
        this.versionumber = data.versionumber;
      }
    }
  }
  get buildnumber() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set buildnumber(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get versionumber() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set versionumber(value) {
    pb_1.Message.setField(this, 2, value);
  }
  static fromObject(data) {
    const message = new _CompatibilityResponse({});
    if (data.buildnumber != null) {
      message.buildnumber = data.buildnumber;
    }
    if (data.versionumber != null) {
      message.versionumber = data.versionumber;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.buildnumber != null) {
      data.buildnumber = this.buildnumber;
    }
    if (this.versionumber != null) {
      data.versionumber = this.versionumber;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.buildnumber.length)
      writer.writeString(1, this.buildnumber);
    if (this.versionumber.length)
      writer.writeString(2, this.versionumber);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _CompatibilityResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.buildnumber = reader.readString();
          break;
        case 2:
          message.versionumber = reader.readString();
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
    return _CompatibilityResponse.deserialize(bytes);
  }
};
_one_of_decls2 = new WeakMap();
let CompatibilityResponse = _CompatibilityResponse;
const _FirstPing = class _FirstPing extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls3, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls3));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("buildnumber" in data && data.buildnumber != void 0) {
        this.buildnumber = data.buildnumber;
      }
      if ("versionumber" in data && data.versionumber != void 0) {
        this.versionumber = data.versionumber;
      }
    }
  }
  get buildnumber() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set buildnumber(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get versionumber() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set versionumber(value) {
    pb_1.Message.setField(this, 2, value);
  }
  static fromObject(data) {
    const message = new _FirstPing({});
    if (data.buildnumber != null) {
      message.buildnumber = data.buildnumber;
    }
    if (data.versionumber != null) {
      message.versionumber = data.versionumber;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.buildnumber != null) {
      data.buildnumber = this.buildnumber;
    }
    if (this.versionumber != null) {
      data.versionumber = this.versionumber;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.buildnumber.length)
      writer.writeString(1, this.buildnumber);
    if (this.versionumber.length)
      writer.writeString(2, this.versionumber);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _FirstPing();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.buildnumber = reader.readString();
          break;
        case 2:
          message.versionumber = reader.readString();
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
    return _FirstPing.deserialize(bytes);
  }
};
_one_of_decls3 = new WeakMap();
let FirstPing = _FirstPing;
const _LoginRequest = class _LoginRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls4, [[5]]);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls4));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("deviceName" in data && data.deviceName != void 0) {
        this.deviceName = data.deviceName;
      }
      if ("deviceID" in data && data.deviceID != void 0) {
        this.deviceID = data.deviceID;
      }
      if ("key" in data && data.key != void 0) {
        this.key = data.key;
      }
      if ("user" in data && data.user != void 0) {
        this.user = data.user;
      }
      if ("password" in data && data.password != void 0) {
        this.password = data.password;
      }
    }
  }
  get deviceName() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set deviceName(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get deviceID() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set deviceID(value) {
    pb_1.Message.setField(this, 2, value);
  }
  get key() {
    return pb_1.Message.getFieldWithDefault(this, 3, "");
  }
  set key(value) {
    pb_1.Message.setField(this, 3, value);
  }
  get user() {
    return pb_1.Message.getFieldWithDefault(this, 4, "");
  }
  set user(value) {
    pb_1.Message.setField(this, 4, value);
  }
  get password() {
    return pb_1.Message.getFieldWithDefault(this, 5, "");
  }
  set password(value) {
    pb_1.Message.setOneofField(this, 5, __privateGet(this, _one_of_decls4)[0], value);
  }
  get has_password() {
    return pb_1.Message.getField(this, 5) != null;
  }
  get _password() {
    const cases = {
      0: "none",
      5: "password"
    };
    return cases[pb_1.Message.computeOneofCase(this, [5])];
  }
  static fromObject(data) {
    const message = new _LoginRequest({});
    if (data.deviceName != null) {
      message.deviceName = data.deviceName;
    }
    if (data.deviceID != null) {
      message.deviceID = data.deviceID;
    }
    if (data.key != null) {
      message.key = data.key;
    }
    if (data.user != null) {
      message.user = data.user;
    }
    if (data.password != null) {
      message.password = data.password;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.deviceName != null) {
      data.deviceName = this.deviceName;
    }
    if (this.deviceID != null) {
      data.deviceID = this.deviceID;
    }
    if (this.key != null) {
      data.key = this.key;
    }
    if (this.user != null) {
      data.user = this.user;
    }
    if (this.password != null) {
      data.password = this.password;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.deviceName.length)
      writer.writeString(1, this.deviceName);
    if (this.deviceID.length)
      writer.writeString(2, this.deviceID);
    if (this.key.length)
      writer.writeString(3, this.key);
    if (this.user.length)
      writer.writeString(4, this.user);
    if (this.has_password)
      writer.writeString(5, this.password);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _LoginRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.deviceName = reader.readString();
          break;
        case 2:
          message.deviceID = reader.readString();
          break;
        case 3:
          message.key = reader.readString();
          break;
        case 4:
          message.user = reader.readString();
          break;
        case 5:
          message.password = reader.readString();
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
    return _LoginRequest.deserialize(bytes);
  }
};
_one_of_decls4 = new WeakMap();
let LoginRequest = _LoginRequest;
const _LoginResponse = class _LoginResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls5, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls5));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("key" in data && data.key != void 0) {
        this.key = data.key;
      }
    }
  }
  get key() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set key(value) {
    pb_1.Message.setField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _LoginResponse({});
    if (data.key != null) {
      message.key = data.key;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.key != null) {
      data.key = this.key;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.key.length)
      writer.writeString(1, this.key);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _LoginResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.key = reader.readString();
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
    return _LoginResponse.deserialize(bytes);
  }
};
_one_of_decls5 = new WeakMap();
let LoginResponse = _LoginResponse;
((LoginResponse2) => {
  let status;
  ((status2) => {
    status2[status2["succesfull"] = 0] = "succesfull";
    status2[status2["wrongKey"] = 1] = "wrongKey";
    status2[status2["wrongPassword"] = 2] = "wrongPassword";
    status2[status2["error"] = 3] = "error";
  })(status = LoginResponse2.status || (LoginResponse2.status = {}));
})(LoginResponse || (LoginResponse = {}));
const _NewAesPacket = class _NewAesPacket extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls6, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls6));
    if (!Array.isArray(data) && typeof data == "object") {
    }
  }
  static fromObject(data) {
    const message = new _NewAesPacket({});
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
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _NewAesPacket();
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
    return _NewAesPacket.deserialize(bytes);
  }
};
_one_of_decls6 = new WeakMap();
let NewAesPacket = _NewAesPacket;
const _WrongAesKeyPack = class _WrongAesKeyPack extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls7, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls7));
    if (!Array.isArray(data) && typeof data == "object") {
    }
  }
  static fromObject(data) {
    const message = new _WrongAesKeyPack({});
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
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _WrongAesKeyPack();
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
    return _WrongAesKeyPack.deserialize(bytes);
  }
};
_one_of_decls7 = new WeakMap();
let WrongAesKeyPack = _WrongAesKeyPack;
class UnimplementedLoginService {
}
UnimplementedLoginService.definition = {
  CheckCompatibility: {
    path: "/Login/CheckCompatibility",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => CompatibilityRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => CompatibilityResponse.deserialize(new Uint8Array(bytes))
  },
  Login: {
    path: "/Login/Login",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => LoginRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => LoginResponse.deserialize(new Uint8Array(bytes))
  }
};
class LoginClient extends grpc_1.makeGenericClientConstructor(UnimplementedLoginService.definition, "Login", {}) {
  constructor(address, credentials, options) {
    super(address, credentials, options);
    this.CheckCompatibility = (message, metadata, options, callback) => {
      return super.CheckCompatibility(message, metadata, options, callback);
    };
    this.Login = (message, metadata, options, callback) => {
      return super.Login(message, metadata, options, callback);
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CompatibilityRequest,
  CompatibilityResponse,
  FirstPing,
  LoginClient,
  LoginRequest,
  LoginResponse,
  NewAesPacket,
  UnimplementedLoginService,
  WrongAesKeyPack
});
//# sourceMappingURL=login.js.map
