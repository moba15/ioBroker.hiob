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
var template_manager_exports = {};
__export(template_manager_exports, {
  TemplateManager: () => TemplateManager,
  TemplateSettings: () => TemplateSettings
});
module.exports = __toCommonJS(template_manager_exports);
class TemplateManager {
  adapter;
  constructor(adapter) {
    this.adapter = adapter;
  }
  async uploadTemplateSetting(name, devices, screens, widgets) {
    if (devices != null) {
      await this.adapter.setStateAsync("settings." + name + ".devices", devices, true);
    }
    if (screens != null) {
      await this.adapter.setStateAsync("settings." + name + ".screens", screens, true);
    }
    if (widgets != null) {
      await this.adapter.setStateAsync("settings." + name + ".widgets", widgets, true);
    }
  }
  async getTemplateSettings(name) {
    let temp = await this.adapter.getStateAsync("settings." + name + ".devices");
    if (temp == null) {
      return {};
    }
    const devicesJSON = temp.val;
    temp = await this.adapter.getStateAsync("settings." + name + ".screens");
    if (temp == null) {
      return {};
    }
    const screensJSON = temp.val;
    temp = await this.adapter.getStateAsync("settings." + name + ".widgets");
    if (temp == null) {
      return {};
    }
    const widgetsJSON = temp.val;
    this.adapter.log.debug("WIDGETS " + widgetsJSON);
    return { screens: screensJSON, widgets: widgetsJSON, devices: devicesJSON };
  }
  async fetchTemplateSettings() {
    const settings = await this.adapter.getAdapterObjectsAsync();
    this.adapter.log.debug("Fetch Templates");
    const list = [];
    for (const id in settings) {
      const splitted = id.split(".");
      if (splitted[2] != "settings" || splitted.length > 4)
        continue;
      this.adapter.log.debug("Settings: " + id);
      list.push(splitted[3]);
    }
    return list;
  }
  async createNewTemplateSetting(templateSettings) {
    await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name, {
      type: "folder",
      common: {
        name: templateSettings.name,
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name + ".devices", {
      type: "state",
      common: {
        name: templateSettings.name + " devices",
        type: "string",
        role: "json",
        def: "{}",
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name + ".widgets", {
      type: "state",
      common: {
        name: templateSettings.name + " widgets",
        type: "string",
        role: "json",
        def: "{}",
        read: true,
        write: true
      },
      native: {}
    });
    await this.adapter.setObjectNotExistsAsync("settings." + templateSettings.name + ".screens", {
      type: "state",
      common: {
        name: templateSettings.name + " screens",
        type: "string",
        role: "json",
        def: "{}",
        read: true,
        write: true
      },
      native: {}
    });
  }
}
class TemplateSettings {
  name;
  constructor(name) {
    this.name = name;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TemplateManager,
  TemplateSettings
});
//# sourceMappingURL=template_manager.js.map
