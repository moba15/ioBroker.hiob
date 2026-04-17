import type { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type { SamartHomeHandyBis } from '../../main';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../supabase/supabase-config';

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

    adapter.log.debug(`User for notification service created successfully with uuid ${uuid}`);
    return uuid;
}
