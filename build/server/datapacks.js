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
var datapacks_exports = {};
__export(datapacks_exports, {
  AnswerSubscribeToDataPointsPack: () => AnswerSubscribeToDataPointsPack,
  DataPack: () => DataPack,
  EnumUpdatePack: () => EnumUpdatePack,
  EnumUpdateRequestPack: () => EnumUpdateRequestPack,
  FirstPingPack: () => FirstPingPack,
  GetTemplateSettingPack: () => GetTemplateSettingPack,
  LoginAnswer: () => LoginAnswer,
  LoginApprovedPacket: () => LoginApprovedPacket,
  LoginDeclinedPacket: () => LoginDeclinedPacket,
  LoginKeyPacket: () => LoginKeyPacket,
  NewAesPacket: () => NewAesPacket,
  NotificationPack: () => NotificationPack,
  RequestLoginPacket: () => RequestLoginPacket,
  StateChangeRequestPack: () => StateChangeRequestPack,
  StateChangedDataPack: () => StateChangedDataPack,
  SubscribeToDataPointsHistory: () => SubscribeToDataPointsHistory,
  SubscribeToDataPointsPack: () => SubscribeToDataPointsPack,
  TemplateSettingCreatePack: () => TemplateSettingCreatePack,
  TemplateSettingUploadPack: () => TemplateSettingUploadPack,
  TemplateSettingUploadSuccessPack: () => TemplateSettingUploadSuccessPack,
  TemplateSettingsRequestedPack: () => TemplateSettingsRequestedPack,
  WrongAesKeyPack: () => WrongAesKeyPack
});
module.exports = __toCommonJS(datapacks_exports);
class DataPack {
  type;
  constructor(type) {
    this.type = type;
  }
  toJSON() {
    return "";
  }
}
class StateChangeRequestPack extends DataPack {
  objectID;
  newValue;
  constructor(objectID, newValue) {
    super("iobStateChangeRequest");
    this.objectID = objectID;
    this.newValue = newValue;
  }
  toJSON() {
    const map = {
      type: this.type,
      objectID: this.objectID,
      newValue: this.newValue
    };
    return map;
  }
}
class StateChangedDataPack extends DataPack {
  objectID;
  value;
  ack;
  lc;
  ts;
  constructor(objectID, value, ack, lc, ts) {
    super("iobStateChanged");
    this.objectID = objectID;
    this.value = value;
    this.ack = ack;
    this.lc = lc;
    this.ts = ts;
  }
  toJSON() {
    const map = {
      type: this.type,
      objectID: this.objectID,
      value: this.value,
      ack: this.ack,
      ts: this.ts,
      lc: this.lc
    };
    return map;
  }
}
class EnumUpdateRequestPack extends DataPack {
  id;
  constructor(id) {
    super("enumUpdateRequest");
    this.id = id;
  }
}
class EnumUpdatePack extends DataPack {
  id;
  enumsJSON;
  constructor(id, enumsJSON) {
    super("enumUpdate");
    this.id = id;
    this.enumsJSON = enumsJSON;
  }
  toJSON() {
    const map = {
      type: this.type,
      enums: this.enumsJSON
    };
    return map;
  }
}
class FirstPingPack extends DataPack {
  constructor() {
    super("firstPingFromIob2");
  }
  toJSON() {
    const map = {
      type: this.type,
      content: {}
    };
    return JSON.stringify(map).toString();
  }
}
class NewAesPacket extends DataPack {
  constructor() {
    super("setNewAes");
  }
  toJSON() {
    const map = {
      type: this.type,
      content: {}
    };
    return map;
  }
}
class RequestLoginPacket extends DataPack {
  deviceName;
  deviceID;
  key;
  version;
  user;
  password;
  constructor(deviceName, deviceID, key, version, user, password) {
    super("requestLogin");
    this.deviceName = deviceName;
    this.deviceID = deviceID;
    this.key = key;
    this.version = version;
    this.user = user;
    this.password = password;
  }
}
class LoginAnswer extends DataPack {
  key;
  suc;
  constructor(key, suc) {
    super("answerLogin");
    this.key = key;
    this.suc = suc;
  }
  toJSON() {
    const map = {
      type: this.type,
      key: this.key,
      suc: this.suc
    };
    return map;
  }
}
class SubscribeToDataPointsPack extends DataPack {
  dataPoints;
  constructor(dataPoints) {
    super("subscribeToDataPoints");
    this.dataPoints = dataPoints;
  }
}
class SubscribeToDataPointsHistory extends DataPack {
  dataPoint;
  end;
  start;
  minInterval;
  constructor(dataPoint, end, start, minInterval) {
    super("subscribeHistory");
    this.dataPoint = dataPoint;
    this.end = end;
    this.start = start;
    this.minInterval = minInterval;
  }
}
class LoginKeyPacket extends DataPack {
  key;
  constructor(key) {
    super("loginKey");
    this.key = key;
  }
  toJSON() {
    const map = {
      type: this.type,
      key: this.key
    };
    return map;
  }
}
class LoginApprovedPacket extends DataPack {
  release;
  constructor(release) {
    super("loginApproved");
    this.release = release;
  }
  toJSON() {
    const map = {
      type: this.type,
      release: this.release
    };
    return map;
  }
}
class LoginDeclinedPacket extends DataPack {
  constructor() {
    super("loginDeclined");
  }
  toJSON() {
    const map = {
      type: this.type
    };
    return map;
  }
}
class WrongAesKeyPack extends DataPack {
  constructor() {
    super("wrongAesKey");
  }
  toJSON() {
    const map = {
      type: this.type
    };
    return map;
  }
}
class TemplateSettingCreatePack extends DataPack {
  name;
  constructor(name) {
    super("templateSettingCreate");
    this.name = name;
  }
  toJSON() {
    const map = {
      type: this.type
    };
    return map;
  }
}
class TemplateSettingsRequestedPack extends DataPack {
  list;
  constructor(list) {
    super("requestTemplatesSettings");
    this.list = list;
  }
  toJSON() {
    const map = {
      type: this.type,
      settings: this.list
    };
    return map;
  }
}
class TemplateSettingUploadPack extends DataPack {
  name;
  devices;
  screens;
  widgets;
  constructor(name, devices, screens, widgets) {
    super("uploadTemplateSetting");
    this.name = name;
    this.devices = devices;
    this.screens = screens;
    this.widgets = widgets;
  }
}
class TemplateSettingUploadSuccessPack extends DataPack {
  constructor() {
    super("uploadTemplateSettingSuccess");
  }
  toJSON() {
    const map = {
      type: this.type
    };
    return map;
  }
}
class GetTemplateSettingPack extends DataPack {
  devices;
  screens;
  widgets;
  constructor(devices, screens, widgets) {
    super("getTemplatesSetting");
    this.devices = devices;
    this.screens = screens;
    this.widgets = widgets;
  }
  toJSON() {
    const map = {
      type: this.type,
      screens: this.screens,
      widget: this.widgets,
      devices: this.devices
    };
    return map;
  }
}
class NotificationPack extends DataPack {
  onlySendNotification;
  content;
  date;
  constructor(onlySendNotification, content, date) {
    super("notification");
    this.onlySendNotification = onlySendNotification;
    this.content = content;
    this.date = date;
  }
  toJSON() {
    const map = {
      type: this.type,
      onlySendNotification: this.onlySendNotification,
      content: this.content,
      date: this.date
    };
    return map;
  }
}
class AnswerSubscribeToDataPointsPack extends DataPack {
  dataValues;
  constructor(dataValues) {
    super("answerSubscribeToDataPoints");
    this.dataValues = dataValues;
  }
  toJSON() {
    const map = {
      type: this.type,
      value: this.dataValues
    };
    return map;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnswerSubscribeToDataPointsPack,
  DataPack,
  EnumUpdatePack,
  EnumUpdateRequestPack,
  FirstPingPack,
  GetTemplateSettingPack,
  LoginAnswer,
  LoginApprovedPacket,
  LoginDeclinedPacket,
  LoginKeyPacket,
  NewAesPacket,
  NotificationPack,
  RequestLoginPacket,
  StateChangeRequestPack,
  StateChangedDataPack,
  SubscribeToDataPointsHistory,
  SubscribeToDataPointsPack,
  TemplateSettingCreatePack,
  TemplateSettingUploadPack,
  TemplateSettingUploadSuccessPack,
  TemplateSettingsRequestedPack,
  WrongAesKeyPack
});
//# sourceMappingURL=datapacks.js.map
