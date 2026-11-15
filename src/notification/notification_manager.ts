import type { SamartHomeHandyBis } from '../main';
import { Events, type StateChangeEvent } from '../listener/listener';

import { NotificationPack } from '../server/datapacks';
import type { Client } from '../server/client';
import { sendNotificationViaSupabase } from '../server/services/notifications-service';

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

    private async onStateChange(event: StateChangeEvent): Promise<void> {
        if (event.ack) {
            return;
        }

        const escapedNamespace = this.adapter.namespace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const notificationStateMatch = event.objectID.match(
            new RegExp(`^${escapedNamespace}\\.devices.([^.]+).(sendNotification|notification)$`),
        );

        if (!notificationStateMatch || !notificationStateMatch[1]) {
            return;
        }

        const deviceID = notificationStateMatch[1];
        const sent = await sendNotificationViaSupabase(this.adapter, deviceID, event.value);

        if (sent) {
            await this.adapter.setStateAsync(event.objectID, event.value, true);
            this.adapter.log.info(`Notification state ${event.objectID} sent via Supabase for device ${deviceID}`);
        }
    }

    public async sendNotificationLocal(
        client: Client | undefined,
        deviceID: string,
        notification: string,
    ): Promise<void> {
        if (client != undefined && client?.isConnected) {
            client.sendMSG(new NotificationPack(false, notification, new Date()).toJSON(), true, true, true);
        } else {
            //Store to backlog
            const currentBacklogState = await this.adapter.getStateAsync(`devices.${deviceID}.notificationBacklog`);
            if (currentBacklogState) {
                let currentBacklogRaw = currentBacklogState.val;
                if (currentBacklogRaw != undefined && currentBacklogRaw === '') {
                    currentBacklogRaw = '[]';
                }
                const currentBacklogArray: any[] = JSON.parse(currentBacklogRaw as string);
                currentBacklogArray.push(notification);
                if (currentBacklogArray.length > 250) {
                    currentBacklogArray.shift();
                }
                await this.adapter.setStateAsync(
                    `devices.${deviceID}.notificationBacklog`,
                    JSON.stringify(currentBacklogArray),
                    true,
                );
            }
        }
    }

    public async sendBacklog(client: Client): Promise<void> {
        if (client) {
            if (client.isConnected) {
                const currentBacklogState = await this.adapter.getStateAsync(
                    `devices.${client.id}.notificationBacklog`,
                );
                if (currentBacklogState) {
                    let currentBacklogRaw = currentBacklogState.val;
                    if (currentBacklogRaw != undefined && currentBacklogRaw === '') {
                        currentBacklogRaw = '[]';
                    }
                    const currentBacklogArray: any[] = JSON.parse(currentBacklogRaw as string);
                    for (const i of currentBacklogArray) {
                        client.sendMSG(new NotificationPack(false, i, new Date()).toJSON(), true);
                    }
                    await this.adapter.setStateAsync(
                        `devices.${client.id}.notificationBacklog`,
                        JSON.stringify([]),
                        true,
                    );
                }
            }
        }
    }
}
