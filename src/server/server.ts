import * as ws from "ws";
import * as fs from "fs";
import { createServer } from "https";
import * as m from "../main";
import { Client } from "./client";
import { FirstPingPack } from "./datapacks";
export class Server {
    certPath: string;
    keyPath: string;
    useCert: boolean;
    port: number;
    adapter: m.SamartHomeHandyBis;
    socket: ws.Server | undefined;
    stoped: boolean = false;
    conClients: Client[] = [];
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
            this.conClients.push(new Client(socket, this, req, this.adapter));
            socket.send(new FirstPingPack().toJSON());
        });
        server?.listen(this.port);
        this.adapter.log.info("Server started and is listening on port: " + this.port);
        this.stoped = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    broadcastMsg(msg: string, notification: boolean): void {
        //this.webSocketServer.clients.forEach((e) => {});
        this.conClients
            .filter((e) => !e.onlySendNotification)
            .forEach((element) => {
                if (element.isConnected) element.sendMSG(msg, true);
            });
    }

    isConnected(deviceID: string): boolean {
        return this.conClients.some((c) => c.isConnected && c.id == deviceID);
    }

    getClient(deviceID: string, onlySendNotificationClient = false): Client | undefined {
        return this.conClients.find(
            (c) => c.isConnected && c.id == deviceID && c.onlySendNotification == onlySendNotificationClient,
        );
    }

    stop(): void {
        for (const client of this.conClients) {
            client.stop();
        }
        this.socket?.close();
        this.adapter.log.info("Server stoped");
        this.stoped = true;
    }
}
