"use client";

import { PermissionGuard } from "@/components/admin/permission-guard";

export default function IOCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard requiredPage="/ioc-dashboard">
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </PermissionGuard>
  );
}

