// @ts-nocheck
/* eslint-disable no-undef */
"use strict";

if (typeof goog !== "undefined") {
    goog.provide("Blockly.JavaScript.Sendto");
    goog.require("Blockly.JavaScript");
}

// --- SendTo notification
Blockly.Words["no_instance_found"] = {
    en: "No instance found",
    de: "Keine Instanz gefunden",
    ru: "Не найден",
    pt: "Nenhuma instância encontrada",
    nl: "Geen instantie gevonden",
    fr: "Aucune instance trouvée",
    it: "Nessun caso trovato",
    es: "No hay caso encontrado",
    pl: "Brak",
    uk: "Не знайдено",
    "zh-cn": "未找到实例",
};
Blockly.Words["no_instance_found"] = {
    en: "No instance found",
    de: "Keine Instanz gefunden",
    ru: "Не найден",
    pt: "Nenhuma instância encontrada",
    nl: "Geen instantie gevonden",
    fr: "Aucune instance trouvée",
    it: "Nessun caso trovato",
    es: "No hay caso encontrado",
    pl: "Brak",
    uk: "Не знайдено",
    "zh-cn": "未找到实例",
};
Blockly.Words["hiob"] = {
    en: "HioB",
    de: "HioB",
    ru: "HioB",
    pt: "HioB",
    nl: "HioB",
    fr: "HioB",
    it: "HioB",
    es: "HioB",
    pl: "HioB",
    uk: "HioB",
    "zh-cn": "顿",
};
Blockly.Words["hiob_message"] = {
    en: "Notify message",
    de: "Nachricht senden",
    ru: "Уведомление",
    pt: "Notifique a mensagem",
    nl: "Bericht aanmelden",
    fr: "Message d'alerte",
    it: "Invia messaggio",
    es: "Notificar el mensaje",
    pl: "Powiadomienie",
    uk: "Повідомлення",
    "zh-cn": "通知消息",
};
Blockly.Words["hiob_log"] = {
    en: "Loglevel",
    de: "Loglevel",
    ru: "Войти",
    pt: "Nível de log",
    nl: "Loglevel",
    fr: "Loglevel",
    it: "Livello di registro",
    es: "Nivel de estudios",
    pl: "Logos",
    uk: "Увійти",
    "zh-cn": "后勤问题",
};
Blockly.Words["hiob_log_none"] = {
    en: "none",
    de: "kein",
    ru: "нет",
    pt: "nenhum",
    nl: "niemand",
    fr: "aucun",
    it: "nessuno",
    es: "ninguno",
    pl: "żaden",
    uk: "немає",
    "zh-cn": "无",
};
Blockly.Words["hiob_log_info"] = {
    en: "info",
    de: "info",
    ru: "инфо",
    pt: "info",
    nl: "info",
    fr: "info",
    it: "info",
    es: "info",
    pl: "info",
    uk: "контакти",
    "zh-cn": "导 言",
};
Blockly.Words["hiob_log_debug"] = {
    en: "debug",
    de: "debug",
    ru: "дебаг",
    pt: "depuração",
    nl: "debug",
    fr: "debug",
    it: "debug",
    es: "debug",
    pl: "debug",
    uk: "напляскване",
    "zh-cn": "黑暗",
};
Blockly.Words["hiob_log_warn"] = {
    en: "warn",
    de: "warnen",
    ru: "предупреждение",
    pt: "avisem",
    nl: "waarschuwing",
    fr: "prévenir",
    it: "avvertire avvertire",
    es: "warn",
    pl: "ostrzegać",
    uk: "про нас",
    "zh-cn": "战争",
};
Blockly.Words["hiob_log_error"] = {
    en: "error",
    de: "fehler",
    ru: "ошибка",
    pt: "erro",
    nl: "error",
    fr: "erreur",
    it: "errore",
    es: "error",
    pl: "błąd",
    uk: "про нас",
    "zh-cn": "错误",
};
Blockly.Words["hiob_tooltip"] = {
    en: "Send a message to a phone",
    de: "Sende eine Nachricht an ein Telefon",
    ru: "Отправить сообщение на телефон",
    pt: "Enviar mensagem para um telefone",
    nl: "Een bericht naar een telefoon sturen",
    fr: "Envoyer un message à un téléphone",
    it: "Invia un messaggio a un telefono",
    es: "Enviar un mensaje a un teléfono",
    pl: "Wyślij wiadomość do telefonu",
    uk: "Надіслати повідомлення на телефон",
    "zh-cn": "向电话发送消息",
};
Blockly.Words["hiob_help"] = {
    en: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    de: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/de/README.md",
    ru: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    pt: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    nl: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    fr: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    it: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    es: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    pl: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    uk: "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
    "zh-cn": "https://github.com/moba15/ioBroker.hiob/blob/main/docs/en/README.md",
};
Blockly.Words["hiob_choose"] = {
    en: "All phones",
    de: "Alle Telefone",
    ru: "Все телефоны",
    pt: "Todos os telefones",
    nl: "Alle telefoons",
    fr: "Tous les téléphones",
    it: "Tutti i telefoni",
    es: "Todos los teléfonos",
    pl: "Wszystkie telefony",
    uk: "Всі телефони",
    "zh-cn": "所有电话",
};
Blockly.Words["hiob_id"] = {
    en: "Phones ID",
    de: "Telefon-ID",
    ru: "Телефоны ID",
    pt: "ID de telefones",
    nl: "Telefoon ID",
    fr: "Numéro de téléphone",
    it: "ID telefoni",
    es: "ID de teléfonos",
    pl: "Identyfikator telefonów",
    uk: "Ідентифікатор телефону",
    "zh-cn": "电话号码",
};
Blockly.Sendto.blocks["hiob_notify"] =
    '<block type="hiob_notify">' +
    '     <value name="INSTANCE">' +
    "     </value>" +
    '     <value name="HIOB_DEVICES">' +
    "     </value>" +
    '     <value name="MESSAGE">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">message</field>' +
    "         </shadow>" +
    "     </value>" +
    "</block>";

Blockly.Blocks["hiob_notify"] = {
    init: function () {
        const options = [];
        const options_user = [[Blockly.Translate("hiob_choose"), "all"]];
        if (typeof main !== "undefined" && main.instances) {
            for (let i = 0; i < main.instances.length; i++) {
                
                const m = main.instances[i].match(/^system.adapter.hiob.(\d+)$/);
                if (m) {
                    console.log(JSON.stringify(main.objects[main.instances[i]]));
                    const n = parseInt(m[1], 10);
                    options.push(["hiob." + n, "." + n]);
                    if (main.objects[main.instances[i]].native.devices) {
                        for (const s of main.objects[main.instances[i]].native.devices) {
                            options_user.push([n + "." + s, s]);
                        }
                    }
                }
            }
        }
        if (Object.keys(options).length == 0) options.push([Blockly.Translate("no_instance_found"), ""]);
        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("hiob"))
            .appendField(new Blockly.FieldDropdown(options), "INSTANCE");

        this.appendDummyInput("HIOB_DEVICES")
            .appendField(Blockly.Translate("hiob_id"))
            .appendField(new Blockly.FieldOID(Blockly.Translate('hiob_device'), 'channel'), "HIOB_DEVICES");

        this.appendValueInput("MESSAGE").appendField(Blockly.Translate("hiob_message"));

        this.appendDummyInput("LOG")
            .appendField(Blockly.Translate("hiob_log"))
            .appendField(
                new Blockly.FieldDropdown([
                    [Blockly.Translate("hiob_log_none"), ""],
                    [Blockly.Translate("hiob_log_info"), "log"],
                    [Blockly.Translate("hiob_log_debug"), "debug"],
                    [Blockly.Translate("hiob_log_warn"), "warn"],
                    [Blockly.Translate("hiob_log_error"), "error"],
                ]),
                "LOG",
            );
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate("hiob_tooltip"));
        this.setHelpUrl(Blockly.Translate("hiob_help"));

        this.titleCount_ = 0;
        this.bodyCount_ = 0;
    },
    mutationToDom: function () {

        const container = document.createElement('mutation');
        container.setAttribute('title', 1);
        container.setAttribute('body', 1);
        return container;
    },
    domToMutation: function(xmlElement) {
        this.caseCount_    = parseInt(xmlElement.getAttribute('title'), 10);
        this.defaultCount_ = parseInt(xmlElement.getAttribute('body'), 10);

        if(this.titleCount_ > 0) {
            this.appendValueInput('title')
                    .appendField("title");
        }

        if (this.bodyCount_ > 0)  {
            this.appendValueInput('body')
                .appendField('body');
        }
    },
};

Blockly.JavaScript["hiob_notify"] = function (block) {
    const dropdown_instance = block.getFieldValue("INSTANCE");
    const value_message = Blockly.JavaScript.valueToCode(block, "MESSAGE", Blockly.JavaScript.ORDER_ATOMIC);
    const selected_device = block.getFieldValue("HIOB_DEVICES");
    const logLevel = block.getFieldValue("LOG");

    let logText = "";
    if (logLevel) {
        logText = "console." + logLevel + '("hiob - " + ' + value_message + ");\n";
    }
    const device = selected_device.split(".");
    const device_id = device[device.length -1];

    return (
        "\n"+
        'sendTo("hiobs' +
        dropdown_instance +
        '", "send", {message: ' +
        value_message +
        ", uuid: '" +
        device_id +
        "'});\n" +
        logText
    );
};