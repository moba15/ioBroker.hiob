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
var struct_exports = {};
__export(struct_exports, {
  google: () => google
});
module.exports = __toCommonJS(struct_exports);
var pb_1 = __toESM(require("google-protobuf"));
var google;
((google2) => {
  let protobuf;
  ((protobuf2) => {
    var _one_of_decls, _one_of_decls2, _one_of_decls3;
    let NullValue;
    ((NullValue2) => {
      NullValue2[NullValue2["NULL_VALUE"] = 0] = "NULL_VALUE";
    })(NullValue = protobuf2.NullValue || (protobuf2.NullValue = {}));
    const _Struct = class _Struct extends pb_1.Message {
      constructor(data) {
        super();
        __privateAdd(this, _one_of_decls, []);
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls));
        if (!Array.isArray(data) && typeof data == "object") {
          if ("fields" in data && data.fields != void 0) {
            this.fields = data.fields;
          }
        }
        if (!this.fields)
          this.fields = /* @__PURE__ */ new Map();
      }
      get fields() {
        return pb_1.Message.getField(this, 1);
      }
      set fields(value) {
        pb_1.Message.setField(this, 1, value);
      }
      static fromObject(data) {
        const message = new _Struct({});
        if (typeof data.fields == "object") {
          message.fields = new Map(Object.entries(data.fields).map(([key, value]) => [key, Value.fromObject(value)]));
        }
        return message;
      }
      toObject() {
        const data = {};
        if (this.fields != null) {
          data.fields = Object.fromEntries(Array.from(this.fields).map(([key, value]) => [key, value.toObject()]));
        }
        return data;
      }
      serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        for (const [key, value] of this.fields) {
          writer.writeMessage(1, this.fields, () => {
            writer.writeString(1, key);
            writer.writeMessage(2, value, () => value.serialize(writer));
          });
        }
        if (!w)
          return writer.getResultBuffer();
      }
      static deserialize(bytes) {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _Struct();
        while (reader.nextField()) {
          if (reader.isEndGroup())
            break;
          switch (reader.getFieldNumber()) {
            case 1:
              reader.readMessage(message, () => pb_1.Map.deserializeBinary(message.fields, reader, reader.readString, () => {
                let value;
                reader.readMessage(message, () => value = Value.deserialize(reader));
                return value;
              }));
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
        return _Struct.deserialize(bytes);
      }
    };
    _one_of_decls = new WeakMap();
    let Struct = _Struct;
    protobuf2.Struct = _Struct;
    const _Value = class _Value extends pb_1.Message {
      constructor(data) {
        super();
        __privateAdd(this, _one_of_decls2, [[1, 2, 3, 4, 5, 6]]);
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], __privateGet(this, _one_of_decls2));
        if (!Array.isArray(data) && typeof data == "object") {
          if ("null_value" in data && data.null_value != void 0) {
            this.null_value = data.null_value;
          }
          if ("number_value" in data && data.number_value != void 0) {
            this.number_value = data.number_value;
          }
          if ("string_value" in data && data.string_value != void 0) {
            this.string_value = data.string_value;
          }
          if ("bool_value" in data && data.bool_value != void 0) {
            this.bool_value = data.bool_value;
          }
          if ("struct_value" in data && data.struct_value != void 0) {
            this.struct_value = data.struct_value;
          }
          if ("list_value" in data && data.list_value != void 0) {
            this.list_value = data.list_value;
          }
        }
      }
      get null_value() {
        return pb_1.Message.getFieldWithDefault(this, 1, 0 /* NULL_VALUE */);
      }
      set null_value(value) {
        pb_1.Message.setOneofField(this, 1, __privateGet(this, _one_of_decls2)[0], value);
      }
      get has_null_value() {
        return pb_1.Message.getField(this, 1) != null;
      }
      get number_value() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0);
      }
      set number_value(value) {
        pb_1.Message.setOneofField(this, 2, __privateGet(this, _one_of_decls2)[0], value);
      }
      get has_number_value() {
        return pb_1.Message.getField(this, 2) != null;
      }
      get string_value() {
        return pb_1.Message.getFieldWithDefault(this, 3, "");
      }
      set string_value(value) {
        pb_1.Message.setOneofField(this, 3, __privateGet(this, _one_of_decls2)[0], value);
      }
      get has_string_value() {
        return pb_1.Message.getField(this, 3) != null;
      }
      get bool_value() {
        return pb_1.Message.getFieldWithDefault(this, 4, false);
      }
      set bool_value(value) {
        pb_1.Message.setOneofField(this, 4, __privateGet(this, _one_of_decls2)[0], value);
      }
      get has_bool_value() {
        return pb_1.Message.getField(this, 4) != null;
      }
      get struct_value() {
        return pb_1.Message.getWrapperField(this, Struct, 5);
      }
      set struct_value(value) {
        pb_1.Message.setOneofWrapperField(this, 5, __privateGet(this, _one_of_decls2)[0], value);
      }
      get has_struct_value() {
        return pb_1.Message.getField(this, 5) != null;
      }
      get list_value() {
        return pb_1.Message.getWrapperField(this, ListValue, 6);
      }
      set list_value(value) {
        pb_1.Message.setOneofWrapperField(this, 6, __privateGet(this, _one_of_decls2)[0], value);
      }
      get has_list_value() {
        return pb_1.Message.getField(this, 6) != null;
      }
      get kind() {
        const cases = {
          0: "none",
          1: "null_value",
          2: "number_value",
          3: "string_value",
          4: "bool_value",
          5: "struct_value",
          6: "list_value"
        };
        return cases[pb_1.Message.computeOneofCase(this, [1, 2, 3, 4, 5, 6])];
      }
      static fromObject(data) {
        const message = new _Value({});
        if (data.null_value != null) {
          message.null_value = data.null_value;
        }
        if (data.number_value != null) {
          message.number_value = data.number_value;
        }
        if (data.string_value != null) {
          message.string_value = data.string_value;
        }
        if (data.bool_value != null) {
          message.bool_value = data.bool_value;
        }
        if (data.struct_value != null) {
          message.struct_value = Struct.fromObject(data.struct_value);
        }
        if (data.list_value != null) {
          message.list_value = ListValue.fromObject(data.list_value);
        }
        return message;
      }
      toObject() {
        const data = {};
        if (this.null_value != null) {
          data.null_value = this.null_value;
        }
        if (this.number_value != null) {
          data.number_value = this.number_value;
        }
        if (this.string_value != null) {
          data.string_value = this.string_value;
        }
        if (this.bool_value != null) {
          data.bool_value = this.bool_value;
        }
        if (this.struct_value != null) {
          data.struct_value = this.struct_value.toObject();
        }
        if (this.list_value != null) {
          data.list_value = this.list_value.toObject();
        }
        return data;
      }
      serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        if (this.has_null_value)
          writer.writeEnum(1, this.null_value);
        if (this.has_number_value)
          writer.writeDouble(2, this.number_value);
        if (this.has_string_value)
          writer.writeString(3, this.string_value);
        if (this.has_bool_value)
          writer.writeBool(4, this.bool_value);
        if (this.has_struct_value)
          writer.writeMessage(5, this.struct_value, () => this.struct_value.serialize(writer));
        if (this.has_list_value)
          writer.writeMessage(6, this.list_value, () => this.list_value.serialize(writer));
        if (!w)
          return writer.getResultBuffer();
      }
      static deserialize(bytes) {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _Value();
        while (reader.nextField()) {
          if (reader.isEndGroup())
            break;
          switch (reader.getFieldNumber()) {
            case 1:
              message.null_value = reader.readEnum();
              break;
            case 2:
              message.number_value = reader.readDouble();
              break;
            case 3:
              message.string_value = reader.readString();
              break;
            case 4:
              message.bool_value = reader.readBool();
              break;
            case 5:
              reader.readMessage(message.struct_value, () => message.struct_value = Struct.deserialize(reader));
              break;
            case 6:
              reader.readMessage(message.list_value, () => message.list_value = ListValue.deserialize(reader));
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
        return _Value.deserialize(bytes);
      }
    };
    _one_of_decls2 = new WeakMap();
    let Value = _Value;
    protobuf2.Value = _Value;
    const _ListValue = class _ListValue extends pb_1.Message {
      constructor(data) {
        super();
        __privateAdd(this, _one_of_decls3, []);
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1], __privateGet(this, _one_of_decls3));
        if (!Array.isArray(data) && typeof data == "object") {
          if ("values" in data && data.values != void 0) {
            this.values = data.values;
          }
        }
      }
      get values() {
        return pb_1.Message.getRepeatedWrapperField(this, Value, 1);
      }
      set values(value) {
        pb_1.Message.setRepeatedWrapperField(this, 1, value);
      }
      static fromObject(data) {
        const message = new _ListValue({});
        if (data.values != null) {
          message.values = data.values.map((item) => Value.fromObject(item));
        }
        return message;
      }
      toObject() {
        const data = {};
        if (this.values != null) {
          data.values = this.values.map((item) => item.toObject());
        }
        return data;
      }
      serialize(w) {
        const writer = w || new pb_1.BinaryWriter();
        if (this.values.length)
          writer.writeRepeatedMessage(1, this.values, (item) => item.serialize(writer));
        if (!w)
          return writer.getResultBuffer();
      }
      static deserialize(bytes) {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new _ListValue();
        while (reader.nextField()) {
          if (reader.isEndGroup())
            break;
          switch (reader.getFieldNumber()) {
            case 1:
              reader.readMessage(message.values, () => pb_1.Message.addToRepeatedWrapperField(message, 1, Value.deserialize(reader), Value));
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
        return _ListValue.deserialize(bytes);
      }
    };
    _one_of_decls3 = new WeakMap();
    let ListValue = _ListValue;
    protobuf2.ListValue = _ListValue;
  })(protobuf = google2.protobuf || (google2.protobuf = {}));
})(google || (google = {}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  google
});
//# sourceMappingURL=struct.js.map
