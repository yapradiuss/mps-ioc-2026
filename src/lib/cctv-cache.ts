/**
 * CCTV Snapshot Cache Utility
 * Stores CCTV snapshots in localStorage with expiration and size management
 */

const CACHE_PREFIX = 'cctv_snapshot_';
const CACHE_METADATA_KEY = 'cctv_cache_metadata';
const MAX_CACHE_AGE = 10 * 60 * 1000; // 10 minutes (same as refresh interval)
const MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB limit (localStorage is usually 5-10MB)
const MAX_ENTRIES = 50; // Maximum number of cached snapshots

interface CacheEntry {
  image: string; // Base64 image data
  timestamp: number;
  deviceId: string;
}

interface CacheMetadata {
  entries: Record<string, number>; // deviceId -> timestamp
  totalSize: number;
}

/**
 * Get cache metadata
 */
const getCacheMetadata = (): CacheMetadata => {
  if (typeof window === 'undefined') {
    return { entries: {}, totalSize: 0 };
  }

  try {
    const metadataStr = localStorage.getItem(CACHE_METADATA_KEY);
    if (metadataStr) {
      return JSON.parse(metadataStr);
    }
  } catch (e) {
    // Ignore parse errors
  }

  return { entries: {}, totalSize: 0 };
};

/**
 * Update cache metadata
 */
const updateCacheMetadata = (metadata: CacheMetadata): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
  } catch (e) {
    // Ignore quota errors for metadata
  }
};

/**
 * Calculate approximate size of a string in bytes
 */
const getStringSize = (str: string): number => {
  // Base64 images: each character is 1 byte, but base64 encoding increases size by ~33%
  // Rough estimate: length * 0.75 for base64 strings
  return str.length * 0.75;
};

/**
 * Get cached snapshot for a device
 */
export const getCachedSnapshot = (deviceId: string): { image: string; timestamp: number } | null => {
  if (typeof window === 'undefined') return null;

  try {
    const cacheKey = `${CACHE_PREFIX}${deviceId}`;
    const cachedStr = localStorage.getItem(cacheKey);
    
    if (!cachedStr) return null;

    const entry: CacheEntry = JSON.parse(cachedStr);
    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache is expired
    if (age > MAX_CACHE_AGE) {
      // Remove expired entry
      localStorage.removeItem(cacheKey);
      const metadata = getCacheMetadata();
      delete metadata.entries[deviceId];
      metadata.totalSize -= getStringSize(entry.image);
      updateCacheMetadata(metadata);
      return null;
    }

    return {
      image: entry.image,
      timestamp: entry.timestamp,
    };
  } catch (e) {
    // If there's an error, remove the corrupted entry
    try {
      const cacheKey = `${CACHE_PREFIX}${deviceId}`;
      localStorage.removeItem(cacheKey);
    } catch {
      // Ignore
    }
    return null;
  }
};

/**
 * Store snapshot in cache
 */
export const setCachedSnapshot = (deviceId: string, image: string): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const imageSize = getStringSize(image);
    const entry: CacheEntry = {
      image,
      timestamp: Date.now(),
      deviceId,
    };

    const cacheKey = `${CACHE_PREFIX}${deviceId}`;
    const entrySize = JSON.stringify(entry).length * 0.75; // Approximate size

    // Get current metadata
    let metadata = getCacheMetadata();

    // Check if we need to evict old entries
    if (metadata.totalSize + entrySize > MAX_CACHE_SIZE || Object.keys(metadata.entries).length >= MAX_ENTRIES) {
      evictOldEntries(metadata, entrySize);
      metadata = getCacheMetadata(); // Refresh after eviction
    }

    // Remove old entry if exists (to update)
    if (metadata.entries[deviceId]) {
      const oldEntryStr = localStorage.getItem(cacheKey);
      if (oldEntryStr) {
        const oldEntry: CacheEntry = JSON.parse(oldEntryStr);
        metadata.totalSize -= getStringSize(oldEntry.image);
      }
    }

    // Store new entry
    localStorage.setItem(cacheKey, JSON.stringify(entry));
    metadata.entries[deviceId] = entry.timestamp;
    metadata.totalSize += entrySize;
    updateCacheMetadata(metadata);

    return true;
  } catch (e: any) {
    // Handle quota exceeded error
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      // Try to free up space by evicting oldest entries
      const metadata = getCacheMetadata();
      evictOldEntries(metadata, getStringSize(image));
      
      // Try again
      try {
        const entry: CacheEntry = {
          image,
          timestamp: Date.now(),
          deviceId,
        };
        const cacheKey = `${CACHE_PREFIX}${deviceId}`;
        localStorage.setItem(cacheKey, JSON.stringify(entry));
        
        metadata.entries[deviceId] = entry.timestamp;
        metadata.totalSize += getStringSize(image);
        updateCacheMetadata(metadata);
        return true;
      } catch {
        // Still failed, give up
        return false;
      }
    }
    return false;
  }
};

/**
 * Evict old entries to make space
 */
const evictOldEntries = (metadata: CacheMetadata, neededSize: number): void => {
  if (typeof window === 'undefined') return;

  // Sort entries by timestamp (oldest first)
  const sortedEntries = Object.entries(metadata.entries)
    .sort(([, timestampA], [, timestampB]) => timestampA - timestampB);

  // Remove oldest entries until we have enough space
  let freedSize = 0;
  for (const [deviceId] of sortedEntries) {
    if (metadata.totalSize - freedSize + neededSize <= MAX_CACHE_SIZE * 0.8) {
      break; // Enough space freed
    }

    try {
      const cacheKey = `${CACHE_PREFIX}${deviceId}`;
      const entryStr = localStorage.getItem(cacheKey);
      if (entryStr) {
        const entry: CacheEntry = JSON.parse(entryStr);
        freedSize += getStringSize(entry.image);
        localStorage.removeItem(cacheKey);
        delete metadata.entries[deviceId];
      }
    } catch {
      // Ignore errors
    }
  }

  metadata.totalSize -= freedSize;
  updateCacheMetadata(metadata);
};

/**
 * Clear all cached snapshots
 */
export const clearCache = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const metadata = getCacheMetadata();
    for (const deviceId of Object.keys(metadata.entries)) {
      const cacheKey = `${CACHE_PREFIX}${deviceId}`;
      localStorage.removeItem(cacheKey);
    }
    localStorage.removeItem(CACHE_METADATA_KEY);
  } catch {
    // Ignore errors
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = (): { count: number; size: number; maxSize: number } => {
  if (typeof window === 'undefined') {
    return { count: 0, size: 0, maxSize: MAX_CACHE_SIZE };
  }

  const metadata = getCacheMetadata();
  return {
    count: Object.keys(metadata.entries).length,
    size: metadata.totalSize,
    maxSize: MAX_CACHE_SIZE,
  };
};

/**
 * Check if cache is stale for a device
 */
export const isCacheStale = (deviceId: string): boolean => {
  const cached = getCachedSnapshot(deviceId);
  if (!cached) return true;

  const age = Date.now() - cached.timestamp;
  return age > MAX_CACHE_AGE;
};
