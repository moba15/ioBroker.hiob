/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import {Server} from "./server/server";
import {Listener} from "./listener/listener";
import {LoginManager} from "./login/loginmanager";
import {Client} from "./server/client";
import {StateChangedDataPack} from "./server/datapacks";
import {TemplateManager} from "./template/template_manager";
import {NotificationManager} from "./notification/notification_manager";

// Load your modules here, e.g.:
// import * as fs from "fs";
export class SamartHomeHandyBis extends utils.Adapter {
    server?: Server;
    listener: Listener
    loginManager: LoginManager
    port: number = 8095;
    keyPath: string = "";
    certPath: string = "";
    useCer: boolean = false
    templateManager: TemplateManager

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "hiob",
        });

        this.templateManager = new TemplateManager(this);
        this.listener = new Listener(this);
        new NotificationManager(this);
        this.loginManager = new LoginManager(this);
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.listener.onStateChange.bind(this.listener));
        // this.on("objectChange", this.onObjectChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));

    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here
        // Reset the connection indicator during startup
        this.setState("info.connection", true, true);


        await this.setObjectNotExistsAsync("approveNextLogins", {
            type: "state",
            common: {
                name: "Connected",
                type: "boolean",
                role: "indicator.approve",
                def: false,
                read: true,
                write: true,
            },
            native: {},
        });
        await this.setStateAsync("approveNextLogins", false, true);
        this.subscribeStates("approveNextLogins");
        this.loadConfigs();
        this.initServer();
    }

    private loadConfigs(): void {
        this.port = Number(this.config.port)
        this.certPath = this.config.certPath;
        this.useCer = this.config.useCert
        this.keyPath = this.config.keyPath


    }

    private initServer(): void {
        this.server = new Server(this.port, this.keyPath, this.certPath, this, this.useCer);
        this.server.startServer();
    }


    public async getEnumListJSON(id: string): Promise<{
        id: string;
        name: ioBroker.StringOrTranslated;
        icon: string | undefined;
        dataPointMembers: {
            name: any;
            id: any;
            role: any;
            otherDetails: any;
        }[];
    }[]> {
        const list: {
            id: string;
            name: ioBroker.StringOrTranslated;
            icon: string | undefined;
            dataPointMembers: {
                name: any;
                id: any;
                role: any;
                otherDetails: any;
            }[];
        }[] = [];


        const enumDevices = await this.getForeignObjectsAsync(id, "enum");

        for (const i in enumDevices) {
            const members : string[] | undefined = enumDevices[i].common.members;
            if(!members) {
                continue;
            }
            const dataPoints : any[] = [];
            if (!dataPoints) {
                continue
            }
            for (const z of members) {
                const dataPoint = await this.getForeignObjectAsync(z);
                if (!dataPoint)
                    continue;
                dataPoints.push({
                    "name": dataPoint!.common.name,
                    "id": z,
                    "role": dataPoint!.common.role,
                    "otherDetails": dataPoint!.common.custom,
                });
            }
            const map = {
                "id": enumDevices[i]._id,
                "name": enumDevices[i].common.name,
                "icon": enumDevices[i].common.icon,
                "dataPointMembers": dataPoints,
            };
            list.push(map);
        }


        return list;
    }

    public async subscribeToDataPoints(dataPoints: { [x: string]: any; }, client: Client): Promise<void> {
        this.log.debug(JSON.stringify(dataPoints));
        for (const i in dataPoints) {
            if(!(await this.foreignObjectExists(dataPoints[i]))) {
                this.log.warn("App tried to request to a deleted datapoint. " + dataPoints[i]);
                continue;
            }
            const state = await this.getForeignStateAsync(dataPoints[i]);
            if (state) {
                //this.log.info("sub to " + dataPoints[i]);
                this.subscribeForeignStates(dataPoints[i]);
                client.sendMSG(new StateChangedDataPack(dataPoints[i], state.val).toJSON(), true);
            }
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    // 	if (obj) {
    // 		// The object was changed
    // 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    // 	} else {
    // 		// The object was deleted
    // 		this.log.info(`object ${id} deleted`);
    // 	}
    // }

    /**
     * Is called if a subscribed state changes
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  */
    // private onMessage(obj: ioBroker.Message): void {
    // 	if (typeof obj === "object" && obj.message) {
    // 		if (obj.command === "send") {
    // 			// e.g. send email or pushover or whatever
    // 			this.log.info("send command");

    // 			// Send response in callback if required
    // 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
    // 		}
    // 	}
    // }

}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new SamartHomeHandyBis(options);
} else {
    // otherwise start the instance directly
    (() => new SamartHomeHandyBis())();
}
