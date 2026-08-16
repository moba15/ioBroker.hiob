import type * as m from '../..//main';
import type * as grpc from '@grpc/grpc-js';
import * as proto from '../../generated/notification/notification';
import { checkAuthentication } from './authenticator/authenticator';

export function addNotificationServices(gRpcServer: grpc.Server, adapter: m.SamartHomeHandyBis): void {
    gRpcServer.addService(proto.UnimplementedNotificationServiceService.definition, {
        fetchNotifications: async (
            call: grpc.ServerUnaryCall<proto.FetchNotificationsRequest, proto.FetchNotificationsResponse>,
            callback: grpc.sendUnaryData<proto.FetchNotificationsResponse>,
        ) => {
            try {
                const authStatus = await checkAuthentication(call.metadata, adapter);
                if (authStatus.code !== 0) {
                    callback({ code: authStatus.code, message: authStatus.details ?? 'Unauthenticated' }, null);
                    return;
                }

                const request: proto.FetchNotificationsRequest = call.request;
                const deviceId = request.deviceId;

                if (!deviceId) {
                    callback({ code: 3, message: 'Missing deviceId' }, null);
                    return;
                }

                const notificationQueueStateId = `devices.${deviceId}.notification_queue`;
                const stateObj = await adapter.getStateAsync(notificationQueueStateId);

                let currentQueue: proto.NotificationContent[] = [];
                if (stateObj && stateObj.val) {
                    try {
                        let parsed: any[];
                        if (typeof stateObj.val === 'string') {
                            parsed = JSON.parse(stateObj.val);
                        } else if (Array.isArray(stateObj.val)) {
                            parsed = stateObj.val;
                        } else {
                            parsed = [];
                        }

                        if (Array.isArray(parsed)) {
                            currentQueue = parsed.map(item =>
                                proto.NotificationContent.fromObject({
                                    id: item.id || '',
                                    title: item.title || '',
                                    body: item.body || '',
                                    ts: item.ts || 0,
                                }),
                            );
                        }
                    } catch (e: any) {
                        adapter.log.warn(`Could not parse notification_queue for ${deviceId}: ${e}`);
                    }
                }

                callback(null, proto.FetchNotificationsResponse.fromObject({ notifications: currentQueue }));
            } catch (e) {
                callback({ code: 13, message: e instanceof Error ? e.message : String(e) }, null);
            }
        },

        ackNotifications: async (
            call: grpc.ServerUnaryCall<proto.AckNotificationsRequest, proto.AckNotificationsResponse>,
            callback: grpc.sendUnaryData<proto.AckNotificationsResponse>,
        ) => {
            try {
                const authStatus = await checkAuthentication(call.metadata, adapter);
                if (authStatus.code !== 0) {
                    callback({ code: authStatus.code, message: authStatus.details ?? 'Unauthenticated' }, null);
                    return;
                }

                const request: proto.AckNotificationsRequest = call.request;
                const deviceId = request.deviceId;
                const ackIds = request.notificationIds || [];

                if (!deviceId) {
                    callback({ code: 3, message: 'Missing deviceId' }, null);
                    return;
                }

                if (ackIds.length > 0) {
                    const notificationQueueStateId = `devices.${deviceId}.notification_queue`;
                    const stateObj = await adapter.getStateAsync(notificationQueueStateId);

                    if (stateObj && stateObj.val) {
                        try {
                            let parsed: any[] = [];
                            if (typeof stateObj.val === 'string') {
                                parsed = JSON.parse(stateObj.val);
                            } else if (Array.isArray(stateObj.val)) {
                                parsed = stateObj.val;
                            }

                            if (Array.isArray(parsed)) {
                                const newQueue = parsed.filter(item => !ackIds.includes(item.id));
                                await adapter.setStateAsync(notificationQueueStateId, JSON.stringify(newQueue), true);
                            }
                        } catch (e: any) {
                            adapter.log.warn(`Could not parse/update notification_queue for ${deviceId}: ${e}`);
                            callback({ code: 13, message: e instanceof Error ? e.message : String(e) }, null);
                        }
                    }
                }

                callback(null, proto.AckNotificationsResponse.fromObject({ success: true }));
            } catch (e) {
                callback({ code: 13, message: e instanceof Error ? e.message : String(e) }, null);
            }
        },
    });
}
