import * as ws from "ws";
import * as fs from "fs";
import { createServer } from "https";
import * as m from "../main";
import { Client } from "./client";
import { DataPack, FirstPingPack } from "./datapacks";
import { Mutex } from "async-mutex";
export class Server {
    certPath: string;
    keyPath: string;
    useCert: boolean;
    port: number;
    adapter: m.SamartHomeHandyBis;
    socket: ws.Server | undefined;
    stoped: boolean = false;
    clientMutex = new Mutex();
    conClients: {client: Client, lastPong: boolean}[] = [];
    messageBacklogForClient: {clientId: string, backlog: any[]}[] = [];
    pingPongInterval :  ioBroker.Interval | undefined;
    constructor(
        port: number = 4500,
        keyPath: string = "key.pem",
        certPath: string = "cert.pem",
        adapter: m.SamartHomeHandyBis,
        useCert: boolean = false,
    ) {
        this.port = port;
        this.certPath = certPath;
        this.keyPath = keyPath;
        this.adapter = adapter;
        this.useCert = useCert;
    }

    startServer(): void {
        let server;

        if (this.useCert) {
            server = createServer({
                cert: fs.readFileSync(this.certPath),
                key: fs.readFileSync(this.keyPath),
            });
            this.adapter.log.info("[Server] Starting secure server...");
            this.socket = new ws.Server({ server: server });
        } else {
            this.adapter.log.info("[Server] Starting server...");
            this.socket = new ws.Server({ port: this.port });
        }
        this.socket.on("error", (e) => {
            this.adapter.log.info("error: " + e.message);
            this.adapter.setState("info.connection", false, true);
        });
        this.adapter.setState("info.connection", true, true);
        this.socket.on("connection", (socket: ws.WebSocket, req) => {
            this.adapter.log.debug("Client connected");
            this.conClients.push({
                client: new Client(socket, this, req, this.adapter),
                lastPong: true,
            });
            socket.send(new FirstPingPack().toJSON());
        });
        server?.listen(this.port);
        this.adapter.log.info("Server started and is listening on port: " + this.port);
        this.stoped = false;
        this.startPingPong();
    }

    startPingPong() : void {
        this.pingPongInterval = this.adapter.setInterval(this.pingAll.bind(this), 15*1000)

    }

    private async pingAll() : Promise<void> {
        await this.clientMutex.runExclusive(() => {
            this.conClients = this.conClients.filter( (e) => {
                if(e.lastPong) {
                    return true;

                } else {
                    e.client.onEnd();
                    let backlog = this.messageBacklogForClient.find(c => c.clientId == e.client.id);
                    if(!backlog) {
                       backlog = {clientId: e.client.id!, backlog: []};
                       this.messageBacklogForClient.push(backlog);
                    }
                   e.client.messageHistoryMutex.runExclusive(() => {
                        backlog.backlog.push(...e.client.messageHistory);
                    });
                    //If there are 2 clients "connected" at the same time. This could happen for a short period of time
                    this.sendBacklog(e.client);

                    return false;
                }
            })

        });
        this.adapter.log.debug("Size: " + this.conClients.length.toString());

        this.conClients.forEach(e => {
            e.lastPong = false;
            e.client.socket.ping();
        });

    }

    sendBacklog(client: Client) : void {
        //TODO: Discuss if this would be thread safe. There should only be one client connected (with the same id), so this should be no problem?
        const backlog = this.messageBacklogForClient.find(e => e.clientId == client.id);
        backlog?.backlog.forEach(msg => client.sendMSG(msg, true));
    }

    broadcastMsg(msg: string): void {
        //this.webSocketServer.clients.forEach((e) => {});
        this.conClients
            .filter((e) => !e.client.onlySendNotification)
            .forEach((element) => {
                if (element.client.isConnected) element.client.sendMSG(msg, true);
            });
    }

    isConnected(deviceID: string): boolean {
        return this.conClients.some((c) => c.client.isConnected && c.client.id == deviceID);
    }

    getClient(deviceID: string): Client | undefined {
        return this.conClients.find((c) => c.client.isConnected && c.client.id == deviceID)?.client;
    }
    getClients(deviceID: string): Client[] {
        return this.conClients.filter((c) => c.client.isConnected && c.client.id == deviceID).map(e => e.client);
    }

    stop(): void {
        this.socket?.close();
        this.adapter.log.info("Server stoped");
        this.stoped = true;
        this.adapter.clearInterval(this.pingPongInterval);
    }
}
