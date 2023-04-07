"use strict";
const { throws } = require("assert");
//const net = require("net");
const WebSocketServer = require("ws");
const SamartHomeHandyBis = require("../main");
const TemplateSettings = require("../lib/template_settings/template_settings_manager.js").TemplateSettings;
/* eslint-disable indent */
// eslint-disable-next-line no-unused-vars
class Server {
    /**
     * @param {number} port
     * @param {SamartHomeHandyBis} adapter
     */
    constructor(adapter, port) {
        this.port = port;
        this.adapter = adapter;
        this.connectedClients = new Array();
    }

    start() {




        this.adapter.log.info("Server is starting...");
        try {
            this.webSocketServer = new WebSocketServer.Server({port: this.port});
            this.webSocketServer.on("error", (e) =>  {this.adapter.log.info("error: " + e.message);this.adapter.setState("info.connection", false, true);} );
            this.adapter.setState("info.connection", true, true);
            this.webSocketServer.on("connection", (ws, req) => {
                //this.adapter.log.info("new client connected ");
                this.connectedClients.push(new Client(ws, this.adapter, this, req));
                ws.send(new FirstPingPack().toJSON());
            });
            this.adapter.log.info("Server started and is listening on port: " + this.port);
            this.stoped = false;

        } catch(e) {
            this.adapter.log.error(e);
            this.adapter.setState("info.connection", false, true);
        }

    }

    /**
     * @param {any} msg
     */
    broadcastMsg(msg) {
        if(!this.webSocketServer)
            return;
        //this.webSocketServer.clients.forEach((e) => {});
        this.connectedClients.forEach((element) => {if(element.isConnected) element.sendMesg(msg, true);});
    }

    stop() {
        //TODO: Stop server
        this.adapter.log.info("Server is stoping...");
        if(this.webSocketServer)
            this.webSocketServer.close();



        this.adapter.log.info("Server stoped");
        this.stoped = true;
    }


}
class Client {
    /**
     * @param {WebSocketServer.WebSocket} ws
     * @param {Server} server
     * @param {import("http").IncomingMessage} req
     * @param {SamartHomeHandyBis} adapter
     */
    constructor(ws, adapter, server, req) {
        this.ws = ws;
        this.adapter = adapter;
        this.server = server;
        this.isConnected = true;
        this.req = req;
        /**
         * @type {string | null}
         */
        this.deviceID = null;
        ws.on("message", this.onData.bind(this));
        ws.on("close", this.onEnd.bind(this));
        ws.onerror = this.onError.bind(this);
        this.approved = false;
    }

    close() {
        this.ws.pause();
    }

    /**
     * @param {string} msg
     * @param {boolean} needAproval
     */
    sendMesg(msg, needAproval) {
        if(needAproval && !this.approved) {
            this.adapter.log.debug("Declined MSG(" + msg + " to Client(" + this.toString() + ")");
            return;

        }
        this.ws.send(msg);
        this.adapter.log.debug("Send MSG(" + msg + " to Client(" + this.toString() + ")");

    }

    /**
     * @param {string} data
     */
    onData(data) {
        const map = JSON.parse(data);
        this.adapter.log.debug("Client(" +  this.toString() +   ") sended msg: " + data + "type: " + map["type"]);
        switch (map["type"]) {
            case "iobStateChangeRequest":
                //this.adapter.log.info("change");
                if(this.approved)
                    this.onStateChangeRequest(new StateChangeRequestPack(map["content"]["stateID"], map["content"]["value"]));
                break;
            case "enumUpdateRequest": //Enum update Request
                if(this.approved)
                    this.onEnumUpdateRequest(new EnumUpdateRequestPack(map["content"]["id"]));
                break;
            case "subscribeToDataPoints":
                if(this.approved)
                    this.onSubscribeToDataPoints(new SubscribeToDataPointsPack(map["content"]["dataPoints"]) );
                break;
            case "subscribeHistory":
                if(this.approved)
                    this.onSubscribeToHistory(new SubscribeToDataPointsHistory(map["content"]["dataPoint"], map["content"]["end"], map["content"]["start"], map["content"]["interval"]));
                break;
            case "requestLogin":
                this.onLoginRequest(new RequestLoginPacket(map["content"]["deviceName"], map["content"]["deviceID"], map["content"]["key"], map["content"]["user"], map["content"]["password"]));
                break;
            case "templateSettingCreate":
                this.adapter.log.debug((map["content"]["name"]));
                this.onTemplateSettingCreate(new TemplateSettingCreatePack(map["content"]["name"]));
                break;
            case "requestTemplatesSettings":
                this.adapter.log.debug("requestTemplatesSettings");
                this.onTemplateSettingsRequest();
                break;
            case "uploadTemplateSetting":
                this.adapter.log.debug("uploadTemplateSetting");
                this.onTemplateUpload(new TemplateSettingUploadPack(map["content"]["name"], map["content"]["devices"], map["content"]["screens"], map["content"]["widgets"]));
                break;

            case "getTemplatesSetting":
                this.adapter.log.debug("getTemplatesSetting");
                this.getTemplatesSetting(map["content"]["name"], map["content"]["device"], map["content"]["screen"], map["content"]["widget"]);
                break;



        }


    }

    onApprove() {
        this.approved = true;
    }

    /**
     * @param {Client} value
     * @param {any} index
     * @param {any} arr
     */
     // eslint-disable-next-line no-unused-vars
    filter(value, index, arr) {
        return value.isConnected == true;
    }
    onEnd() {
        this.setConnection();
        this.isConnected = false;
        this.adapter.log.debug("Closed connection to Client("  + this.toString() + ")");
        this.server.connectedClients = this.server.connectedClients.filter(this.filter.bind(this));
        this.adapter.log.debug("Size: " + this.server.connectedClients.length.toString());
    }
    onError() {
        this.setConnection();
        this.isConnected = false;
        this.adapter.log.debug("Closed connection to Client("  + this.toString() + ")");
    }
    toString() {
        return this.req.socket.localAddress + ":" + this.req.socket.remotePort;
    }

    setConnection() {
        this.adapter.loginManager.pendingClients = this.adapter.loginManager.pendingClients.filter((e) => e.deviceID != this.deviceID);
        this.adapter.loginManager.loginedClients = this.adapter.loginManager.loginedClients.filter((e) => e.deviceID != this.deviceID);
        this.adapter.setStateAsync("devices." + this.deviceID + ".connected", false, true);
    }


    /**
     * @param {StateChangeRequestPack} request
     */
    onStateChangeRequest(request) {
        this.adapter.writeState(request.objectID, request.newValue);
    }

    /**
     * @param {EnumUpdateRequestPack} request
     */
    async onEnumUpdateRequest(request) {
        const result = await this.adapter.getEnumListJSON(request.id);
        this.sendMesg(new EnumUpdatePack(request.id, result).toJSON(), true);

    }

    /**
     * @param {SubscribeToDataPointsPack} sub
     */
    onSubscribeToDataPoints(sub) {
        this.adapter.subscribeToDataPoints(sub.dataPoints, this);
    }

    /**
     * @param {SubscribeToDataPointsHistory} sub
     */
    onSubscribeToHistory(sub) {
        this.adapter.historyManager.subscribeToHistory(sub.dataPoint, sub.start, sub.end, this, sub.minInterval);
    }

    /**
     * @param {RequestLoginPacket} requestLoginPacket
     */
    onLoginRequest(requestLoginPacket) {
        this.adapter.loginManager.onLoginRequest(this,requestLoginPacket.deviceName, requestLoginPacket.deviceID, requestLoginPacket.key, requestLoginPacket.user, requestLoginPacket.password);

    }

    async onTemplateSettingsRequest()  {
        let list = await this.adapter.templateSettingsManager.fetchTemplateSettings();
        this.sendMesg(new TemplateSettingsRequestedPack(list).toJSON(), true);

    }

    /**
     * @param {TemplateSettingCreatePack} templateSettingCreatePack
     */
    async onTemplateSettingCreate(templateSettingCreatePack) {
        this.adapter.log.debug("OnTemplateSettingCreate: " + templateSettingCreatePack.name);
        await this.adapter.templateSettingsManager.createNewTemplateSetting(new TemplateSettings(templateSettingCreatePack.name), this);
        this.sendMesg(new TemplateSettingCreatePack(templateSettingCreatePack.name).toJSON(), true);
    }

    /**
     * @param {TemplateSettingUploadPack} uploadTemplateSettingPack
     */
    async onTemplateUpload(uploadTemplateSettingPack) {
        await this.adapter.templateSettingsManager.uploadTemplateSetting(uploadTemplateSettingPack.name, uploadTemplateSettingPack.devices, uploadTemplateSettingPack.screens, uploadTemplateSettingPack.widgets, this);
        this.sendMesg(new TemplateSettingUploadSuccessPack().toJSON(), true);
    }

    async getTemplatesSetting(name, device, screen, widget) {
        this.adapter.log.debug("NAME: " + name);
        const map = await this.adapter.templateSettingsManager.getTemplateSettings(name);
        this.sendMesg(new GetTemplateSettingPack(device ? map["devices"]: null, screen ? map["screens"]: null, widget ? map["widgets"] : null).toJSON(), true);

    }


}

class DataPack {
    /**
     * @param {string} type
     */
    constructor(type) {
        this.type = type;
    }

    toJSON() {}
}
class StateChangeRequestPack extends DataPack {
    /**
     * @param {any} objectID
     * @param {any} newValue
     */
    constructor(objectID, newValue) {
        super("iobStateChangeRequest");
        this.objectID = objectID;
        this.newValue = newValue;
    }

    toJSON() {
        const map = {
            "type": this.type,
            "objectID": this.objectID,
            "newValue": this.newValue,
        };
        return JSON.stringify(map).toString();
    }

}

class EnumUpdateRequestPack extends DataPack {

    /**
     * @param {string} id
     */
    constructor(id) {
        super("enumUpdateRequest");
        this.id = id;
    }

}

class EnumUpdatePack extends DataPack {

    /**
     * @param {string} id
     * @param {Array} enumsJSON
     */
    constructor(id, enumsJSON) {
        super("enumUpdate");
        this.id = id;
        this.enumsJSON = enumsJSON;
    }

    toJSON() {
        const map = {
            "type": this.type,
            "enums": this.enumsJSON,
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
            "type": this.type,
        };
        return JSON.stringify(map).toString();
    }

}

class RequestLoginPacket extends DataPack {
    /**
     * @param {any} deviceName
     * @param {any} deviceID
     * @param {any} key
     * @param {any} user
     * @param {any} password
     */
    constructor(deviceName, deviceID, key, user, password ) {
        super("requestLogin");
        this.deviceName = deviceName;
        this.deviceID = deviceID;
        this.key = key;
        this.user = user;
        this.password = password;
    }
}

class LoginAnswer extends DataPack {
    /**
     * @param {any} key
     * @param {any} suc
     */
    constructor(key, suc)  {
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


    /**
     * @param {any} dataPoints
     */
    constructor(dataPoints) {
        super("subscribeToDataPoints");
        this.dataPoints = dataPoints;
    }

}

class SubscribeToDataPointsHistory extends DataPack {


    /**
     * @param {any} dataPoint
     * @param {any} end
     * @param {any} start
     * @param {any} minInterval
     */
    constructor(dataPoint, end, start, minInterval) {
        super("subscribeHistory");
        this.dataPoint = dataPoint;
        this.end = end;
        this.start = start;
        this.minInterval = minInterval;
    }

}

class LoginKeyPacket extends DataPack {
    /**
     * @param {string} key
     */
    constructor(key) {
        super("loginKey");
        this.key = key;
    }

    toJSON() {
        const map = {
            "type": this.type,
            "key": this.key,
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
            "type": this.type,
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
            "type": this.type,
        };
        return JSON.stringify(map).toString();
    }
}

class TemplateSettingCreatePack extends DataPack {
    /**
     * @param {any} name
     */
    constructor(name) {
        super("templateSettingCreate");
        this.name = name;
    }

    toJSON() {
        const map = {
            "type": this.type,
        };
        return JSON.stringify(map).toString();
    }

}

class TemplateSettingsRequestedPack extends DataPack {
    /**
     * @param {any} list
     */
    constructor(list) {
        super("requestTemplatesSettings");
        this.list = list;
    }

    toJSON() {
        const map = {
            "type": this.type,
            "settings": this.list,
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
            "type": this.type,
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
            "devices": this.devices,
        };
        return JSON.stringify(map).toString();
    }


}



module.exports = {Server, LoginKeyPacket, LoginApprovedPacket, LoginDeclinedPacket, Client, TemplateSettingCreatePack  };
