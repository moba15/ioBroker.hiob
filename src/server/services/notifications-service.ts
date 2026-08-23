import { getAuthenticatedSupabaseClient } from './supabase-service';
import type { SamartHomeHandyBis } from '../../main';
import { getSupabaseAnonKey } from '../supabase/supabase-config';
import type { SendNotificationRequest, SendNotificationResponse } from '../supabase/types';
import { randomUUID } from 'node:crypto';
import * as proto from '../../generated/notification/notification';

// We use a strict type and parsing function here because the generated `proto.NotificationContent.fromObject`
// does not perform runtime type checking or validation of required fields. This safeguard prevents
// improperly formatted user data from causing unexpected crashes during protobuf serialization.
type StrictNotificationContentPayload = {
    id: string;
    title: string;
    body: string;
    ts: number;
    group: boolean;
    data: string[];
    groupKey?: string;
    locked?: boolean;
};

function parseStrictNotificationContentPayload(content: unknown): StrictNotificationContentPayload | null {
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
        return null;
    }

    const raw = content as Record<string, unknown>;

    if (typeof raw.id !== 'string' || !raw.id.trim()) {
        return null;
    }

    if (typeof raw.title !== 'string' || !raw.title.trim()) {
        return null;
    }

    if (typeof raw.body !== 'string' || !raw.body.trim()) {
        return null;
    }

    if (typeof raw.ts !== 'number' || !Number.isFinite(raw.ts) || raw.ts <= 0) {
        return null;
    }

    if (typeof raw.group !== 'boolean') {
        return null;
    }

    if (!Array.isArray(raw.data) || raw.data.some(item => typeof item !== 'string')) {
        return null;
    }


    if (raw.groupKey != null && typeof raw.groupKey !== 'string') {
        return null;
    }

    if (raw.locked != null && typeof raw.locked !== 'boolean') {
        return null;
    }

    return {
        id: raw.id.trim(),
        title: raw.title.trim(),
        body: raw.body.trim(),
        ts: raw.ts,
        group: raw.group,
        data: raw.data,
        groupKey: typeof raw.groupKey === 'string' ? raw.groupKey : undefined,
        locked: typeof raw.locked === 'boolean' ? raw.locked : false,
    };
}

function normalizeNotificationContent(
    content: unknown,
): { notification: proto.NotificationContent | null; error?: string } {
    if (content == null) {
        return { notification: null, error: 'Payload is null or undefined' };
    }

    if (typeof content === 'string') {
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            return { notification: null, error: 'Payload string is empty' };
        }

        return {
            notification: proto.NotificationContent.fromObject({
                id: Math.floor(Math.random() * (2147483647 - 1028) + 1028).toString(),
                title: 'Notification',
                body: trimmedContent,
                ts: Date.now(),
                group: false,
                data: [],
                locked: false,
            }),
        };
    }

    if (typeof content === 'object') {
        const strictPayload = parseStrictNotificationContentPayload(content);
        if (!strictPayload) {
            return {
                notification: null,
                error: 'Object payload does not satisfy NotificationContent',
            };
        }

        return {
            notification: proto.NotificationContent.fromObject(strictPayload),
        };
    }

    return {
        notification: null,
        error: `Unsupported payload type: ${typeof content}`,
    };
}

export async function sendNotificationViaSupabase(
    adapter: SamartHomeHandyBis,
    deviceId: string,
    content: unknown,
): Promise<boolean> {
    const userUUID = adapter.config.userUUID;
    if (!userUUID) {
        adapter.log.warn(`Cannot send notification to device ${deviceId}: missing userUUID in adapter config`);
        return false;
    }

    const { notification, error: normalizationError } = normalizeNotificationContent(content);
    if (!notification) {
        adapter.log.error(
            `Cannot send notification to device ${deviceId}: ${normalizationError ?? 'invalid notification payload'}`,
        );
        return false;
    }

    const anonKey = getSupabaseAnonKey(adapter);

    if (!anonKey) {
        adapter.log.error('Failed to send notification: missing SUPABASE_ANON_KEY');
        return false;
    }

    // Add the notification to notification queue in the adapter's state, so that it can be sent to the device when it is online.
    const MAX_QUEUE_SIZE = 250;
    const notificationQueueStateId = `devices.${deviceId}.notification_queue`;
    const stateObj = await adapter.getStateAsync(notificationQueueStateId);

    let currentQueue: proto.NotificationContent[] = [];
    if (stateObj && stateObj.val) {
        try {
            let parsedQueue: unknown[] = [];
            if (typeof stateObj.val === 'string') {
                const parsed = JSON.parse(stateObj.val);
                if (Array.isArray(parsed)) {
                    parsedQueue = parsed;
                }
            } else if (Array.isArray(stateObj.val)) {
                parsedQueue = stateObj.val;
            }

            if (parsedQueue.length > 0) {
                currentQueue = parsedQueue.map(item => {
                    const raw = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
                    return proto.NotificationContent.fromObject({
                        id: typeof raw.id === 'string' ? raw.id : '',
                        title: typeof raw.title === 'string' ? raw.title : 'Notification',
                        body: typeof raw.body === 'string' ? raw.body : 'Notification',
                        ts: typeof raw.ts === 'number' ? raw.ts : 0,
                        group: typeof raw.group === 'boolean' ? raw.group : false,
                        groupKey: typeof raw.groupKey === 'string' ? raw.groupKey : undefined,
                        locked: typeof raw.locked === 'boolean' ? raw.locked : false,
                        data: Array.isArray(raw.data)
                            ? raw.data.filter((value): value is string => typeof value === 'string')
                            : [],
                    });
                });
            }
        } catch (e: any) {
            adapter.log.warn(`Could not parse notification_queue for ${deviceId}: ${e}`);
        }
    }

    currentQueue.push(notification);

    // Cap the queue to prevent unbounded growth when a device is offline for a long time
    if (currentQueue.length > MAX_QUEUE_SIZE) {
        const dropped = currentQueue.length - MAX_QUEUE_SIZE;
        currentQueue = currentQueue.slice(dropped);
        adapter.log.warn(
            `Notification queue for ${deviceId} exceeded ${MAX_QUEUE_SIZE}, dropped ${dropped} oldest entries`,
        );
    }

    await adapter.setStateAsync(
        notificationQueueStateId,
        JSON.stringify(currentQueue.map(item => item.toObject())),
        true,
    );

    const supabase = getAuthenticatedSupabaseClient();
    if (!supabase) {
        adapter.log.error(
            'Failed to send notification: Supabase client is not authenticated. Is the adapter logged in?',
        );
        return false;
    }

    const { error, data } = await supabase.functions.invoke<SendNotificationResponse>('send-notification', {
        body: {
            user_id: userUUID,
            device_id: deviceId,
        } satisfies SendNotificationRequest,
    });

    if (error) {
        let errorMessage = error.message || String(error);

        // The Supabase client attaches the raw Response to error.context
        // for any non-2xx status code. We can await .text() to read our custom payload.
        if (error.context && typeof error.context.text === 'function') {
            try {
                const textBody = await error.context.text();
                try {
                    const responseBody = JSON.parse(textBody);
                    if (responseBody && responseBody.error) {
                        errorMessage += ` - Details: ${typeof responseBody.error === 'object' ? JSON.stringify(responseBody.error) : responseBody.error}`;
                    } else if (textBody) {
                        errorMessage += ` - Details: ${textBody}`;
                    }
                } catch {
                    if (textBody) {
                        errorMessage += ` - Details: ${textBody}`;
                    }
                }
            } catch (e) {
                // Failsafe in case the body wasn't readable or was already consumed
                adapter.log.debug(
                    `Failed to parse Edge Function error context: ${e instanceof Error ? e.message : String(e)}`,
                );
            }
        }

        if (errorMessage === error.message || errorMessage === String(error)) {
            try {
                const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error));
                if (errorString !== '{}') {
                    errorMessage += ` - Full Error: ${errorString}`;
                }
            } catch {
                // ignore stringify errors
            }
        }

        adapter.log.error(`Failed to send notification to device ${deviceId}: ${errorMessage}`);
        return false;
    }

    adapter.log.debug(
        `Notification to device ${deviceId} sent successfully via Supabase${data ? `: ${JSON.stringify(data)}` : ''}`,
    );
    return true;
}
