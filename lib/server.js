"use strict";
//const net = require("net");
const WebSocketServer = require("ws");
/* eslint-disable indent */
// eslint-disable-next-line no-unused-vars
class Server {
    /**
     * @param {number} port
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
            this.adapter.log.console.error(e);
            this.adapter.setState("info.connection", false, true);
        }

        this.adapter.log.info("Sql Abfrage");
        const a = this;
        this.adapter.sendTo('sql.0', 'getHistory', {
            id: '*',
            options: {
                end:       Date.now(),
                count:     50,
                aggregate: 'onchange',
                addId: true
            }
        }, function (result) {
            for (var i = 0; i < result.result.length; i++) {
                a.adapter.log.info(result.result[i].id + ' ' + new Date(result.result[i].ts).toISOString());
            }
        });
        
    }

    /**
     * @param {any} msg
     */
    broadcastMsg(msg) {
        if(!this.webSocketServer)
            return;
        //this.webSocketServer.clients.forEach((e) => {});
        this.connectedClients.forEach((element) => {if(element.isConnected) element.sendMesg(msg);});
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
module.exports = Server;
class Client {
    /**
     * @param {WebSocketServer.WebSocket} ws
     * @param {Server} server
     * @param {import("http").IncomingMessage} req
     * @param {any} adapter
     */
    constructor(ws, adapter, server, req) {
        this.ws = ws;
        this.adapter = adapter;
        this.server = server;
        this.isConnected = true;
        this.req = req;
        ws.on("message", this.onData.bind(this));
        ws.on("close", this.onEnd.bind(this));
        ws.onerror = this.onError.bind(this);
    }

    close() {
        this.ws.pause();
    }

    /**
     * @param {string} msg
     */
    sendMesg(msg) {
        this.ws.send(msg);
        //this.adapter.log.info("Send MSG(" + msg + " to Client(" + this.toString() + ")");

    }

    onData(data) {
        const map = JSON.parse(data);
        //this.adapter.log.info("Client(" +  this.toString() +   ") sended msg: " + data + "type: " + map["type"]);
        switch (map["type"]) {
            case "iobStateChangeRequest":
                //this.adapter.log.info("change");
                this.onStateChangeRequest(new StateChangeRequestPack(map["content"]["stateID"], map["content"]["value"]));
                break;
            case "enumUpdateRequest": //Enum update Request
                //this.adapter.log.info("enum update request");
                this.onEnumUpdateRequest(new EnumUpdateRequestPack(map["content"]["id"]));
                break;
            case "subscribeToDataPoints":
                this.onSubscribeToDataPoints(new SubscribeToDataPointsPack(map["content"]["dataPoints"]) );

        }

    }
    onEnd() {
        this.adapter.log.info("Closed connection to Client("  + this.toString() + ")");
        this.isConnected = false;
    }
    onError() {
        this.adapter.log.info("Closed connection to Client("  + this.toString() + ")");
    }
    toString() {
        return this.req.socket.localAddress + ":" + this.req.socket.remotePort;
    }


    onStateChangeRequest(request) {
        this.adapter.writeState(request.objectID, request.newValue);
    }

    /**
     * @param {EnumUpdateRequestPack} request
     */
    async onEnumUpdateRequest(request) {
        const result = await this.adapter.getEnumListJSON(request.id);
        this.sendMesg(new EnumUpdatePack(request.id, result).toJSON());

    }

    /**
     * @param {SubscribeToDataPointsPack} sub
     */
    onSubscribeToDataPoints(sub) {
        this.adapter.subscribeToDataPoints(sub.dataPoints, this);
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
     * @param {string} enumsJSON
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
        super("firstPingFromIob");
    }

    toJSON() {
        const map = {
            "type": this.type,
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