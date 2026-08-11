import type { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type { SamartHomeHandyBis } from '../../main';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../supabase/supabase-config';

type NotificationContent = {
    title: string;
    body: string;
    data?: Record<string, unknown>;
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
                    title,
                    body,
                    data: {
                        ...parsedNotification,
                        sourceStateId,
                    },
                };
            }
        } catch {
            // Not JSON, treat as plain text below.
        }

        return {
            title: 'Notification',
            body: trimmedContent,
            data: {
                sourceStateId,
            },
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
            title,
            body,
            data: {
                ...notification,
                sourceStateId,
            },
        };
    }

    const fallbackBody = String(content).trim();
    if (!fallbackBody) {
        return null;
    }

    return {
        title: 'Notification',
        body: fallbackBody,
        data: {
            sourceStateId,
        },
    };
}

export async function createUserForNotificationService(
    adapter: SamartHomeHandyBis,
    password: string,
): Promise<string | null> {
    adapter.log.debug('Creating user for notification service');

    if (!SUPABASE_ANON_KEY) {
        adapter.log.error('Failed to create user for notification service: missing SUPABASE_ANON_KEY');
        return null;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.functions.invoke<{ user?: User }>('registerNewUser', {
        // Pass an object directly. Supabase handles JSON.stringify automatically.
        body: { password },
    });

    if (error) {
        adapter.log.error(`Failed to create user for notification service: ${error.message}`);
        return null;
    }

    const uuid = data?.user?.id;
    if (!uuid) {
        adapter.log.error('Failed to create user for notification service: no uuid returned by function');
        return null;
    }

    adapter.log.debug(`User for notification service created successfully with uuid ${uuid} and ${password}`);
    return uuid;
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

    const notification = normalizeNotificationContent(content, sourceStateId);
    if (!notification) {
        adapter.log.warn(`Cannot send notification for ${sourceStateId}: empty payload`);
        return false;
    }

    if (!SUPABASE_ANON_KEY) {
        adapter.log.error('Failed to send notification: missing SUPABASE_ANON_KEY');
        return false;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { error, data } = await supabase.functions.invoke('send-notification', {
        body: {
            user_id: userUUID,
            title: notification.title,
            body: notification.body,
            data: notification.data,
        },
    });

    if (error) {
        let errorMessage = error.message;

        // The Supabase client attaches the raw Response to error.context
        // for any non-2xx status code. We can await .json() to read our custom payload.
        if (error.context && typeof error.context.json === 'function') {
            try {
                const responseBody = await error.context.json();
                
                // This targets the { error: "..." } structure we built in the Edge Function
                if (responseBody && responseBody.error) {
                    errorMessage = responseBody.error; 
                }
            } catch (e) {
                // Failsafe in case the body wasn't JSON or was already consumed
                adapter.log.debug(`Failed to parse Edge Function error context: ${e instanceof Error ? e.message : String(e)}`);
            }
        }

        // Now this will log: "Failed to send notification... Server Configuration Error: FIREBASE_PROJECT_ID is not set"
        adapter.log.error(`Failed to send notification for ${sourceStateId}: ${errorMessage}`);
        return false;
    }

    adapter.log.debug(
        `Notification for ${sourceStateId} sent successfully via Supabase${data ? `: ${JSON.stringify(data)}` : ''}`,
    );
    return true;
}
