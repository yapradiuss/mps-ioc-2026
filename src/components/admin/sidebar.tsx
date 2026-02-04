"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MpsepangLogo from "@/../public/Logo_mpsepang.png";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Menu,
  Radio,
  Camera,
  Map,
  FileText,
  Newspaper,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { hasPageAccess, getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/lib/audit-logger";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    pagePath: "/admin",
  },
  {
    title: "IOC Dashboard",
    href: "/ioc-dashboard",
    icon: Radio,
    external: true,
    pagePath: "/ioc-dashboard",
  },
  {
    title: "Live CCTV Feed",
    href: "/admin/live-cctv-feed",
    icon: Camera,
    pagePath: "/admin/live-cctv-feed",
  },
  {
    title: "Live Traffic Map",
    href: "/live-traffic-map",
    icon: Map,
    external: true,
    pagePath: "/live-traffic-map",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    pagePath: "/admin/users",
  },
  {
    title: "Audit Trail",
    href: "/admin/audit-trail",
    icon: FileText,
    pagePath: "/admin/audit-trail",
  },
  {
    title: "News Ticker",
    href: "/admin/news-ticker",
    icon: Newspaper,
    pagePath: "/admin/news-ticker",
  },
];

import { API_BASE_URL } from "@/lib/api";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on mount and when pathname changes
    const interval = setInterval(() => {
      setUser(getCurrentUser());
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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

  // Filter sidebar items based on user permissions
  const filteredItems = sidebarItems.filter((item) => {
    // If no user, show nothing (will redirect to login)
    if (!user) return false;
    
    // Admin role has access to all pages
    if (user.role === 'admin') return true;
    
    // Check if user has access to this page
    return hasPageAccess(item.pagePath);
  });

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <div className="mb-4 px-4 flex items-center justify-center">
              <Image
                src={MpsepangLogo}
                alt="MPSepang Logo"
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight text-center">
              MPSepang Admin
            </h2>
            <div className="space-y-1">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isExternal = 'external' in item && item.external;
                
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-muted font-medium"
                    )}
                    asChild
                  >
                    <Link 
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <ScrollArea className="h-full">
          <Sidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

