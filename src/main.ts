/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import { Listener } from "./listener/listener";
import { LoginManager } from "./login/loginmanager";
import { Client } from "./server/client";
import { AnswerSubscribeToDataPointsPack } from "./server/datapacks";
import { TemplateManager } from "./template/template_manager";
import { NotificationManager } from "./notification/notification_manager";
import { GrpcServer } from "./server/grpc/grpc-server";
type DatapointState = {
    val?: any,
    ack?: boolean
};
type ClientInfo = {
    firstload?: boolean
};
// Load your modules here, e.g.:
// import * as fs from "fs";
export class SamartHomeHandyBis extends utils.Adapter {
    server?: GrpcServer;
    listener: Listener;
    loginManager: LoginManager;
    notificationManager: NotificationManager;
    port: number = 8095;
    keyPath: string = "";
    certPath: string = "";
    useCer: boolean = false;
    templateManager: TemplateManager;
    clientinfos: {[key: string]: ClientInfo} = {};
    valueDatapoints: {[key: string]: DatapointState} = {};
    lang: string = "de";

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "hiob",
        });
        this.templateManager = new TemplateManager(this);
        this.listener = new Listener(this);
        this.notificationManager = new NotificationManager(this);
        this.loginManager = new LoginManager(this);
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.listener.onStateChange.bind(this.listener));
        // this.on("objectChange", this.onObjectChange.bind(this));
        this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.server = undefined;
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here
        // Reset the connection indicator during startup
        this.setState("info.connection", true, true);

        if (this.config.port < 1025) {
            this.log.warn(`Port is automatically changed because it is less than 1025 - ${this.config.port}`);
            this.config.port = 8095;
        } else if (this.config.port > 65535) {
            this.log.warn(`Port will be changed automatically as it is greater than 65535 - ${this.config.port}`);
            this.config.port = 8095;
        }

        const check_port = await this.getPortAsync(this.config.port);
        if (check_port != this.config.port) {
            this.log.warn(`Port ${this.config.port} is used!! Change to port ${check_port}.`);
            this.config.port = check_port;
        }

        await this.setObjectNotExistsAsync(`devices`, {
            type: "device",
            common: {
                name: {
                    "en": "Mobile phones",
                    "de": "Handys",
                    "ru": "Мобильный телефон",
                    "pt": "Telefones móveis",
                    "nl": "Mobiele telefoons",
                    "fr": "Téléphones mobiles",
                    "it": "Telefoni cellulari",
                    "es": "Teléfonos móviles",
                    "pl": "Telefon komórkowy",
                    "uk": "Мобільні телефони",
                    "zh-cn": "移动电话"
                },
            },
            native: {},
        });

        await this.setObjectNotExistsAsync("approveNextLogins", {
            type: "state",
            common: {
                name: {
                    en: "Connected",
                    de: "Verbunden",
                    ru: "Соединение",
                    pt: "Conectado",
                    nl: "Verbonden",
                    fr: "Connecté",
                    it: "Collegato",
                    es: "Conectado",
                    pl: "Połączone",
                    uk: "Зв'язатися",
                    "zh-cn": "已连接",
                },
                type: "boolean",
                role: "button",
                def: false,
                read: true,
                write: true,
            },
            native: {},
        });
        await this.setStateAsync("approveNextLogins", false, true);
        this.subscribeStates("*");
        this.check_aes_key();
        this.loadConfigs();
        this.initServer();
        const obj = await this.getForeignObjectAsync("system.config");
        if (obj && obj.common && obj.common.language) {
            try {
                this.lang = obj.common.language === this.lang ? this.lang : obj.common.language;
            } catch (e) {
                // Nothing
            }
        }

    }

    private loadConfigs(): void {
        this.port = Number(this.config.port);
        this.certPath = this.config.certPath;
        this.useCer = this.config.useCert;
        this.keyPath = this.config.keyPath;
    }

    private async check_aes_key(): Promise<void> {
        const channels = await this.getChannelsAsync();
        for (const element of channels) {
            const id = `${this.namespace}.devices`
            if (element["_id"].startsWith(id)) {
                const state = await this.getStateAsync(`${element["_id"]}.aesKey`);
                if (state != null && state.val != null) {
                    if (state.val.toString().length === 6) {
                        const shaAes = this.encrypt(state.val.toString());
                        await this.setStateAsync(`${element["_id"]}.aesKey`, shaAes, true);
                    }
                }
            }
        }
    }

    private initServer(): void {
        this.server = new GrpcServer(this.port, this.keyPath, this.certPath, this, this.useCer);
        this.server.startServer();
    }

    public async getEnumListJSON(id: string): Promise<
        {
            id: string;
            name: ioBroker.StringOrTranslated;
            icon: string | undefined;
            dataPointMembers: {
                name: any;
                id: any;
                role: any;
                otherDetails: any;
            }[];
        }[]
    > {
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
            const members: string[] | undefined = enumDevices[i].common.members;
            if (!members) {
                continue;
            }
            const dataPoints: any[] = [];
            if (!dataPoints) {
                continue;
            }
            for (const z of members) {
                const dataPoint = await this.getForeignObjectAsync(z);
                if (!dataPoint) continue;
                const name: ioBroker.Translated | string | undefined = dataPoint!.common.name;
                if (typeof name == "object") {
                    /**
                     * Translation
                     */
                    const translated: ioBroker.Translated = name as ioBroker.Translated;
                    const translatedString = translated[this.lang as ioBroker.Languages];
                    if (translatedString) {
                        dataPoints.push({
                            name: translatedString,
                            id: z,
                            role: dataPoint!.common.role,
                            otherDetails: dataPoint!.common.custom,
                        });
                    } else {
                        dataPoints.push({
                            name: name,
                            id: z,
                            role: dataPoint!.common.role,
                            otherDetails: dataPoint!.common.custom,
                        });
                    }
                } else {
                    dataPoints.push({
                        name: name,
                        id: z,
                        role: dataPoint!.common.role,
                        otherDetails: dataPoint!.common.custom,
                    });
                }
            }
            const map = {
                id: enumDevices[i]._id,
                name: enumDevices[i].common.name,
                icon: enumDevices[i].common.icon,
                dataPointMembers: dataPoints,
            };
            list.push(map);
        }

        return list;
    }


    public async subscribeToDataPointsProto(dataPoints: string[]): Promise<void> {
        this.log.debug("Trying to subscribe to " + dataPoints.length+ " Datapoints");
        const all_dp = [];
        for (const i of dataPoints) {
            let state = null;
            try {
                if (this.valueDatapoints[i] == null) {
                    this.valueDatapoints[i] = {};
                    state = await this.getForeignStateAsync(i);
                    this.log.debug("Use getForeignStateAsync");
                } else {
                    this.log.debug("Use memory");
                    state = {
                        val: this.valueDatapoints[i].val,
                        ack: this.valueDatapoints[i].ack,
                    };
                }
            } catch (e) {
                this.log.warn("App tried to request to a deleted datapoint. " + i);
                continue;
            }
            if (state) {
                if (state.ts != null) {
                    this.valueDatapoints[i].val = state.val;
                    this.valueDatapoints[i].ack = state.ack;
                }
                //this.log.info("sub to " + dataPoints[i]);
                const map = {
                    objectID: i,
                    value: state.val,
                    ack: state.ack,
                };
                all_dp.push(map);
                this.listener.addPendingSubscribeState(i);
            } else {
                this.log.warn("App tried to request to a deleted datapoint. " + i);
            }
        }
        if (all_dp.length > 0) {
            this.listener.subscribeToPendingStates();
            //client.sendMSG(new AnswerSubscribeToDataPointsPack(all_dp).toJSON(), true);
            this.log.debug("Sending states...");
        }
    }



    /**
     * @deprecated
     * @param dataPoints
     * @param client
     */
    public async subscribeToDataPoints(dataPoints: { [x: string]: any }, client: Client): Promise<void> {
        this.log.debug(JSON.stringify(dataPoints));
        const all_dp = [];
        for (const i in dataPoints) {
            let state = null;
            try {
                if (this.valueDatapoints[dataPoints[i]] == null) {
                    this.valueDatapoints[dataPoints[i]] = {};
                    state = await this.getForeignStateAsync(dataPoints[i]);
                    this.log.debug("Use getForeignStateAsync");
                } else {
                    this.log.debug("Use memory");
                    state = {
                        val: this.valueDatapoints[dataPoints[i]].val,
                        ack: this.valueDatapoints[dataPoints[i]].ack,
                    };
                }
            } catch (e) {
                this.log.warn("App tried to request to a deleted datapoint. " + dataPoints[i]);
                continue;
            }
            if (state) {
                if (state.ts != null) {
                    this.valueDatapoints[dataPoints[i]].val = state.val;
                    this.valueDatapoints[dataPoints[i]].ack = state.ack;
                }
                //this.log.info("sub to " + dataPoints[i]);
                const map = {
                    objectID: dataPoints[i],
                    value: state.val,
                    ack: state.ack,
                };
                all_dp.push(map);
                this.listener.addPendingSubscribeState(dataPoints[i]);
            } else {
                this.log.warn("App tried to request to a deleted datapoint. " + dataPoints[i]);
            }
        }3
        if (all_dp.length > 0) {
            this.listener.subscribeToPendingStates();
            client.sendMSG(new AnswerSubscribeToDataPointsPack(all_dp).toJSON(), true);
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            // Stop ws Server and Timeouts
            this.loginManager.stop();
            this.server = undefined;
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
    //private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
    //    if (state) {
    //        // The state was changed
    //        this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    //    } else {
    //        // The state was deleted
    //        this.log.info(`state ${id} deleted`);
    //    }
    //}

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  */
    private onMessage(obj: ioBroker.Message): void {
        if (typeof obj === "object" && obj.message) {
            if (obj.command === "send") {
                this.log.debug("send command");
                const message = obj.message;
                if ("notification" in message && "uuid" in message) {
                    //Send Not.
                    const cl: Client | undefined = this.server?.getClient(message["uuid"]);
                    this.notificationManager.sendNotificationLocal(cl, message["uuid"], JSON.stringify(message["notification"]));
                    if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
                } else {
                    if (obj.callback) this.sendTo(obj.from, obj.command, "Error received", obj.callback);
                }
            }
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new SamartHomeHandyBis(options);
} else {
    // otherwise start the instance directly
    (() => new SamartHomeHandyBis())();
}
