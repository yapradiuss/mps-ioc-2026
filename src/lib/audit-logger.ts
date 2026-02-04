/**
 * Optimized Audit Logger Utility
 * Logs user activities to the backend audit trail API with batching and caching
 */

import { API_BASE_URL } from "./api";

export type ActionType = 
  | "CREATE" 
  | "UPDATE" 
  | "DELETE" 
  | "VIEW" 
  | "LOGIN" 
  | "LOGOUT" 
  | "PERMISSION_CHANGE"
  | "SETTINGS_CHANGE";

export type ActionCategory = "USER" | "SYSTEM" | "SECURITY" | "DATA";

export interface AuditLogData {
  user_id?: string;
  user_name?: string;
  user_email?: string;
  action: ActionType;
  category: ActionCategory;
  resource?: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  status?: "SUCCESS" | "FAILED";
  metadata?: Record<string, any>;
}

// Cache for user info to avoid repeated localStorage reads
let cachedUser: { id: string; name: string; email: string } | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute cache

// Cache for client IP
let cachedClientIp: string | null = null;
let ipCacheTimestamp = 0;
const IP_CACHE_TTL = 300000; // 5 minutes cache for IP

// Queue for batching logs
const logQueue: AuditLogData[] = [];
let flushTimer: NodeJS.Timeout | null = null;
const BATCH_SIZE = 10;
const BATCH_DELAY = 2000; // 2 seconds

/**
 * Get current user info from cache or localStorage
 */
const getCurrentUser = (): { id: string; name: string; email: string } | null => {
  if (typeof window === 'undefined') return null;
  
  const now = Date.now();
  
  // Return cached user if still valid
  if (cachedUser && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedUser;
  }
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      cachedUser = {
        id: user.id || 'anonymous',
        name: user.full_name || user.username || 'Anonymous User',
        email: user.email || 'anonymous@example.com',
      };
      cacheTimestamp = now;
      return cachedUser;
    }
  } catch (e) {
    // Ignore parse errors
  }
  
  cachedUser = {
    id: 'anonymous',
    name: 'Anonymous User',
    email: 'anonymous@example.com',
  };
  cacheTimestamp = now;
  return cachedUser;
};

/**
 * Fetch public IP address from ipify service
 * Falls back to local detection if service is unavailable
 */
const fetchPublicIp = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  const now = Date.now();
  
  // Return cached IP if still valid
  if (cachedClientIp && (now - ipCacheTimestamp) < IP_CACHE_TTL) {
    return cachedClientIp;
  }
  
  try {
    // Try to get public IP from ipify (fast and reliable)
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.ip) {
        cachedClientIp = data.ip;
        ipCacheTimestamp = now;
        return data.ip;
      }
    }
  } catch (error) {
    // Silently fail - will use backend IP detection
  }
  
  // Fallback: try alternative services
  try {
    const response = await fetch('https://ipinfo.io/json', {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.ip) {
        cachedClientIp = data.ip;
        ipCacheTimestamp = now;
        return data.ip;
      }
    }
  } catch (error) {
    // Silently fail
  }
  
  return null;
};

// Cache user agent (doesn't change during session)
let cachedUserAgent = '';

/**
 * Get client info (cached)
 */
const getClientInfo = (): { ip: string | null; userAgent: string } => {
  if (typeof window === 'undefined') {
    return { ip: null, userAgent: '' };
  }
  if (!cachedUserAgent) {
    cachedUserAgent = navigator.userAgent;
  }
  return {
    ip: cachedClientIp,
    userAgent: cachedUserAgent,
  };
};

// Fetch IP on module load (non-blocking)
if (typeof window !== 'undefined') {
  fetchPublicIp().catch(() => {});
}

/**
 * Flush queued logs to the server
 */
const flushLogQueue = async (): Promise<void> => {
  if (logQueue.length === 0) return;
  
  const logsToSend = logQueue.splice(0, BATCH_SIZE);
  
  try {
    await fetch(`${API_BASE_URL}/api/audit-trail/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logs: logsToSend }),
      keepalive: true, // Keep request alive even if page unloads
    }).catch(() => {
      // If batch endpoint doesn't exist, send individually
      logsToSend.forEach((log) => {
        fetch(`${API_BASE_URL}/api/audit-trail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(log),
          keepalive: true,
        }).catch(() => {
          // Silently fail
        });
      });
    });
  } catch (error) {
    // Silently fail - don't interrupt user experience
  }
  
  // If there are more logs in queue, schedule another flush
  if (logQueue.length > 0) {
    scheduleFlush();
  }
};

/**
 * Schedule a flush of the log queue
 */
const scheduleFlush = (): void => {
  if (flushTimer) return;
  
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushLogQueue();
  }, BATCH_DELAY);
};

/**
 * Log an activity to the audit trail (optimized with batching)
 */
export const logActivity = async (data: AuditLogData): Promise<void> => {
  try {
    const user = getCurrentUser();
    let clientInfo = getClientInfo();
    
    // Fetch IP if not cached (for critical logs, wait for it)
    if (!clientInfo.ip && (data.category === 'SECURITY' || data.action === 'LOGIN' || data.action === 'LOGOUT')) {
      const ip = await fetchPublicIp();
      if (ip) {
        clientInfo = { ...clientInfo, ip };
      }
    }
    
    const logData: AuditLogData = {
      ...data,
      user_id: data.user_id || user?.id,
      user_name: data.user_name || user?.name,
      user_email: data.user_email || user?.email,
      ip_address: data.ip_address || clientInfo.ip || undefined,
      user_agent: data.user_agent || clientInfo.userAgent,
      status: data.status || 'SUCCESS',
    };

    // For critical logs (SECURITY category), send immediately
    if (data.category === 'SECURITY' || data.action === 'LOGIN' || data.action === 'LOGOUT') {
      fetch(`${API_BASE_URL}/api/audit-trail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
        keepalive: true,
      }).catch(() => {
        // Silently fail
      });
      return;
    }

    // For non-critical logs, add to queue for batching
    logQueue.push(logData);
    
    // If queue is full, flush immediately
    if (logQueue.length >= BATCH_SIZE) {
      flushLogQueue();
    } else {
      // Otherwise schedule a delayed flush
      scheduleFlush();
    }
  } catch (error) {
    // Silently fail
  }
};

/**
 * Log a page view (non-blocking, low priority)
 */
export const logPageView = (pagePath: string, pageTitle?: string): void => {
  // Use requestIdleCallback if available for non-critical logs
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      logActivity({
        action: 'VIEW',
        category: 'DATA',
        resource: pagePath,
        description: `Viewed page: ${pageTitle || pagePath}`,
      });
    }, { timeout: 5000 });
  } else {
    // Fallback to immediate logging
    logActivity({
      action: 'VIEW',
      category: 'DATA',
      resource: pagePath,
      description: `Viewed page: ${pageTitle || pagePath}`,
    });
  }
};

/**
 * Log a user action
 */
export const logUserAction = (
  action: ActionType,
  category: ActionCategory,
  resource: string,
  description: string,
  metadata?: Record<string, any>
): void => {
  logActivity({
    action,
    category,
    resource,
    description,
    metadata,
  });
};

/**
 * Force flush all pending logs (useful before page unload)
 */
export const flushPendingLogs = (): void => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  flushLogQueue();
};

// Flush logs before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushPendingLogs);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushPendingLogs();
    }
  });
}
