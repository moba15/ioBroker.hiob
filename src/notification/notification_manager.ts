import {SamartHomeHandyBis} from "../main";
import {Events, StateChangeEvent} from "../listener/listener";

import {DataPack, NotificationPack} from "../server/datapacks";
import {Client} from "../server/client";

export class NotificationManager {
    adapter: SamartHomeHandyBis;
    backlog: {[deviceID: string] : string[]}= {};
    constructor(adapter: SamartHomeHandyBis) {
        this.adapter = adapter;
        this.init();
    }


    private init() : void {
        this.adapter.listener.on(Events.StateChange, this.onStateChange.bind(this));
    }


    private onStateChange(event: StateChangeEvent) : void {
        const match : RegExpMatchArray | null = event.objectID.match("(hiob.\\d*.devices.)(.*)(.sendNotification)");
        if(match && match[2]) {
            const deviceID = match[2];
            const client = this.adapter.server?.getClient(deviceID);
            //Check if client is connected
            if(client?.isConnected) {
                this.sendNotificationLocal(client, event.value);

            } else {
                //Store to backlog
                if(this.backlog[deviceID]) {
                    this.backlog[deviceID].push(event.value)
                } else {
                    this.backlog[deviceID] = [event.value];
                }
            }




        }
    }


    private sendNotificationLocal(client: Client, notification: string) : void {
        client.sendMSG(new NotificationPack(false, notification, new Date()).toJSON(), true);
    }




}

