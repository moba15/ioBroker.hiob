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
  EnumUpdatePack: () => EnumUpdatePack,
  EnumUpdateRequestPack: () => EnumUpdateRequestPack,
  FirstPingPack: () => FirstPingPack,
  GetTemplateSettingPack: () => GetTemplateSettingPack,
  LoginAnswer: () => LoginAnswer,
  LoginApprovedPacket: () => LoginApprovedPacket,
  LoginDeclinedPacket: () => LoginDeclinedPacket,
  LoginKeyPacket: () => LoginKeyPacket,
  RequestLoginPacket: () => RequestLoginPacket,
  StateChangeRequestPack: () => StateChangeRequestPack,
  StateChangedDataPack: () => StateChangedDataPack,
  SubscribeToDataPointsHistory: () => SubscribeToDataPointsHistory,
  SubscribeToDataPointsPack: () => SubscribeToDataPointsPack,
  TemplateSettingCreatePack: () => TemplateSettingCreatePack,
  TemplateSettingUploadPack: () => TemplateSettingUploadPack,
  TemplateSettingUploadSuccessPack: () => TemplateSettingUploadSuccessPack,
  TemplateSettingsRequestedPack: () => TemplateSettingsRequestedPack
});
module.exports = __toCommonJS(datapacks_exports);
class DataPack {
  constructor(type) {
    this.type = type;
  }
  toJSON() {
    return "";
  }
}
class StateChangeRequestPack extends DataPack {
  constructor(objectID, newValue) {
    super("iobStateChangeRequest");
    this.objectID = objectID;
    this.newValue = newValue;
  }
  toJSON() {
    const map = {
      "type": this.type,
      "objectID": this.objectID,
      "newValue": this.newValue
    };
    return JSON.stringify(map).toString();
  }
}
class StateChangedDataPack extends DataPack {
  constructor(objectID, value) {
    super("iobStateChanged");
    this.objectID = objectID;
    this.value = value;
  }
  toJSON() {
    const map = {
      "type": this.type,
      "objectID": this.objectID,
      "value": this.value
    };
    return JSON.stringify(map).toString();
  }
}
class EnumUpdateRequestPack extends DataPack {
  constructor(id) {
    super("enumUpdateRequest");
    this.id = id;
  }
}
class EnumUpdatePack extends DataPack {
  constructor(id, enumsJSON) {
    super("enumUpdate");
    this.id = id;
    this.enumsJSON = enumsJSON;
  }
  toJSON() {
    const map = {
      "type": this.type,
      "enums": this.enumsJSON
    };
    return JSON.stringify(map).toString();
  }
}
class FirstPingPack extends DataPack {
  constructor() {
    super("firstPingFromIob2");
  }
  toJSON() {
    const map = {
      "type": this.type
    };
    return JSON.stringify(map).toString();
  }
}
class RequestLoginPacket extends DataPack {
  constructor(deviceName, deviceID, key, user, password) {
    super("requestLogin");
    this.deviceName = deviceName;
    this.deviceID = deviceID;
    this.key = key;
    this.user = user;
    this.password = password;
  }
}
class LoginAnswer extends DataPack {
  constructor(key, suc) {
    super("answerLogin");
    this.key = key;
    this.suc = suc;
  }
  toJSON() {
    const map = {
      "type": this.type,
      "key": this.key,
      "suc": this.suc
    };
    return JSON.stringify(map).toString();
  }
}
class SubscribeToDataPointsPack extends DataPack {
  constructor(dataPoints) {
    super("subscribeToDataPoints");
    this.dataPoints = dataPoints;
  }
}
class SubscribeToDataPointsHistory extends DataPack {
  constructor(dataPoint, end, start, minInterval) {
    super("subscribeHistory");
    this.dataPoint = dataPoint;
    this.end = end;
    this.start = start;
    this.minInterval = minInterval;
  }
}
class LoginKeyPacket extends DataPack {
  constructor(key) {
    super("loginKey");
    this.key = key;
  }
  toJSON() {
    const map = {
      "type": this.type,
      "key": this.key
    };
    return JSON.stringify(map).toString();
  }
}
class LoginApprovedPacket extends DataPack {
  constructor() {
    super("loginApproved");
  }
  toJSON() {
    const map = {
      "type": this.type
    };
    return JSON.stringify(map).toString();
  }
}
class LoginDeclinedPacket extends DataPack {
  constructor() {
    super("loginDeclined");
  }
  toJSON() {
    const map = {
      "type": this.type
    };
    return JSON.stringify(map).toString();
  }
}
class TemplateSettingCreatePack extends DataPack {
  constructor(name) {
    super("templateSettingCreate");
    this.name = name;
  }
  toJSON() {
    const map = {
      "type": this.type
    };
    return JSON.stringify(map).toString();
  }
}
class TemplateSettingsRequestedPack extends DataPack {
  constructor(list) {
    super("requestTemplatesSettings");
    this.list = list;
  }
  toJSON() {
    const map = {
      "type": this.type,
      "settings": this.list
    };
    return JSON.stringify(map).toString();
  }
}
class TemplateSettingUploadPack extends DataPack {
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
      "type": this.type
    };
    return JSON.stringify(map).toString();
  }
}
class GetTemplateSettingPack extends DataPack {
  constructor(devices, screens, widgets) {
    super("getTemplatesSetting");
    this.devices = devices;
    this.screens = screens;
    this.widgets = widgets;
  }
  toJSON() {
    const map = {
      "type": this.type,
      "screens": this.screens,
      "widg": this.widgets,
      "devices": this.devices
    };
    return JSON.stringify(map).toString();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EnumUpdatePack,
  EnumUpdateRequestPack,
  FirstPingPack,
  GetTemplateSettingPack,
  LoginAnswer,
  LoginApprovedPacket,
  LoginDeclinedPacket,
  LoginKeyPacket,
  RequestLoginPacket,
  StateChangeRequestPack,
  StateChangedDataPack,
  SubscribeToDataPointsHistory,
  SubscribeToDataPointsPack,
  TemplateSettingCreatePack,
  TemplateSettingUploadPack,
  TemplateSettingUploadSuccessPack,
  TemplateSettingsRequestedPack
});
//# sourceMappingURL=datapacks.js.map
