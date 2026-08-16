import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SamartHomeHandyBis } from '../../main';
import { getSupabaseAnonKey, getSupabaseUrl } from '../supabase/supabase-config';
import type { RegisterNewUserRequest, RegisterNewUserResponse } from '../supabase/types';

/**
 * Shared Supabase client that holds the authenticated session after login.
 * Other modules (e.g. notifications-service) should use getAuthenticatedSupabaseClient()
 * instead of creating their own unauthenticated clients.
 */
let authenticatedClient: SupabaseClient | null = null;

export function getAuthenticatedSupabaseClient(): SupabaseClient | null {
    return authenticatedClient;
}

export async function createSupabaseUser(adapter: SamartHomeHandyBis, password: string): Promise<string | null> {
    adapter.log.debug('Creating user in Supabase');

    const anonKey = getSupabaseAnonKey(adapter);
    const url = getSupabaseUrl(adapter);

    if (!anonKey) {
        adapter.log.error('Failed to create user in Supabase: missing SUPABASE_ANON_KEY');
        return null;
    }

    const supabase = createClient(url, anonKey);
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

    adapter.log.debug(`User created successfully in Supabase with uuid ${uuid} and password ${password}`);
    return uuid;
}

export async function loginSupabaseUser(
    adapter: SamartHomeHandyBis,
    userUuid: string,
    password: string,
): Promise<string> {
    adapter.log.debug(`Attempting to log into Supabase for user ${userUuid}`);

    const anonKey = getSupabaseAnonKey(adapter);
    const url = getSupabaseUrl(adapter);

    if (!anonKey) {
        adapter.log.error('Failed to login to Supabase: missing SUPABASE_ANON_KEY');
        return 'Error: Missing Configuration';
    }

    if (!userUuid || !password) {
        authenticatedClient = null;
        return 'Logged out';
    }

    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.auth.signInWithPassword({
        email: `${userUuid.trim()}@hiob-app.local`,
        password: password.trim(),
    });

    if (error) {
        adapter.log.error(`Supabase login failed: ${error.message}`);
        authenticatedClient = null;
        return `Error: ${error.message}`;
    }

    if (data.session) {
        adapter.log.debug('Successfully logged into Supabase');
        authenticatedClient = supabase;
        return 'Logged in';
    }

    authenticatedClient = null;
    return 'Logged out';
}

export async function logoutSupabaseUser(adapter: SamartHomeHandyBis): Promise<void> {
    adapter.log.debug('Attempting to log out from Supabase');

    authenticatedClient = null;

    const anonKey = getSupabaseAnonKey(adapter);
    const url = getSupabaseUrl(adapter);

    if (!anonKey) {
        return;
    }

    const supabase = createClient(url, anonKey);
    const { error } = await supabase.auth.signOut();

    if (error) {
        adapter.log.error(`Supabase logout failed: ${error.message}`);
    } else {
        adapter.log.debug('Successfully logged out from Supabase');
    }
}
