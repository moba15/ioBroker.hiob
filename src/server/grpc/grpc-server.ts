import type * as m from '../..//main';
import * as grpc from '@grpc/grpc-js';
import { addLoginServices } from '../services/login-service';
import { addStateServices } from '../services/state-service';
import { addConfigSyncServices } from '../services/config-sync-service';

export class GrpcServer {
    certPath: string;
    keyPath: string;
    useCert: boolean;
    port: number;
    adapter: m.SamartHomeHandyBis;
    gRpcServer: grpc.Server | undefined;
    stoped: boolean = false;
    constructor(
        port: number = 4500,
        keyPath: string = 'key.pem',
        certPath: string = 'cert.pem',
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

        this.gRpcServer.bindAsync(`0.0.0.0:${this.port}`, grpc.ServerCredentials.createInsecure(), () => {
            this.adapter.log.info(`Server listening on port: ${this.port}`);
        });
        if (this.adapter == null) {
            throw Error('Adapater null');
        }
        addLoginServices(this.gRpcServer, this.adapter);
        addStateServices(this.gRpcServer, this.adapter);
        addConfigSyncServices(this.gRpcServer, this.adapter);
    }

    stop(): void {
        this.adapter.log.info('Server stoped');
        this.stoped = true;
    }
}
