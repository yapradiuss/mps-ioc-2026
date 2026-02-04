"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileSidebar } from "./sidebar";
import { Badge } from "@/components/ui/badge";
import { logActivity } from "@/lib/audit-logger";
import { getCurrentUser, type User as UserType } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Function to update user from localStorage
  const updateUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  // Function to fetch user from API
  const fetchUserFromAPI = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || token === 'authenticated') {
        updateUser(); // Fallback to localStorage
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          // Dispatch event to notify other components
          window.dispatchEvent(new Event('userUpdated'));
        } else {
          updateUser(); // Fallback to localStorage
        }
      } else {
        updateUser(); // Fallback to localStorage
      }
    } catch (error) {
      console.error('Error fetching user from API:', error);
      updateUser(); // Fallback to localStorage
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Get user from localStorage on mount
    updateUser();
    
    // Also try to fetch fresh user data from API
    fetchUserFromAPI();

    // Listen for storage changes (when user logs in/out or data is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === null) {
        updateUser();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      updateUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleCustomStorageChange);

    // Also check periodically (in case localStorage is updated directly)
    const interval = setInterval(() => {
      updateUser();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleCustomStorageChange);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout API
      if (token && token !== 'authenticated') {
        try {
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API error:', error);
        }
      }

      // Log logout activity
      if (user) {
        logActivity({
          action: 'LOGOUT',
          category: 'SECURITY',
          resource: 'Authentication',
          description: `User logged out: ${user.username || user.email}`,
          status: 'SUCCESS',
        });
      }

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Clear authentication cookie
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear storage and redirect even if there's an error
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Clear authentication cookie
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      router.push('/login');
    }
  };

  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!user) return '??';
    
    if (user.full_name) {
      const parts = user.full_name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return user.full_name.substring(0, 2).toUpperCase();
    }
    
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    
    return '??';
  };

  // Get user display name
  const getUserDisplayName = (): string => {
    if (!user) return 'Guest';
    return user.full_name || user.username || 'User';
  };

  // Get user email
  const getUserEmail = (): string => {
    if (!user) return '';
    return user.email || '';
  };

  // Get user role badge
  const getUserRole = (): string => {
    if (!user) return '';
    return user.role || 'user';
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <MobileSidebar />
        
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {isMounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/admin.png" alt={getUserDisplayName()} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {getUserEmail()}
                  </p>
                  {getUserRole() && (
                    <Badge 
                      variant={getUserRole() === 'admin' ? 'default' : 'secondary'} 
                      className="w-fit mt-1 text-xs"
                    >
                      {getUserRole().toUpperCase()}
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/admin.png" alt="User" />
                <AvatarFallback>??</AvatarFallback>
              </Avatar>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

