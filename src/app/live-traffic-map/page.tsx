"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Activity, 
  Eye,
  LayoutDashboard,
  ExternalLink,
  Map,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, type User as UserType } from "@/lib/auth";
import { logActivity } from "@/lib/audit-logger";
import { API_BASE_URL } from "@/lib/api";

export default function LiveTrafficMapPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get user from localStorage
  useEffect(() => {
    const updateUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    updateUser();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === null) {
        updateUser();
      }
    };

    const handleCustomStorageChange = () => {
      updateUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleCustomStorageChange);

    const interval = setInterval(() => {
      updateUser();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!user) return 'LM';
    
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
    
    return 'LM';
  };

  // Get user display name
  const getUserDisplayName = (): string => {
    if (!user) return 'Traffic Monitor';
    return user.full_name || user.username || 'Traffic Monitor';
  };

  // Get user email
  const getUserEmail = (): string => {
    if (!user) return 'monitor@mpsepang.com';
    return user.email || 'monitor@mpsepang.com';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
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
          console.error('Logout API error:', error);
        }
      }

      if (user) {
        logActivity({
          action: 'LOGOUT',
          category: 'SECURITY',
          resource: 'Authentication',
          description: `User logged out: ${user.username || user.email}`,
          status: 'SUCCESS',
        });
      }

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Clear authentication cookie
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Clear authentication cookie
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
      router.push('/login');
    }
  };

  // Waze Live Map URL - Sepang area (Malaysia)
  // Coordinates for Sepang, Selangor, Malaysia
  const wazeLat = 2.6913;
  const wazeLon = 101.6969;
  const wazeZoom = 12;
  const wazeEmbedUrl = `https://embed.waze.com/iframe?zoom=${wazeZoom}&lat=${wazeLat}&lon=${wazeLon}`;
  const wazeLiveMapUrl = `https://www.waze.com/live-map/directions?navigate=yes&latlng=${wazeLat},${wazeLon}`;

  const handleOpenInNewTab = () => {
    window.open(wazeLiveMapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Full-Screen IOC Header - Glass Effect - Floating Above Map */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-background/5 backdrop-blur-2xl border-b border-white/3 shadow-lg">
        <div className="grid grid-cols-3 h-16 items-center px-6">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 flex items-center justify-center">
              <img 
                src="/Logo_mpsepang.png" 
                alt="MPSepang Logo" 
                className="h-full w-full object-contain"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
            <div>
              <h1 className="text-xl text-black font-bold flex items-center gap-2">
                Live Traffic Map
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                  <Activity className="h-3 w-3 animate-pulse text-green-500" />
                  <span className="text-xs">Live</span>
                </Badge>
              </h1>
              <p className="text-xs text-black text-muted-foreground">Real-Time Traffic Monitoring - Waze Live Map</p>
            </div>
          </div>

          {/* Center Section - Time (Perfectly Centered) */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl text-black font-bold tabular-nums" suppressHydrationWarning>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div className="text-xs text-black text-muted-foreground" suppressHydrationWarning>
              {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/admin.png" alt={getUserDisplayName()} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-[110]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {getUserEmail()}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Admin Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/ioc-dashboard')}>
                  <Map className="mr-2 h-4 w-4" />
                  <span>IOC Dashboard</span>
                </DropdownMenuItem>
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
          </div>
        </div>
      </header>

      {/* Waze Live Map - Full Screen */}
      <div className="absolute inset-0 top-16 bottom-0 left-0 right-0 z-0 w-full h-[calc(100vh-4rem)]">
        {/* Waze Embed Iframe */}
        <iframe
          src={wazeEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Waze Live Traffic Map"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

