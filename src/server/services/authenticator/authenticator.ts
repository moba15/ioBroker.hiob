import * as grpc from '@grpc/grpc-js';
import * as bcrypt from 'bcrypt';
import type { SamartHomeHandyBis } from '../../../main';

export type AuthResult = {
    code: grpc.status;
    details?: string;
    name: string;
    deviceId?: string;
};

/**
 * Validates the `token` (device key) and `deviceId` metadata sent with every gRPC call.
 *
 * The app sends the raw device key as `token` and the device ID as `deviceId` in
 * gRPC call metadata (see connection_manager.dart `_registerOtherServices`).
 * This function verifies the key against the bcrypt hash stored in the ioBroker
 * state `devices.{deviceId}.key`.
 *
 * Results are cached per device so bcrypt.compare is not called on every single RPC.
 */

// Cache of validated tokens to avoid repeated bcrypt comparisons on every call.
// Maps "deviceId:token" → timestamp of last successful validation.
const validatedTokenCache = new Map<string, number>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function checkAuthentication(metadata: grpc.Metadata, adapter: SamartHomeHandyBis): Promise<AuthResult> {
    const tokenValues = metadata.get('token');
    const idValues = metadata.get('deviceId');

    if (!idValues || idValues.length !== 1 || !tokenValues || tokenValues.length !== 1) {
        return {
            code: grpc.status.UNAUTHENTICATED,
            details: 'Missing required metadata: token and deviceId',
            name: 'Not authenticated',
        };
    }

    const deviceId = idValues[0].toString();
    const token = tokenValues[0].toString();

    if (!deviceId || !token) {
        return {
            code: grpc.status.UNAUTHENTICATED,
            details: 'Empty token or deviceId',
            name: 'Not authenticated',
        };
    }

    // Check the cache first to avoid bcrypt on every call
    const cacheKey = `${deviceId}:${token}`;
    const cachedAt = validatedTokenCache.get(cacheKey);
    if (cachedAt && Date.now() - cachedAt < CACHE_TTL_MS) {
        return { code: grpc.status.OK, name: '', deviceId };
    }

    // Verify the device is approved
    const approvedState = await adapter.getStateAsync(`devices.${deviceId}.approved`);
    if (!approvedState || !approvedState.val) {
        return {
            code: grpc.status.PERMISSION_DENIED,
            details: `Device ${deviceId} is not approved`,
            name: 'Not approved',
        };
    }

    // Verify the token (key) against the stored bcrypt hash
    const keyState = await adapter.getStateAsync(`devices.${deviceId}.key`);
    if (!keyState || !keyState.val) {
        return {
            code: grpc.status.UNAUTHENTICATED,
            details: `No key found for device ${deviceId}`,
            name: 'No key',
        };
    }

    try {
        const isValid = await bcrypt.compare(token, keyState.val.toString());
        if (!isValid) {
            return {
                code: grpc.status.UNAUTHENTICATED,
                details: 'Invalid token',
                name: 'Wrong key',
            };
        }
    } catch (e) {
        adapter.log.warn(`Auth error for device ${deviceId}: ${e instanceof Error ? e.message : String(e)}`);
        return {
            code: grpc.status.INTERNAL,
            details: 'Authentication check failed',
            name: 'Internal error',
        };
    }

    // Cache the successful validation
    validatedTokenCache.set(cacheKey, Date.now());

    return { code: grpc.status.OK, name: '', deviceId };
}

/**
 * Removes expired entries from the token cache.
 * Call this periodically or on adapter unload to prevent memory leaks.
 */
export function cleanupTokenCache(): void {
    const now = Date.now();
    for (const [key, timestamp] of validatedTokenCache) {
        if (now - timestamp >= CACHE_TTL_MS) {
            validatedTokenCache.delete(key);
        }
    }
}

/**
 * Invalidates all cached tokens for a specific device.
 * Call this when a device's key is rotated or the device is unapproved.
 *
 * @param deviceId
 */
export function invalidateDeviceTokens(deviceId: string): void {
    for (const key of validatedTokenCache.keys()) {
        if (key.startsWith(`${deviceId}:`)) {
            validatedTokenCache.delete(key);
        }
    }
}
