import { createClient } from '@supabase/supabase-js';
import type { SamartHomeHandyBis } from '../../main';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../supabase/supabase-config';
import type { SendNotificationRequest, SendNotificationResponse } from '../supabase/types';
import { randomUUID } from 'crypto';

type NotificationContent = {
    id: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    ts: number;
};

function normalizeNotificationContent(content: unknown, sourceStateId: string): NotificationContent | null {
    if (content == null) {
        return null;
    }

    if (typeof content === 'string') {
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            return null;
        }

        try {
            const parsedContent = JSON.parse(trimmedContent);
            if (parsedContent && typeof parsedContent === 'object') {
                const parsedNotification = parsedContent as Record<string, unknown>;
                const title =
                    typeof parsedNotification.title === 'string' && parsedNotification.title.trim()
                        ? parsedNotification.title.trim()
                        : 'Notification';
                const body =
                    typeof parsedNotification.body === 'string' && parsedNotification.body.trim()
                        ? parsedNotification.body.trim()
                        : trimmedContent;

                return {
                    id: randomUUID().toString(),
                    title,
                    body,
                    data: {
                        ...parsedNotification,
                        sourceStateId,
                    },
                    ts: Date.now(),
                };
            }
        } catch {
            // Not JSON, treat as plain text below.
        }

        return {
            id: randomUUID().toString(),
            title: 'Notification',
            body: trimmedContent,
            data: {
                sourceStateId,
            },
            ts: Date.now(),
        };
    }

    if (typeof content === 'object') {
        const notification = content as Record<string, unknown>;
        const title =
            typeof notification.title === 'string' && notification.title.trim()
                ? notification.title.trim()
                : 'Notification';
        const bodyCandidate = notification.body;
        const body =
            typeof bodyCandidate === 'string'
                ? bodyCandidate.trim() || 'Notification'
                : bodyCandidate != null
                  ? String(bodyCandidate)
                  : 'Notification';

        return {
            id: randomUUID().toString(),
            title,
            body,
            data: {
                ...notification,
                sourceStateId,
            },
            ts: Date.now(),
        };
    }

    const fallbackBody = String(content).trim();
    if (!fallbackBody) {
        return null;
    }

    return {
        id: randomUUID().toString(),
        title: 'Notification',
        body: fallbackBody,
        data: {
            sourceStateId,
        },
        ts: Date.now(),
    };
}

export async function sendNotificationViaSupabase(
    adapter: SamartHomeHandyBis,
    sourceStateId: string,
    content: unknown,
): Promise<boolean> {
    const userUUID = adapter.config.userUUID;
    if (!userUUID) {
        adapter.log.warn(`Cannot send notification for ${sourceStateId}: missing userUUID in adapter config`);
        return false;
    }

    // Extract deviceID from sourceStateId, e.g. hiob-dev.0.devices.99a2164f-e607-4af1-bf6a-e29d35ca5931.notification
    const deviceIdMatch = sourceStateId.match(/\.devices\.([^.]+)\./);
    const deviceId = deviceIdMatch ? deviceIdMatch[1] : null;

    if (!deviceId) {
        adapter.log.warn(`Cannot extract device_id from ${sourceStateId}`);
        return false;
    }

    const notification = normalizeNotificationContent(content, sourceStateId);
    if (!notification) {
        adapter.log.warn(`Cannot send notification for ${sourceStateId}: empty payload`);
        return false;
    }

    if (!SUPABASE_ANON_KEY) {
        adapter.log.error('Failed to send notification: missing SUPABASE_ANON_KEY');
        return false;
    }

    // Add the notification to notification queue in the adapter's state, so that it can be sent to the device when it is online.
    const notificationQueueStateId = `devices.${deviceId}.notification_queue`;
    const stateObj = await adapter.getStateAsync(notificationQueueStateId);

    let currentQueue: NotificationContent[] = [];
    if (stateObj && stateObj.val) {
        try {
            if (typeof stateObj.val === 'string') {
                const parsed = JSON.parse(stateObj.val);
                if (Array.isArray(parsed)) {
                    currentQueue = parsed;
                }
            } else if (Array.isArray(stateObj.val)) {
                currentQueue = stateObj.val as NotificationContent[];
            }
        } catch (e) {
            adapter.log.warn(`Could not parse notification_queue for ${deviceId}: ${e}`);
        }
    }

    currentQueue.push({
        ...notification,
    });

    await adapter.setStateAsync(notificationQueueStateId, JSON.stringify(currentQueue), true);

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
            } catch (e) {
                // ignore stringify errors
            }
        }

        adapter.log.error(`Failed to send notification for ${sourceStateId}: ${errorMessage}`);
        return false;
    }

    adapter.log.debug(
        `Notification for ${sourceStateId} sent successfully via Supabase${data ? `: ${JSON.stringify(data)}` : ''}`,
    );
    return true;
}
