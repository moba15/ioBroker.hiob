import { createClient } from '@supabase/supabase-js';
import type { SamartHomeHandyBis } from '../../main';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../supabase/supabase-config';
import type { RegisterNewUserRequest, RegisterNewUserResponse } from '../supabase/types';

export async function createSupabaseUser(adapter: SamartHomeHandyBis, password: string): Promise<string | null> {
    adapter.log.debug('Creating user in Supabase');

    if (!SUPABASE_ANON_KEY) {
        adapter.log.error('Failed to create user in Supabase: missing SUPABASE_ANON_KEY');
        return null;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.functions.invoke<RegisterNewUserResponse>('registerNewUser', {
        // Pass an object directly. Supabase handles JSON.stringify automatically.
        body: { password } satisfies RegisterNewUserRequest,
    });

    if (error) {
        let errorMessage = error.message;

        if (error.context && typeof error.context.json === 'function') {
            try {
                const responseBody = await error.context.json();
                if (responseBody && responseBody.error) {
                    errorMessage = responseBody.error;
                }
            } catch (e) {
                adapter.log.debug(
                    `Failed to parse Edge Function error context: ${e instanceof Error ? e.message : String(e)}`,
                );
            }
        }

        adapter.log.error(`Failed to create user in Supabase: ${errorMessage}`);
        return null;
    }

    const uuid = data?.user?.id;
    if (!uuid) {
        adapter.log.error('Failed to create user in Supabase: no uuid returned by function');
        return null;
    }

    adapter.log.debug(`User created successfully in Supabase with uuid ${uuid}`);
    return uuid;
}

export async function loginSupabaseUser(
    adapter: SamartHomeHandyBis,
    userUuid: string,
    password: string,
): Promise<string> {
    adapter.log.debug(`Attempting to log into Supabase for user ${userUuid}`);

    if (!SUPABASE_ANON_KEY) {
        adapter.log.error('Failed to login to Supabase: missing SUPABASE_ANON_KEY');
        return 'Error: Missing Configuration';
    }

    if (!userUuid || !password) {
        return 'Logged out';
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.auth.signInWithPassword({
        email: `${userUuid.trim()}@hiob-app.local`,
        password: password.trim(),
    });

    if (error) {
        adapter.log.error(`Supabase login failed: ${error.message}`);
        return `Error: ${error.message}`;
    }

    if (data.session) {
        adapter.log.debug('Successfully logged into Supabase');
        return 'Logged in';
    }

    return 'Logged out';
}

export async function logoutSupabaseUser(adapter: SamartHomeHandyBis): Promise<void> {
    adapter.log.debug('Attempting to log out from Supabase');

    if (!SUPABASE_ANON_KEY) {
        return;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { error } = await supabase.auth.signOut();

    if (error) {
        adapter.log.error(`Supabase logout failed: ${error.message}`);
    } else {
        adapter.log.debug('Successfully logged out from Supabase');
    }
}
