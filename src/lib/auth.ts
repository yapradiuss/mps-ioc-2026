/**
 * Authentication and Permission Utilities
 */

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: string;
  status: string;
  pages?: string[];
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Error parsing user data:', e);
  }
  
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return !!(user && token);
}

/**
 * Check if user has access to a specific page
 */
export function hasPageAccess(pagePath: string): boolean {
  const user = getCurrentUser();
  
  if (!user) return false;
  
  // Superadmin (role: admin) has access to all pages
  if (user.role === 'admin') {
    return true;
  }
  
  // Check if user has the page in their permissions
  if (user.pages && Array.isArray(user.pages)) {
    return user.pages.includes(pagePath);
  }
  
  return false;
}

/**
 * Get user's accessible pages
 */
export function getUserPages(): string[] {
  const user = getCurrentUser();
  return user?.pages || [];
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

