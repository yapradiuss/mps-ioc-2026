"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { hasPageAccess, isAuthenticated } from "@/lib/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPage?: string;
}

/**
 * Permission Guard Component
 * Protects pages by checking if user has access
 */
export function PermissionGuard({ children, requiredPage }: PermissionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pagePath = requiredPage || pathname;
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check authentication first
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);

    if (!authenticated) {
      router.push('/login');
      return;
    }

    // Check page access
    const access = hasPageAccess(pagePath);
    setHasAccess(access);
    setIsChecking(false);
  }, [router, pagePath]);

  // During SSR and initial client render, show loading or children
  // This prevents hydration mismatch
  if (typeof window === 'undefined' || isChecking) {
    // Show children during SSR and initial load to prevent hydration mismatch
    // The permission check will happen in useEffect
    return <>{children}</>;
  }

  // If not authenticated, return null (redirect will happen in useEffect)
  if (!isAuth) {
    return null;
  }

  // If user doesn't have access, show access denied
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Alert className="max-w-md" variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You don't have permission to access this page. Please contact your administrator
            to request access.
          </AlertDescription>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
            >
              Go to Dashboard
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

