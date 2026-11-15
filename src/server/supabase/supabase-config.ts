import type { SamartHomeHandyBis } from '../../main';

export function getSupabaseUrl(adapter: SamartHomeHandyBis): string {
    return adapter.config.supabaseUrl || 'https://chvazplrvwsvznegekqy.supabase.co';
}

export function getSupabaseAnonKey(adapter: SamartHomeHandyBis): string {
    return adapter.config.supabaseAnonKey || 'sb_publishable_3dW4LAbXNar4lLW8iyOLKQ_fucrNUi-';
}
