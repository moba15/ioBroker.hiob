// GENERATED FILE - do not edit.
// Source: src-blockly/blockly.ts - rebuild with `npm run build:blockly`.
"use strict";
(() => {
  // src-blockly/blocks/hiob.ts
  var Blockly = window.Blockly;
  function instanceOptions() {
    const options = [[Blockly.Translate("hiob_anyInstance"), ""]];
    const instances = window.main?.instances;
    if (instances) {
      for (let i = 0; i < instances.length; i++) {
        const m = instances[i].match(/^system\.adapter\.(hiob(?:-dev)?)\.(\d+)$/);
        if (m) {
          const adapter = m[1];
          const n = parseInt(m[2], 10);
          options.push([`${adapter}.${n}`, `${adapter}.${n}`]);
        }
      }
    }
    if (options.length === 1) {
      for (let n = 0; n <= 4; n++) {
        options.push([`hiob.${n}`, `hiob.${n}`]);
      }
    }
    return options;
  }
  function logLevelOptions() {
    return [
      [Blockly.Translate("hiob_log_none"), ""],
      [Blockly.Translate("hiob_log_debug"), "debug"],
      [Blockly.Translate("hiob_log_info"), "log"],
      [Blockly.Translate("hiob_log_warn"), "warn"],
      [Blockly.Translate("hiob_log_error"), "error"]
    ];
  }
  function logLine(logLevel, prefix, text) {
    if (!logLevel) {
      return "";
    }
    return `console.${logLevel}('${prefix}: ' + ${text});
`;
  }
  function registerGenerator(type, generator) {
    if (Blockly.JavaScript.forBlock) {
      Blockly.JavaScript.forBlock[type] = generator;
    } else {
      Blockly.JavaScript[type] = generator;
    }
  }
  function installHiob() {
    Blockly.Sendto.blocks.hiob = `<block type="hiob">
    <field name="INSTANCE"></field>
    <field name="DEVICE"></field>
    <field name="LOG"></field>
    <value name="message">
        <shadow type="text">
            <field name="TEXT">Hello world!</field>
        </shadow>
    </value>
</block>`;
    Blockly.Blocks.hiob_mutator = {
      init: function() {
        this.appendDummyInput().appendField("Options");
        this.setNextStatement(true, null);
        this.setColour(Blockly.Sendto.HUE);
      }
    };
    ["title", "groupKey", "locked", "id"].forEach((field) => {
      Blockly.Blocks[`hiob_${field}`] = {
        init: function() {
          this.appendDummyInput().appendField(field);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(Blockly.Sendto.HUE);
        }
      };
    });
    Blockly.Blocks.hiob = {
      init: function() {
        this.appendDummyInput("INSTANCE").appendField(Blockly.Translate("hiob")).appendField(new Blockly.FieldDropdown(instanceOptions()), "INSTANCE");
        let deviceField;
        if (Blockly.FieldOID) {
          deviceField = new Blockly.FieldOID("", "channel");
        } else {
          deviceField = new Blockly.FieldTextInput("");
        }
        this.appendDummyInput("DEVICE").appendField(Blockly.Translate("hiob_device")).appendField(deviceField, "DEVICE");
        this.appendValueInput("message").appendField(Blockly.Translate("hiob_message"));
        this.appendDummyInput("LOG").appendField(Blockly.Translate("hiob_log")).appendField(new Blockly.FieldDropdown(logLevelOptions()), "LOG");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate("hiob_tooltip"));
        this.setHelpUrl("https://github.com/moba15/ioBroker.hiob/blob/main/README.md");
        if (Blockly.icons) {
          this.setMutator(
            new Blockly.icons.MutatorIcon(["hiob_title", "hiob_groupKey", "hiob_locked", "hiob_id"], this)
          );
        } else if (Blockly.Mutator) {
          this.setMutator(new Blockly.Mutator(["hiob_title", "hiob_groupKey", "hiob_locked", "hiob_id"], this));
        }
      },
      mutationToDom: function() {
        const container = document.createElement("mutation");
        container.setAttribute("title", this.title_ ? "true" : "false");
        container.setAttribute("groupKey", this.groupKey_ ? "true" : "false");
        container.setAttribute("locked", this.locked_ ? "true" : "false");
        container.setAttribute("id", this.id_ ? "true" : "false");
        return container;
      },
      domToMutation: function(xmlElement) {
        this.title_ = xmlElement.getAttribute("title") === "true";
        this.groupKey_ = xmlElement.getAttribute("groupKey") === "true";
        this.locked_ = xmlElement.getAttribute("locked") === "true";
        this.id_ = xmlElement.getAttribute("id") === "true";
        this.updateShape_();
      },
      decompose: function(workspace) {
        const containerBlock = workspace.newBlock("hiob_mutator");
        containerBlock.initSvg();
        let connection = containerBlock.nextConnection;
        ["title", "groupKey", "locked", "id"].forEach((field) => {
          if (this[`${field}_`]) {
            const itemBlock = workspace.newBlock(`hiob_${field}`);
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
          }
        });
        return containerBlock;
      },
      compose: function(containerBlock) {
        this.title_ = false;
        this.groupKey_ = false;
        this.locked_ = false;
        this.id_ = false;
        let itemBlock = containerBlock.nextConnection.targetBlock();
        while (itemBlock) {
          const field = itemBlock.type.replace("hiob_", "");
          this[`${field}_`] = true;
          itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
        }
        this.updateShape_();
        itemBlock = containerBlock.nextConnection.targetBlock();
        while (itemBlock) {
          const field = itemBlock.type.replace("hiob_", "");
          if (itemBlock.valueConnection_ && !itemBlock.valueConnection_.isHidden()) {
            const input = this.getInput(field);
            if (input) {
              input.connection.connect(itemBlock.valueConnection_);
            }
          }
          itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
        }
      },
      saveConnections: function(containerBlock) {
        let itemBlock = containerBlock.nextConnection.targetBlock();
        while (itemBlock) {
          const field = itemBlock.type.replace("hiob_", "");
          const input = this.getInput(field);
          itemBlock.valueConnection_ = input && input.connection.targetConnection;
          itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
        }
      },
      updateShape_: function() {
        const workspace = this.workspace;
        ["title", "groupKey", "locked", "id"].forEach((field) => {
          if (this[`${field}_`] && !this.getInput(field)) {
            const input = this.appendValueInput(field).appendField(field);
            setTimeout(
              (__input, __field) => {
                if (!__input.connection?.isConnected()) {
                  let shadowType = "text";
                  let fieldName = "TEXT";
                  let value = "";
                  if (__field === "title") {
                    value = "Notification";
                  } else if (__field === "groupKey") {
                    value = "Group";
                  } else if (__field === "locked") {
                    shadowType = "logic_boolean";
                    fieldName = "BOOL";
                    value = "FALSE";
                  } else if (__field === "id") {
                    value = "my_id";
                  }
                  const shadow = workspace.newBlock(shadowType);
                  shadow.setShadow(true);
                  shadow.setFieldValue(value, fieldName);
                  shadow.initSvg();
                  if (shadow.render) {
                    shadow.render();
                  }
                  shadow.outputConnection.connect(__input.connection);
                }
              },
              100,
              input,
              field
            );
          } else if (!this[`${field}_`] && this.getInput(field)) {
            this.removeInput(field);
          }
        });
        if (this.getInput("LOG")) {
          this.moveInputBefore("LOG", null);
        }
      }
    };
    registerGenerator("hiob", (block) => {
      const instance = block.getFieldValue("INSTANCE");
      let device = block.getFieldValue("DEVICE");
      const logLevel = block.getFieldValue("LOG");
      const message = Blockly.JavaScript.valueToCode(block, "message", Blockly.JavaScript.ORDER_ATOMIC);
      const title = (block.getInput("title") ? Blockly.JavaScript.valueToCode(block, "title", Blockly.JavaScript.ORDER_ATOMIC) : "") || "'Notification'";
      const groupKey = block.getInput("groupKey") ? Blockly.JavaScript.valueToCode(block, "groupKey", Blockly.JavaScript.ORDER_ATOMIC) : "";
      const locked = (block.getInput("locked") ? Blockly.JavaScript.valueToCode(block, "locked", Blockly.JavaScript.ORDER_ATOMIC) : "") || "false";
      const customId = block.getInput("id") ? Blockly.JavaScript.valueToCode(block, "id", Blockly.JavaScript.ORDER_ATOMIC) : "";
      const logText = logLine(logLevel, "hiob", message || "'Notification'");
      const instanceStr = instance ? instance.startsWith(".") ? `hiob${instance}` : instance : "hiob.0";
      const lines = [`sendTo('${instanceStr}', 'sendNotification', {
`];
      if (device && device !== "all") {
        const idParts = device.split(".");
        if (idParts.length > 2) {
          device = idParts[idParts.length - 1];
        }
        lines.push(`  deviceId: '${device}',
`);
      } else {
        lines.push(`  deviceId: '',
`);
      }
      lines.push(`  notification: {
`);
      if (customId) {
        lines.push(`    id: String(${customId}),
`);
      } else {
        lines.push(`    id: String(Math.floor(Math.random() * (2147483647 - 1028)) + 1028),
`);
      }
      lines.push(`    ts: Date.now(),
`);
      if (message) {
        lines.push(`    body: String(${message}),
`);
      } else {
        lines.push(`    body: 'Notification',
`);
      }
      lines.push(`    title: String(${title}),
`);
      if (groupKey) {
        lines.push(`    group: true,
`);
        lines.push(`    groupKey: String(${groupKey}),
`);
      } else {
        lines.push(`    group: false,
`);
      }
      lines.push(`    data: [],
`);
      lines.push(`    locked: Boolean(${locked})
`);
      lines.push(`  }
`);
      lines.push("});\n");
      lines.push(logText);
      return lines.join("");
    });
  }

  // src-blockly/i18n/de.json
  var de_default = {
    hiob: "hiob",
    hiob_anyInstance: "Alle Instanzen",
    hiob_allDevices: "Alle Geräte",
    hiob_device: "Gerät",
    hiob_message: "Mitteilung",
    hiob_tooltip: "Nachricht an HioB senden",
    hiob_log_none: "keins",
    hiob_log_debug: "debug",
    hiob_log_info: "info",
    hiob_log_warn: "warn",
    hiob_log_error: "error",
    hiob_log: "Loglevel"
  };

  // src-blockly/i18n/en.json
  var en_default = {
    hiob: "hiob",
    hiob_anyInstance: "all instances",
    hiob_allDevices: "all devices",
    hiob_device: "device",
    hiob_message: "message",
    hiob_tooltip: "Send message to HioB",
    hiob_log_none: "none",
    hiob_log_debug: "debug",
    hiob_log_info: "info",
    hiob_log_warn: "warn",
    hiob_log_error: "error",
    hiob_log: "log level"
  };

  // src-blockly/i18n/es.json
  var es_default = {
    hiob: "hiob"
  };

  // src-blockly/i18n/fr.json
  var fr_default = {
    hiob: "hiob"
  };

  // src-blockly/i18n/it.json
  var it_default = {
    hiob: "hiob"
  };

  // src-blockly/i18n/nl.json
  var nl_default = {
    hiob: "hiob"
  };

  // src-blockly/i18n/pl.json
  var pl_default = {
    hiob: "hiob"
  };

  // src-blockly/i18n/pt.json
  var pt_default = {
    hiob: "hiob"
  };

  // src-blockly/i18n/ru.json
  var ru_default = {
    hiob: "hiob"
  };

  // src-blockly/i18n/uk.json
  var uk_default = {
    hiob: "hiob"
  };

  // src-blockly/i18n/zh-cn.json
  var zh_cn_default = {
    hiob: "hiob"
  };

  // src-blockly/words.ts
  var Blockly2 = window.Blockly;
  var LANGUAGES = {
    de: de_default,
    en: en_default,
    es: es_default,
    fr: fr_default,
    it: it_default,
    nl: nl_default,
    pl: pl_default,
    pt: pt_default,
    ru: ru_default,
    uk: uk_default,
    "zh-cn": zh_cn_default
  };
  var README = "https://github.com/moba15/ioBroker.hiob/blob/main/README.md";
  function installWords() {
    Blockly2.Translate || (Blockly2.Translate = function(word, lang) {
      lang || (lang = window.systemLang);
      const entry = Blockly2.Words?.[word];
      return entry ? entry[lang || "en"] || entry.en : word;
    });
    const words = {};
    for (const [lang, texts] of Object.entries(LANGUAGES)) {
      for (const [word, text] of Object.entries(texts)) {
        if (text) {
          (words[word] || (words[word] = {}))[lang] = text;
        }
      }
    }
    Object.assign(Blockly2.Words, words);
    Blockly2.Words.hiob_help = { en: README };
  }

  // src-blockly/blockly.ts
  installWords();
  installHiob();
})();
