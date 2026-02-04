"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { logActivity } from "@/lib/audit-logger";
import { isAuthenticated } from "@/lib/auth";
import type { User } from "@/lib/auth";

// Hardcoded login (no API). Change in production to use real auth.
const HARDCODED_EMAIL = "superadmin@mpsepang.gov.my";
const HARDCODED_PASSWORD = "123456";
const HARDCODED_USER: User = {
  id: 1,
  username: "superadmin",
  email: HARDCODED_EMAIL,
  full_name: "Super Administrator",
  role: "admin",
  status: "active",
  pages: ["/admin", "/admin/users", "/admin/audit-trail", "/admin/news-ticker", "/admin/live-cctv-feed"],
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication once on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const redirectTo = searchParams.get('redirect') || '/admin';
      router.replace(redirectTo);
    }
  }, [router, searchParams]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Hardcoded login (no API)
      if (email.trim().toLowerCase() !== HARDCODED_EMAIL.toLowerCase() || password !== HARDCODED_PASSWORD) {
        setError('Invalid email or password.');
        if (email) {
          logActivity({
            action: 'LOGIN',
            category: 'SECURITY',
            resource: 'Authentication',
            description: `Failed login attempt: ${email}`,
            status: 'FAILED',
          });
        }
        return;
      }

      const token = 'authenticated';
      localStorage.setItem('user', JSON.stringify(HARDCODED_USER));
      localStorage.setItem('token', token);
      document.cookie = `auth_token=${token}; path=/; max-age=${604800}; SameSite=Lax`;

      window.dispatchEvent(new Event('userUpdated'));

      logActivity({
        action: 'LOGIN',
        category: 'SECURITY',
        resource: 'Authentication',
        description: `User logged in: ${HARDCODED_USER.email}`,
        status: 'SUCCESS',
      });

      router.push(searchParams.get('redirect') || '/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to login.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, isLoading, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat bg-[url('/MPsepang_a.jpg.png')]">
      <div className="absolute inset-0 bg-black/40" />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/Logo_mpsepang.png"
              alt="MPSepang Logo"
              width={120}
              height={120}
              className="object-contain"
              priority
              loading="eager"
            />
          </div>
          <CardTitle className="text-3xl font-bold">MPSepang Admin</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoFocus
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

