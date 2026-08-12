// Shared types for Supabase Edge Functions

// ----------------------------------------------------------------------------
// Function: registerNewUser
// ----------------------------------------------------------------------------
export interface RegisterNewUserRequest {
    password?: string;
}

export interface RegisterNewUserResponse {
    message?: string;
    user?: {
        id: string;
        email?: string;
        [key: string]: any;
    };
    error?: string;
}

// ----------------------------------------------------------------------------
// Function: send-notification
// ----------------------------------------------------------------------------
export interface SendNotificationRequest {
    user_id: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
}

export interface SendNotificationResponse {
    message?: string;
    error?: string;
}
