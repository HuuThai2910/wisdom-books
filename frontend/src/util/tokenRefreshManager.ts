import Cookies from "js-cookie";
import { refreshAccessToken } from "../api/auth";
import { isTokenExpiringSoon, getTimeUntilExpiry } from "./jwtUtils";

class TokenRefreshManager {
    private refreshTimer: NodeJS.Timeout | null = null;
    private isRefreshing = false;
    private readonly REFRESH_THRESHOLD_SECONDS = 120; // 2 minutes before expiry
    
    /**
     * Start monitoring token expiry and auto-refresh
     */
    public startMonitoring(): void {
        console.log('[TokenRefreshManager] Starting token monitoring');
        
        // Stop any existing timer
        this.stopMonitoring();
        
        // Schedule next refresh check
        this.scheduleNextCheck();
    }
    
    /**
     * Stop monitoring token expiry
     */
    public stopMonitoring(): void {
        if (this.refreshTimer) {
            console.log('[TokenRefreshManager] Stopping token monitoring');
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        this.isRefreshing = false;
    }
    
    /**
     * Schedule the next token expiry check
     */
    private scheduleNextCheck(): void {
        const token = Cookies.get('id_token');
        
        if (!token) {
            console.log('[TokenRefreshManager] No token found, stopping monitoring');
            return;
        }
        
        const timeUntilExpiry = getTimeUntilExpiry(token);
        const thresholdMs = this.REFRESH_THRESHOLD_SECONDS * 1000;
        
        // Calculate when to check next
        let checkInterval: number;
        
        if (timeUntilExpiry <= thresholdMs && timeUntilExpiry > 0) {
            // Token is expiring soon, refresh now
            console.log('[TokenRefreshManager] Token expiring soon, refreshing immediately');
            this.refreshToken();
            return;
        } else if (timeUntilExpiry > thresholdMs) {
            // Schedule check for when token will be at threshold
            checkInterval = timeUntilExpiry - thresholdMs;
            console.log(`[TokenRefreshManager] Token valid, checking again in ${Math.round(checkInterval / 1000)}s`);
        } else {
            // Token expired, stop monitoring
            console.log('[TokenRefreshManager] Token expired, stopping monitoring');
            return;
        }
        
        // Schedule next check
        this.refreshTimer = setTimeout(() => {
            this.scheduleNextCheck();
        }, checkInterval);
    }
    
    /**
     * Refresh the access token
     */
    private async refreshToken(): Promise<void> {
        if (this.isRefreshing) {
            console.log('[TokenRefreshManager] Already refreshing, skipping');
            return;
        }
        
        try {
            this.isRefreshing = true;
            
            // Get refresh token from cookie and username from localStorage
            const refreshToken = Cookies.get('refresh_token');
            const username = localStorage.getItem('username');
            
            if (!refreshToken || !username) {
                console.error('[TokenRefreshManager] Missing refresh token or username');
                this.handleRefreshFailure();
                return;
            }
            
            console.log('[TokenRefreshManager] Refreshing access token...');
            
            // Call refresh API (cookies are sent automatically)
            const response = await refreshAccessToken({ refreshToken, username });
            
            if (response.data.success && response.data.data) {
                console.log('[TokenRefreshManager] Token refreshed successfully');
                
                // Cookies (id_token and refresh_token) are automatically set by backend
                this.scheduleNextCheck();
            } else {
                console.error('[TokenRefreshManager] Refresh failed:', response.data);
                this.handleRefreshFailure();
            }
        } catch (error) {
            console.error('[TokenRefreshManager] Error refreshing token:', error);
            this.handleRefreshFailure();
        } finally {
            this.isRefreshing = false;
        }
    }
    
    /**
     * Handle refresh failure - clear tokens and redirect to login
     */
    private handleRefreshFailure(): void {
        console.log('[TokenRefreshManager] Handling refresh failure, clearing tokens');
        
        // Stop monitoring
        this.stopMonitoring();
        
        // Clear all auth data
        localStorage.removeItem('username');
        localStorage.removeItem('user');
        Cookies.remove('id_token');
        Cookies.remove('refresh_token');
        
        // Redirect to login if on protected route
        const currentPath = window.location.pathname;
        const isProtectedRoute = 
            currentPath.startsWith('/admin') || 
            currentPath.startsWith('/staff') || 
            currentPath.startsWith('/warehouse');
        
        if (isProtectedRoute) {
            console.log('[TokenRefreshManager] Redirecting to login');
            window.location.href = '/signin';
        }
    }
    
    /**
     * Manually trigger token refresh (for immediate use after login)
     */
    public async refreshNow(): Promise<boolean> {
        const token = Cookies.get('id_token');
        
        if (!token) {
            return false;
        }
        
        // Check if token needs refresh
        if (isTokenExpiringSoon(token, this.REFRESH_THRESHOLD_SECONDS)) {
            await this.refreshToken();
            return true;
        }
        
        return false;
    }
}

// Export singleton instance
export const tokenRefreshManager = new TokenRefreshManager();
