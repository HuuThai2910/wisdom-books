// JWT utility functions

interface JwtPayload {
    exp: number; // Expiration time (Unix timestamp in seconds)
    iat: number; // Issued at time
    sub: string; // Subject (usually username or user id)
    [key: string]: any;
}

/**
 * Decode JWT token and extract payload
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('[jwtUtils] Invalid JWT format');
            return null;
        }
        
        // Decode the payload (second part)
        const payload = parts[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (error) {
        console.error('[jwtUtils] Error decoding JWT:', error);
        return null;
    }
};

/**
 * Get token expiration time in milliseconds
 * @param token JWT token string
 * @returns Expiration timestamp in milliseconds or null if invalid
 */
export const getTokenExpiry = (token: string): number | null => {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) {
        return null;
    }
    // Convert from seconds to milliseconds
    return payload.exp * 1000;
};

/**
 * Check if token is about to expire
 * @param token JWT token string
 * @param thresholdSeconds Threshold in seconds (default: 120 seconds = 2 minutes)
 * @returns True if token will expire within threshold
 */
export const isTokenExpiringSoon = (token: string, thresholdSeconds: number = 120): boolean => {
    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) {
        return false;
    }
    
    const now = Date.now();
    const timeRemaining = expiryTime - now;
    const thresholdMs = thresholdSeconds * 1000;
    
    return timeRemaining > 0 && timeRemaining <= thresholdMs;
};

/**
 * Check if token is expired
 * @param token JWT token string
 * @returns True if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) {
        return true;
    }
    
    return Date.now() >= expiryTime;
};

/**
 * Get time remaining until token expires
 * @param token JWT token string
 * @returns Time remaining in milliseconds, or 0 if expired/invalid
 */
export const getTimeUntilExpiry = (token: string): number => {
    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) {
        return 0;
    }
    
    const timeRemaining = expiryTime - Date.now();
    return Math.max(0, timeRemaining);
};
