import { IncomingMessage } from "http";
import { WebSocket } from "ws";
import { SamartHomeHandyBis } from "../main";
import { Server } from "./server";
import {
    EnumUpdatePack,
    EnumUpdateRequestPack,
    GetTemplateSettingPack,
    RequestLoginPacket,
    StateChangeRequestPack,
    SubscribeToDataPointsPack,
    TemplateSettingCreatePack,
    TemplateSettingUploadPack,
    TemplateSettingUploadSuccessPack,
    TemplateSettingsRequestedPack,
    NotificationPack,
    GetIoBFunctionsDataPackage,
} from "./datapacks";
import { TemplateSettings } from "../template/template_manager";
import * as CryptoJS from "crypto-js";

export class Client {
    socket;
    server;
    isConnected;
    req;
    adapter : SamartHomeHandyBis;
    approved;
    aesKey?: string;
    onlySendNotification: boolean = false;
    id?: string;
    name?: string;
    constructor(socket: WebSocket, server: Server, req: IncomingMessage, adapter: SamartHomeHandyBis) {
        this.socket = socket;
        this.server = server;
        this.req = req;
        this.isConnected = true;
        this.adapter = adapter;
        this.approved = false;
        this.aesKey = "";
        socket.on("message", this.onData.bind(this));
        socket.on("close", this.onEnd.bind(this));
        socket.onerror = this.onError.bind(this);
    }

    close(): void {
        this.socket.pause();
    }

    async sendMSG(msg: any, needAproval: boolean = false, log : boolean = true): Promise<boolean> {
        if (needAproval && !this.approved) {
            if(log) {
                this.adapter.log.debug("The Client was not approved to get a msg (" + msg + +") " + needAproval);
            }
            return false;
        }
        if (msg["type"] === "loginKey") {
            this.adapter.log.debug("Send MSG( LoginKey ) to Client(" + this.toString() + ")");
        } else {
            this.adapter.log.debug("Send MSG( " + JSON.stringify(msg) + ") to Client(" + this.toString() + ")");
        }
        const send = {
            type: msg["type"],
            content: "",
        };
        if (
            this.aesKey != "" &&
            Object.keys(msg).length > 1 &&
            (await this.adapter.getStateAsync("devices." + this.id + ".aesKey_active"))?.val
        ) {
            const aes = `${this.aesKey}${msg["type"]}`;
            send["content"] = CryptoJS.AES.encrypt(JSON.stringify(msg), aes).toString();
        } else {
            send["content"] = msg;
        }
        this.socket.send(JSON.stringify(send).toString());
        if (msg["type"] != "loginKey") {
            this.adapter.log.debug("Send MSG( " + JSON.stringify(send) + ") to Client(" + this.toString() + ")");
        }
        return false;
    }

    setAESKey(aesKey: string): void {
        this.aesKey = aesKey;
    }

    setID(id: string): void {
        this.id = id;
    }

    onData(data: string): void {
        try {
            const map = JSON.parse(data);
            if (map && map["content"] != null && typeof map["content"] === "string") {
                if (this.aesKey != "" || map["type"] === "requestLogin") {
                    let aes = "";
                    if (map["type"] === "requestLogin") {
                        aes = `tH8Lm-${map["type"]}`; // Dummy Key
                    } else {
                        aes = `${this.aesKey}${map["type"]}`;
                    }
                    try {
                        const bytes = CryptoJS.AES.decrypt(map["content"], aes);
                        map["content"] = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) ?? {};
                    } catch (error) {
                        this.onWrongAesKey();
                        this.adapter.log.warn(`Wrong AES Key - ${error}`);
                        return;
                    }
                } else {
                    if (this.aesKey == "" && map["type"] != "requestLogin") {
                        this.adapter.log.warn(`Please enabled AES encryption`);
                        this.onWrongAesKey();
                        return;
                    }
                }
            }
            const content = map["content"] ?? {};
            if (map["type"] === "requestLogin") {
                this.adapter.log.debug("Client(" + this.toString() + ") send requestLogin");
            } else {
                this.adapter.log.debug("Client(" + this.toString() + ") sended msg: " + data + " type: " + map["type"]);
            }
            switch (map["type"]) {
                case "iobStateChangeRequest":
                    if (this.approved)
                        this.onStateChangeRequest(new StateChangeRequestPack(content["stateID"], content["value"]));
                    break;
                case "enumUpdateRequest": //Enum update Request
                    if (this.approved) this.onEnumUpdateRequest(new EnumUpdateRequestPack(content["id"]));
                    break;
                case "subscribeToDataPoints":
                    if (this.approved)
                        this.onSubscribeToDataPoints(new SubscribeToDataPointsPack(content["dataPoints"]));
                    break;
                case "subscribeHistory":
                    if (this.approved)
                        /* this.onSubscribeToHistory(new SubscribeToDataPointsHistory(content["dataPoint"], content["end"], content["start"], content["interval"])); */
                    //TODO:
                    break;
                case "requestLogin":
                    if (!content["version"] && content["deviceName"]) {
                        //TODO: Send info to APP
                        this.adapter.log.warn(`Please update the HioB APP! [${content["version"]}]`);
                        return;
                    }
                    if(content["deviceName"]) {
                        this.onLoginRequest(new RequestLoginPacket(content["deviceName"], content["deviceID"], content["key"], content["version"], content["user"], content["password"]));
                    }
                    break;
                case "templateSettingCreate":
                    this.adapter.log.debug(JSON.stringify(content["name"]));
                    this.onTemplateSettingCreate(new TemplateSettingCreatePack(content["name"]));
                    break;
                case "requestTemplatesSettings":
                    this.adapter.log.debug("requestTemplatesSettings");
                    this.onTemplateSettingsRequest();
                    break;
                case "uploadTemplateSetting":
                    this.adapter.log.debug("uploadTemplateSetting");
                    this.onTemplateUpload(new TemplateSettingUploadPack(content["name"], content["devices"], content["screens"], content["widgets"]));
                    break;
                case "getTemplatesSetting":
                    this.adapter.log.debug("getTemplatesSetting");
                    this.getTemplatesSetting(content["name"], content["device"], content["screen"], content["widget"]);
                    break;
                case "notification":
                    this.onNotification(new NotificationPack(content["onlySendNotification"], content["content"], content["date"]));
                    break;
                    case "getIoBFunctions":
                        this.onGetIoBFunctions();
                        break;
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                this.adapter.log.error("There is something wrong with the sent data: No valid JSON Format");
            }
        }
    }
   

    onApprove(): void {
        this.approved = true;
        this.adapter.notificationManager.sendBacklog(this);
    }

    filter(value: Client): boolean {
        return value.isConnected == true;
    }

    onEnd(): void {
        this.isConnected = false;
        this.setConnection();
        this.adapter.log.debug("Closed connection to Client(" + this.toString() + ")");
        this.server.conClients = this.server.conClients.filter(this.filter.bind(this));
        this.adapter.log.debug("Size: " + this.server.conClients.length.toString());
    }

    onError(): void {
        this.isConnected = false;
        this.setConnection();
        this.adapter.log.debug("Closed connection to Client(" + this.toString() + ")");
    }

    setConnection(): void {
        //TODO
        // this.adapter.loginManager.pendingClients = this.adapter.loginManager.pendingClients.filter((e) => e.deviceID != this.deviceID);
        // this.adapter.loginManager.loginedClients = this.adapter.loginManager.loginedClients.filter((e) => e.deviceID != this.deviceID);
        this.adapter.setState("devices." + this.id + ".connected", this.isConnected, true);
    }

    onStateChangeRequest(request: StateChangeRequestPack): void {
        //Catch missing alias objects
        try {
            this.adapter.setForeignState(request.objectID, request.newValue, false);
        } catch (e) {
            this.adapter.log.warn(`The data point ${request.objectID} does not exist! ${e}`);
        }
    }

    async onEnumUpdateRequest(request: EnumUpdateRequestPack): Promise<void> {
        const result = await this.adapter.getEnumListJSON(request.id);
        this.sendMSG(new EnumUpdatePack(request.id, result).toJSON(), true);
    }

    onSubscribeToDataPoints(sub: SubscribeToDataPointsPack): void {
        this.adapter.subscribeToDataPoints(sub.dataPoints, this);
    }

    /* onSubscribeToHistory(sub: SubscribeToDataPointsHistory): void {
        // this.adapter.historyManager.subscribeToHistory(sub.dataPoint, sub.start, sub.end, this, sub.minInterval);
    } */

    onLoginRequest(requestLoginPacket: RequestLoginPacket): void {
        this.adapter.loginManager.onLoginRequest(this, requestLoginPacket).then(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (_) => {
                this.setConnection();
            }
        );
    }

    onWrongAesKey(): void {
        this.adapter.loginManager.onWrongAesKey(this);
    }

    async onTemplateSettingsRequest(): Promise<void> {
        const list = await this.adapter.templateManager.fetchTemplateSettings();
        this.sendMSG(new TemplateSettingsRequestedPack(list).toJSON(), true);
    }

    async onTemplateSettingCreate(templateSettingCreatePack: TemplateSettingCreatePack): Promise<void> {
        //TODO:
        this.adapter.log.debug("OnTemplateSettingCreate: " + templateSettingCreatePack.name);
        await this.adapter.templateManager.createNewTemplateSetting(new TemplateSettings(templateSettingCreatePack.name));
        this.sendMSG(new TemplateSettingCreatePack(templateSettingCreatePack.name).toJSON(), true);
    }

    async onTemplateUpload(uploadTemplateSettingPack: any): Promise<void> {
        await this.adapter.templateManager.uploadTemplateSetting(uploadTemplateSettingPack.name, uploadTemplateSettingPack.devices, uploadTemplateSettingPack.screens, uploadTemplateSettingPack.widgets);
        this.sendMSG(new TemplateSettingUploadSuccessPack().toJSON(), true);
    }

    async getTemplatesSetting(name: any, device: any, screen: any, widget: any): Promise<void> {
        this.adapter.log.debug("NAME: " + name);
        const map = await this.adapter.templateManager.getTemplateSettings(name);
        this.sendMSG(new GetTemplateSettingPack(device ? map["devices"]: null, screen ? map["screens"]: null, widget ? map["widgets"] : null).toJSON(), true);

    }

    onNotification(pack: NotificationPack): any {
        if (pack.onlySendNotification != undefined) {
            this.onlySendNotification = pack.onlySendNotification;
        }
    }

    onGetIoBFunctions(): void {
        this.adapter.deviceRepo.onGetIoBFunctions(this);
    }

    toString(): string {
        return JSON.stringify(this.req.socket.address()) + ":" + this.req.socket.remotePort + " id: " + this.id;
    }
}
