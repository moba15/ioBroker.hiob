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
var packages_exports = {};
__export(packages_exports, {
  Package: () => Package,
  PackageType: () => PackageType
});
module.exports = __toCommonJS(packages_exports);
var pb_1 = __toESM(require("google-protobuf"));
var _one_of_decls;
var PackageType = /* @__PURE__ */ ((PackageType2) => {
  PackageType2[PackageType2["firstPing"] = 0] = "firstPing";
  return PackageType2;
})(PackageType || {});
const _Package = class _Package extends pb_1.Message {
  constructor(data) {
    super();
    __privateAdd(this, _one_of_decls, []);
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls));
    if (!Array.isArray(data) && typeof data == "object") {
      if ("type" in data && data.type != void 0) {
        this.type = data.type;
      }
    }
  }
  get type() {
    return pb_1.Message.getFieldWithDefault(this, 1, 0 /* firstPing */);
  }
  set type(value) {
    pb_1.Message.setField(this, 1, value);
  }
  static fromObject(data) {
    const message = new _Package({});
    if (data.type != null) {
      message.type = data.type;
    }
    return message;
  }
  toObject() {
    const data = {};
    if (this.type != null) {
      data.type = this.type;
    }
    return data;
  }
  serialize(w) {
    const writer = w || new pb_1.BinaryWriter();
    if (this.type != 0 /* firstPing */)
      writer.writeEnum(1, this.type);
    if (!w)
      return writer.getResultBuffer();
  }
  static deserialize(bytes) {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _Package();
    while (reader.nextField()) {
      if (reader.isEndGroup())
        break;
      switch (reader.getFieldNumber()) {
        case 1:
          message.type = reader.readEnum();
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
    return _Package.deserialize(bytes);
  }
};
_one_of_decls = new WeakMap();
let Package = _Package;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Package,
  PackageType
});
//# sourceMappingURL=packages.js.map
