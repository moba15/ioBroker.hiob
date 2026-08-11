import * as dotenv from 'dotenv';
dotenv.config();

// Use environment variables if they exist, otherwise fallback to production defaults
export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://chvazplrvwsvznegekqy.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_3dW4LAbXNar4lLW8iyOLKQ_fucrNUi-';
