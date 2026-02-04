/**
 * IOC Dashboard Preferences Storage
 * Handles saving and loading user preferences for map filters and widget positions
 */

export interface MapFilterPreference {
  id: string;
  enabled: boolean;
}

export interface WidgetPreference {
  id: string;
  enabled: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface IOCPreferences {
  mapFilters: MapFilterPreference[];
  widgets: WidgetPreference[];
  userId?: string;
  lastUpdated?: string;
}

import { API_BASE_URL } from "./api";

const PREFERENCES_KEY = 'ioc_dashboard_preferences';

/**
 * Get current user ID from localStorage
 */
function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || user.username || null;
    }
  } catch (e) {
    console.error('Error parsing user data:', e);
  }
  
  return null;
}

/**
 * Load preferences from localStorage
 */
export function loadPreferences(): IOCPreferences | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userId = getUserId();
    // Try both user-specific and default preferences
    const userIdsToTry = userId ? [userId, 'default'] : ['default'];
    
    let loadedPreferences: IOCPreferences | null = null;
    
    for (const id of userIdsToTry) {
      const stored = localStorage.getItem(`${PREFERENCES_KEY}_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[IOC Preferences] Loaded preferences for user:', id, parsed);
        loadedPreferences = parsed;
        break;
      }
    }
    
    // Always merge weather widget position from 'default' if it exists
    // This ensures weather position persists across logouts
    if (loadedPreferences) {
      const defaultStored = localStorage.getItem(`${PREFERENCES_KEY}_default`);
      if (defaultStored) {
        try {
          const defaultParsed = JSON.parse(defaultStored);
          const defaultWeatherWidget = defaultParsed.widgets?.find((w: WidgetPreference) => w.id === 'weather');
          if (defaultWeatherWidget && defaultWeatherWidget.position) {
            // Merge weather widget from default preferences
            const weatherWidgetIndex = loadedPreferences.widgets.findIndex(w => w.id === 'weather');
            if (weatherWidgetIndex >= 0) {
              loadedPreferences.widgets[weatherWidgetIndex] = {
                ...loadedPreferences.widgets[weatherWidgetIndex],
                position: defaultWeatherWidget.position,
                size: defaultWeatherWidget.size || loadedPreferences.widgets[weatherWidgetIndex].size,
              };
            } else {
              loadedPreferences.widgets.push({
                id: 'weather',
                enabled: true,
                position: defaultWeatherWidget.position,
                size: defaultWeatherWidget.size,
              });
            }
            console.log('[IOC Preferences] Merged weather widget position from default preferences');
          }
        } catch (e) {
          console.error('Error merging default weather preferences:', e);
        }
      }
    }
    
    return loadedPreferences;
  } catch (e) {
    console.error('Error loading preferences:', e);
  }
  
  return null;
}

/**
 * Save preferences to localStorage
 */
export function savePreferences(preferences: IOCPreferences): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const userId = getUserId();
    // Use 'default' as userId if no user is found (for guest/anonymous users)
    const effectiveUserId = userId || 'default';
    
    const preferencesToSave: IOCPreferences = {
      ...preferences,
      userId: effectiveUserId,
      lastUpdated: new Date().toISOString(),
    };
    
    const storageKey = `${PREFERENCES_KEY}_${effectiveUserId}`;
    localStorage.setItem(storageKey, JSON.stringify(preferencesToSave));
    
    // Also save weather widget position to 'default' so it persists across logouts
    const weatherWidget = preferences.widgets.find(w => w.id === 'weather');
    if (weatherWidget && weatherWidget.position) {
      const defaultPreferences = loadPreferences() || getDefaultPreferences();
      const defaultWeatherWidget = defaultPreferences.widgets.find(w => w.id === 'weather');
      if (defaultWeatherWidget) {
        defaultWeatherWidget.position = weatherWidget.position;
        defaultWeatherWidget.size = weatherWidget.size;
      } else {
        defaultPreferences.widgets.push({
          id: 'weather',
          enabled: true,
          position: weatherWidget.position,
          size: weatherWidget.size,
        });
      }
      const defaultStorageKey = `${PREFERENCES_KEY}_default`;
      localStorage.setItem(defaultStorageKey, JSON.stringify({
        ...defaultPreferences,
        userId: 'default',
        lastUpdated: new Date().toISOString(),
      }));
    }
    
    console.log('[IOC Preferences] Saved preferences:', preferencesToSave);
    return true;
  } catch (e) {
    console.error('Error saving preferences:', e);
    return false;
  }
}

/**
 * Save preferences to backend API (future implementation)
 */
export async function savePreferencesToAPI(preferences: IOCPreferences): Promise<boolean> {
  try {
    const token = localStorage.getItem('token');
    if (!token || token === 'authenticated') {
      return false;
    }
    
    const userId = getUserId();
    if (!userId) {
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/ioc-preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        preferences,
      }),
    });
    
    if (response.ok) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error saving preferences to API:', error);
    return false;
  }
}

/**
 * Load preferences from backend API (future implementation)
 */
export async function loadPreferencesFromAPI(): Promise<IOCPreferences | null> {
  try {
    const token = localStorage.getItem('token');
    if (!token || token === 'authenticated') {
      return null;
    }
    
    const userId = getUserId();
    if (!userId) {
      return null;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/ioc-preferences/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.preferences) {
        return data.preferences;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error loading preferences from API:', error);
    return null;
  }
}

/**
 * Get default preferences
 */
export function getDefaultPreferences(): IOCPreferences {
  return {
    mapFilters: [],
    widgets: [],
  };
}

