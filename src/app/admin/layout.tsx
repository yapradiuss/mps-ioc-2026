"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { BreadcrumbNav } from "@/components/admin/breadcrumb-nav";
import { RouteTracker } from "@/components/admin/route-tracker";
import { PermissionGuard } from "@/components/admin/permission-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <RouteTracker />
      <PermissionGuard requiredPage={pathname}>
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 border-r bg-muted/40">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="border-b px-6 py-3 bg-muted/20">
              <BreadcrumbNav />
            </div>
            <main className="flex-1 p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </PermissionGuard>
    </>
  );
}

