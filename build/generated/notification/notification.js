"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var notification_exports = {};
__export(notification_exports, {
  AckNotificationsRequest: () => AckNotificationsRequest,
  AckNotificationsResponse: () => AckNotificationsResponse,
  FetchNotificationsRequest: () => FetchNotificationsRequest,
  FetchNotificationsResponse: () => FetchNotificationsResponse,
  NotificationContent: () => NotificationContent,
  NotificationServiceClient: () => NotificationServiceClient,
  UnimplementedNotificationServiceService: () => UnimplementedNotificationServiceService
});
module.exports = __toCommonJS(notification_exports);
var pb_1 = __toESM(require("google-protobuf"));
var grpc_1 = __toESM(require("@grpc/grpc-js"));
var _one_of_decls, _one_of_decls2, _one_of_decls3, _one_of_decls4, _one_of_decls5;
const _FetchNotificationsRequest = class _FetchNotificationsRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("deviceId" in data && data.deviceId != void 0) {
        this.deviceId = data.deviceId;
      }
    }
  }
  get deviceId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set deviceId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _FetchNotificationsRequest({});
    if (data.deviceId != null) {
      message.deviceId = data.deviceId;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.deviceId != null) {
      data.deviceId = this.deviceId;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.deviceId.length)
      writer.writeString(1, this.deviceId);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _FetchNotificationsRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.deviceId = reader.readString();
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
    return _FetchNotificationsRequest.deserialize(bytes);
  }
};
_one_of_decls = new WeakMap();
let FetchNotificationsRequest = _FetchNotificationsRequest;
const _NotificationContent = class _NotificationContent extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls2, [[8]]);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [7], __privateGet(this, _one_of_decls2));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("id" in data && data.id != void 0) {
        this.id = data.id;
      }
      if ("title" in data && data.title != void 0) {
        this.title = data.title;
      }
      if ("body" in data && data.body != void 0) {
        this.body = data.body;
      }
      if ("ts" in data && data.ts != void 0) {
        this.ts = data.ts;
      }
      if ("group" in data && data.group != void 0) {
        this.group = data.group;
      }
      if ("data" in data && data.data != void 0) {
        this.data = data.data;
      }
      if ("groupKey" in data && data.groupKey != void 0) {
        this.groupKey = data.groupKey;
      }
      if ("locked" in data && data.locked != void 0) {
        this.locked = data.locked;
      }
    }
  }
  get id() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set id(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get title() {
    return pb_1.Message.getFieldWithDefault(this, 2, "");
  }
  set title(value) {
    pb_1.Message.setField(this, 2, value);
  }
  get body() {
    return pb_1.Message.getFieldWithDefault(this, 3, "");
  }
  set body(value) {
    pb_1.Message.setField(this, 3, value);
  }
  get ts() {
    return pb_1.Message.getFieldWithDefault(this, 4, 0);
  }
  set ts(value) {
    pb_1.Message.setField(this, 4, value);
  }
  get group() {
    return pb_1.Message.getFieldWithDefault(this, 5, false);
  }
  set group(value) {
    pb_1.Message.setField(this, 5, value);
  }
  get data() {
    return pb_1.Message.getFieldWithDefault(this, 7, []);
  }
  set data(value) {
    pb_1.Message.setField(this, 7, value);
  }
  get groupKey() {
    return pb_1.Message.getFieldWithDefault(this, 8, "");
  }
  set groupKey(value) {
    pb_1.Message.setOneofField(this, 8, __privateGet(this, _one_of_decls2)[0], value);
  }
  get has_groupKey() {
    return pb_1.Message.getField(this, 8) != null;
  }
  get locked() {
    return pb_1.Message.getFieldWithDefault(this, 9, false);
  }
  set locked(value) {
    pb_1.Message.setField(this, 9, value);
  }
  get _groupKey() {
    const cases = {
      0: "none",
      8: "groupKey"
    };
    return cases[pb_1.Message.computeOneofCase(this, [8])];
  }
  static fromObject(data) {
    const message = new _NotificationContent({});
    if (data.id != null) {
      message.id = data.id;
    }
    if (data.title != null) {
      message.title = data.title;
    }
    if (data.body != null) {
      message.body = data.body;
    }
    if (data.ts != null) {
      message.ts = data.ts;
    }
    if (data.group != null) {
      message.group = data.group;
    }
    if (data.data != null) {
      message.data = data.data;
    }
    if (data.groupKey != null) {
      message.groupKey = data.groupKey;
    }
    if (data.locked != null) {
      message.locked = data.locked;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.id != null) {
      data.id = this.id;
    }
    if (this.title != null) {
      data.title = this.title;
    }
    if (this.body != null) {
      data.body = this.body;
    }
    if (this.ts != null) {
      data.ts = this.ts;
    }
    if (this.group != null) {
      data.group = this.group;
    }
    if (this.data != null) {
      data.data = this.data;
    }
    if (this.groupKey != null) {
      data.groupKey = this.groupKey;
    }
    if (this.locked != null) {
      data.locked = this.locked;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.id.length)
      writer.writeString(1, this.id);
    if (this.title.length)
      writer.writeString(2, this.title);
    if (this.body.length)
      writer.writeString(3, this.body);
    if (this.ts != 0)
      writer.writeUint64(4, this.ts);
    if (this.group != false)
      writer.writeBool(5, this.group);
    if (this.data.length)
      writer.writeRepeatedString(7, this.data);
    if (this.has_groupKey)
      writer.writeString(8, this.groupKey);
    if (this.locked != false)
      writer.writeBool(9, this.locked);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _NotificationContent();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.id = reader.readString();
          break;
        case 2:
          message.title = reader.readString();
          break;
        case 3:
          message.body = reader.readString();
          break;
        case 4:
          message.ts = reader.readUint64();
          break;
        case 5:
          message.group = reader.readBool();
          break;
        case 7:
          pb_1.Message.addToRepeatedField(message, 7, reader.readString());
          break;
        case 8:
          message.groupKey = reader.readString();
          break;
        case 9:
          message.locked = reader.readBool();
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
    return _NotificationContent.deserialize(bytes);
  }
};
_one_of_decls2 = new WeakMap();
let NotificationContent = _NotificationContent;
const _FetchNotificationsResponse = class _FetchNotificationsResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls3, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], __privateGet(this, _one_of_decls3));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("notifications" in data && data.notifications != void 0) {
        this.notifications = data.notifications;
      }
    }
  }
  get notifications() {
    return pb_1.Message.getRepeatedWrapperField(this, NotificationContent, 1);
  }
  set notifications(value) {
    pb_1.Message.setRepeatedWrapperField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _FetchNotificationsResponse({});
    if (data.notifications != null) {
      message.notifications = data.notifications.map((item) => NotificationContent.fromObject(item));
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.notifications != null) {
      data.notifications = this.notifications.map((item) => item.toObject());
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.notifications.length)
      writer.writeRepeatedMessage(1, this.notifications, (item) => item.serialize(writer));
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _FetchNotificationsResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          reader.readMessage(message.notifications, () => pb_1.Message.addToRepeatedWrapperField(message, 1, NotificationContent.deserialize(reader), NotificationContent));
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
    return _FetchNotificationsResponse.deserialize(bytes);
  }
};
_one_of_decls3 = new WeakMap();
let FetchNotificationsResponse = _FetchNotificationsResponse;
const _AckNotificationsRequest = class _AckNotificationsRequest extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls4, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [2], __privateGet(this, _one_of_decls4));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("deviceId" in data && data.deviceId != void 0) {
        this.deviceId = data.deviceId;
      }
      if ("notificationIds" in data && data.notificationIds != void 0) {
        this.notificationIds = data.notificationIds;
      }
    }
  }
  get deviceId() {
    return pb_1.Message.getFieldWithDefault(this, 1, "");
  }
  set deviceId(value) {
    pb_1.Message.setField(this, 1, value);
  }
  get notificationIds() {
    return pb_1.Message.getFieldWithDefault(this, 2, []);
  }
  set notificationIds(value) {
    pb_1.Message.setField(this, 2, value);
  }
  static fromObject(data) {
    const message = new _AckNotificationsRequest({});
    if (data.deviceId != null) {
      message.deviceId = data.deviceId;
    }
    if (data.notificationIds != null) {
      message.notificationIds = data.notificationIds;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.deviceId != null) {
      data.deviceId = this.deviceId;
    }
    if (this.notificationIds != null) {
      data.notificationIds = this.notificationIds;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.deviceId.length)
      writer.writeString(1, this.deviceId);
    if (this.notificationIds.length)
      writer.writeRepeatedString(2, this.notificationIds);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _AckNotificationsRequest();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.deviceId = reader.readString();
          break;
        case 2:
          pb_1.Message.addToRepeatedField(message, 2, reader.readString());
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
    return _AckNotificationsRequest.deserialize(bytes);
  }
};
_one_of_decls4 = new WeakMap();
let AckNotificationsRequest = _AckNotificationsRequest;
const _AckNotificationsResponse = class _AckNotificationsResponse extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls5, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls5));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("success" in data && data.success != void 0) {
        this.success = data.success;
      }
    }
  }
  get success() {
    return pb_1.Message.getFieldWithDefault(this, 1, false);
  }
  set success(value) {
    pb_1.Message.setField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _AckNotificationsResponse({});
    if (data.success != null) {
      message.success = data.success;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.success != null) {
      data.success = this.success;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.success != false)
      writer.writeBool(1, this.success);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _AckNotificationsResponse();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
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
    return _AckNotificationsResponse.deserialize(bytes);
  }
};
_one_of_decls5 = new WeakMap();
let AckNotificationsResponse = _AckNotificationsResponse;
class UnimplementedNotificationServiceService {
}
UnimplementedNotificationServiceService.definition = {
  fetchNotifications: {
    path: "/NotificationService/fetchNotifications",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => FetchNotificationsRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => FetchNotificationsResponse.deserialize(new Uint8Array(bytes))
  },
  ackNotifications: {
    path: "/NotificationService/ackNotifications",
    requestStream: false,
    responseStream: false,
    requestSerialize: (message) => Buffer.from(message.serialize()),
    requestDeserialize: (bytes) => AckNotificationsRequest.deserialize(new Uint8Array(bytes)),
    responseSerialize: (message) => Buffer.from(message.serialize()),
    responseDeserialize: (bytes) => AckNotificationsResponse.deserialize(new Uint8Array(bytes))
  }
};
class NotificationServiceClient extends grpc_1.makeGenericClientConstructor(UnimplementedNotificationServiceService.definition, "NotificationService", {}) {
  constructor(address, credentials, options) {
    super(address, credentials, options);
    this.fetchNotifications = (message, metadata, options, callback) => {
      return super.fetchNotifications(message, metadata, options, callback);
    };
    this.ackNotifications = (message, metadata, options, callback) => {
      return super.ackNotifications(message, metadata, options, callback);
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AckNotificationsRequest,
  AckNotificationsResponse,
  FetchNotificationsRequest,
  FetchNotificationsResponse,
  NotificationContent,
  NotificationServiceClient,
  UnimplementedNotificationServiceService
});
//# sourceMappingURL=notification.js.map
