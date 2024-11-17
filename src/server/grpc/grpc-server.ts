import * as ws from "ws";
import * as fs from "fs";
import * as m from "../..//main";
import { Client } from ".././client";
import * as grpc from "@grpc/grpc-js";
import * as proto from "../../generated/login/login"
import { addLoginServices } from "../services/login-service";
import {addStateServices} from "../services/state-service"


export class GrpcServer {
    certPath: string;
    keyPath: string;
    useCert: boolean;
    port: number;
    adapter: m.SamartHomeHandyBis;
    gRpcServer: grpc.Server | undefined;
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
        this.gRpcServer = new grpc.Server();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
       
        
        this.gRpcServer.bindAsync("0.0.0.0:" + this.port, grpc.ServerCredentials.createInsecure(), () => {
            this.adapter.log.info("Server listening on port: " + this.port);
        });
        if(this.adapter == null) {
            throw Error("Adapater null");
        }
        addLoginServices(this.gRpcServer, this.adapter);
        addStateServices(this.gRpcServer, this.adapter);

       
    }

    broadcastMsg(msg: string): void {
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

    getClient(deviceID: string): Client | undefined {
        return this.conClients.find((c) => c.isConnected && c.id == deviceID);
    }

    stop(): void {
   
        this.adapter.log.info("Server stoped");
        this.stoped = true;
    }
}
