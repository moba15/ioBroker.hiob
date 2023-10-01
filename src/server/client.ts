import { IncomingMessage } from "http";
import { WebSocket } from "ws";
import { HiobTs } from "../main";
import { Server } from "./server";
import { EnumUpdatePack, EnumUpdateRequestPack, GetTemplateSettingPack, RequestLoginPacket, StateChangeRequestPack, SubscribeToDataPointsHistory, SubscribeToDataPointsPack, TemplateSettingCreatePack, TemplateSettingUploadPack, TemplateSettingUploadSuccessPack, TemplateSettingsRequestedPack } from "./datapacks";
import { TemplateSettings } from "../template/template_manager";

export class Client {
    socket;
    server;
    isConnected;
    req;
    adapter;
    approved;
    id?: string
    name?: string
    constructor(socket: WebSocket, server: Server, req: IncomingMessage, adapter: HiobTs) {
        this.socket = socket;
        this.server = server;
        this.req = req;
        this.isConnected = true;
        this.adapter = adapter;
        this.approved = false;
        socket.on("message", this.onData.bind(this));
        socket.on("close", this.onEnd.bind(this));
        socket.onerror = this.onError.bind(this);
    }

    close(): void {
        this.socket.pause();
    }

    sendMSG(msg: string, needAproval: boolean = false): boolean {
        if (needAproval && !this.approved) {
            this.adapter.log.debug("The Client was not approved to get a msg (" + msg + + ")" +  needAproval)
            return false
        }
        this.socket.send(msg)
        this.adapter.log.debug("Send MSG( " + msg + ")" + " to Client(" + this.toString() + ")")
        return false
    }


    onData(data: string): void {
        try {
            const map = JSON.parse(data);
            this.adapter.log.debug("Client(" + this.toString() + ") sended msg: " + data + "type: " + map["type"]);
            switch (map["type"]) {
                case "iobStateChangeRequest":
                    if (this.approved)
                        this.onStateChangeRequest(new StateChangeRequestPack(map["content"]["stateID"], map["content"]["value"]));
                    break;
                case "enumUpdateRequest": //Enum update Request
                    if (this.approved)
                        this.onEnumUpdateRequest(new EnumUpdateRequestPack(map["content"]["id"]));
                    break;
                case "subscribeToDataPoints":
                    if (this.approved)
                        this.onSubscribeToDataPoints(new SubscribeToDataPointsPack(map["content"]["dataPoints"]));
                    break;
                case "subscribeHistory":
                    if (this.approved)
                        this.onSubscribeToHistory(new SubscribeToDataPointsHistory(map["content"]["dataPoint"], map["content"]["end"], map["content"]["start"], map["content"]["interval"]));
                    //TODO:
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

        } catch (e) {
            if (e instanceof SyntaxError) {
                this.adapter.log.error("There is something wrong with the sent data: No valid JSON Format")
            }

        }


    }


    onApprove(): void {
        this.approved = true;
    }

    filter(value: Client): boolean {
        return value.isConnected == true;
    }

    onEnd(): void {
        this.setConnection();
        this.isConnected = false;
        this.adapter.log.debug("Closed connection to Client(" + this.toString() + ")");
        this.server.conClients = this.server.conClients.filter(this.filter.bind(this));
        this.adapter.log.debug("Size: " + this.server.conClients.length.toString());
    }
    onError(): void {
        this.setConnection();
        this.isConnected = false;
        this.adapter.log.debug("Closed connection to Client(" + this.toString() + ")");
    }

    setConnection(): void {
        //TODO
        // this.adapter.loginManager.pendingClients = this.adapter.loginManager.pendingClients.filter((e) => e.deviceID != this.deviceID);
        // this.adapter.loginManager.loginedClients = this.adapter.loginManager.loginedClients.filter((e) => e.deviceID != this.deviceID);
        // this.adapter.setStateAsync("devices." + this.deviceID + ".connected", false, true);
    }


    onStateChangeRequest(request: StateChangeRequestPack): void {
        this.adapter.setForeignState(request.objectID, request.newValue, false);
    }

    async onEnumUpdateRequest(request: EnumUpdateRequestPack): Promise<void> {
        const result = await this.adapter.getEnumListJSON(request.id);
        this.sendMSG(new EnumUpdatePack(request.id, result).toJSON(), true);

    }


    onSubscribeToDataPoints(sub: SubscribeToDataPointsPack): void {
        this.adapter.subscribeToDataPoints(sub.dataPoints, this);
    }

    onSubscribeToHistory(sub: SubscribeToDataPointsHistory): void {
        // this.adapter.historyManager.subscribeToHistory(sub.dataPoint, sub.start, sub.end, this, sub.minInterval);
    }

    onLoginRequest(requestLoginPacket: RequestLoginPacket): void {
        this.adapter.loginManager.onLoginRequest(this,requestLoginPacket);

    }

    async onTemplateSettingsRequest(): Promise<void> {
        const list = await this.adapter.templateManager.fetchTemplateSettings();
        this.sendMSG(new TemplateSettingsRequestedPack(list).toJSON(), true);

    }

    async onTemplateSettingCreate(templateSettingCreatePack: TemplateSettingCreatePack): Promise<void> {
        //TODO:
        this.adapter.log.debug("OnTemplateSettingCreate: " + templateSettingCreatePack.name);
        await this.adapter.templateManager.createNewTemplateSetting(new TemplateSettings(templateSettingCreatePack.name), this);
        this.sendMSG(new TemplateSettingCreatePack(templateSettingCreatePack.name).toJSON(), true);
    }

    async onTemplateUpload(uploadTemplateSettingPack: any): Promise<void> {
        await this.adapter.templateManager.uploadTemplateSetting(uploadTemplateSettingPack.name, uploadTemplateSettingPack.devices, uploadTemplateSettingPack.screens, uploadTemplateSettingPack.widgets, this);
        this.sendMSG(new TemplateSettingUploadSuccessPack().toJSON(), true);
    }

    async getTemplatesSetting(name: any, device: any, screen: any, widget: any): Promise<void> {
        this.adapter.log.debug("NAME: " + name);
        const map = await this.adapter.templateManager.getTemplateSettings(name);
        this.sendMSG(new GetTemplateSettingPack(device ? map["devices"]: null, screen ? map["screens"]: null, widget ? map["widgets"] : null).toJSON(), true);

    }


    toString(): string {
        return this.req.socket.address + ":" + this.req.socket.remotePort
    }

}




