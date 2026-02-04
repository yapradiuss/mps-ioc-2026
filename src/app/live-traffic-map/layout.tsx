"use client";

import { PermissionGuard } from "@/components/admin/permission-guard";

export default function LiveTrafficMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard requiredPage="/live-traffic-map">
      <div className="h-screen w-screen overflow-hidden bg-background">
        {children}
      </div>
    </PermissionGuard>
  );
}

