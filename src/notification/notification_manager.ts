import { SamartHomeHandyBis } from "../main";
import { Events, StateChangeEvent } from "../listener/listener";

import {NotificationPack } from "../server/datapacks";
import { Client } from "../server/client";

export class NotificationManager {
    adapter: SamartHomeHandyBis;
    backlog: { [deviceID: string]: string[] } = {};
    constructor(adapter: SamartHomeHandyBis) {
        this.adapter = adapter;
        this.init();
    }

    private init(): void {
        this.adapter.listener.on(Events.StateChange, this.onStateChange.bind(this));
    }

    private async onStateChange(event: StateChangeEvent) : Promise<void> {
        const match: RegExpMatchArray | null = event.objectID.match("(hiob.\\d*.devices.)(.*)(.sendNotification)");
        if (match && match[2] && !event.ack) {
            const deviceID = match[2];
            const client = this.adapter.server?.getClient(deviceID);
            //Check if client is connected
            this.sendNotificationLocal(client, deviceID, event.value);
            this.adapter.setState(event.objectID, { ack: true });
        }
    }

    public async sendNotificationLocal(client: Client | undefined, deviceID: string, notification: string): Promise<void> {
        if (client != undefined && client?.isConnected) {
            client.sendMSG(new NotificationPack(false, notification, new Date()).toJSON(), true);
        } else {
            //Store to backlog
            const currentBacklogState = await this.adapter.getStateAsync("devices." + deviceID + ".notificationBacklog");
            if(currentBacklogState) {
                let currentBacklogRaw = currentBacklogState.val;
                if(currentBacklogRaw != undefined && currentBacklogRaw === "") {
                    currentBacklogRaw = "[]";
                }
                const currentBacklogArray : any[] = JSON.parse(currentBacklogRaw as string);
                currentBacklogArray.push(notification);
                if(currentBacklogArray.length > 250) {
                    currentBacklogArray.shift();
                }
                await this.adapter.setStateAsync("devices." + deviceID + ".notificationBacklog", JSON.stringify(currentBacklogArray));
            }
        }
    }

    public async sendBacklog(client : Client) : Promise<void> {
        if(client) {
            if(client.isConnected) {
                const currentBacklogState = await this.adapter.getStateAsync("devices." + client.id + ".notificationBacklog");
                if(currentBacklogState) {
                    let currentBacklogRaw = currentBacklogState.val;
                    if(currentBacklogRaw != undefined && currentBacklogRaw === "") {
                        currentBacklogRaw = "[]";
                    }
                    const currentBacklogArray : any[] = JSON.parse(currentBacklogRaw as string);
                    for(const i of currentBacklogArray) {
                        client.sendMSG(new NotificationPack(false, i, new Date()).toJSON(), true);
                    }
                    await this.adapter.setStateAsync("devices." + client.id + ".notificationBacklog", JSON.stringify([]));
                }
            }
        }
    }
}