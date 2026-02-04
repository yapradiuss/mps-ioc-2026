"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, FileText, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { logPageView } from "@/lib/audit-logger";

type ActionType = 
  | "CREATE" 
  | "UPDATE" 
  | "DELETE" 
  | "VIEW" 
  | "LOGIN" 
  | "LOGOUT" 
  | "PERMISSION_CHANGE"
  | "SETTINGS_CHANGE";

type ActionCategory = "USER" | "SYSTEM" | "SECURITY" | "DATA";

interface AuditLog {
  id: number;
  timestamp: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  action: ActionType;
  category: ActionCategory;
  resource?: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  status: "SUCCESS" | "FAILED";
  metadata?: any;
}

interface AuditStats {
  total: number;
  success: number;
  failed: number;
  security: number;
}

const categoryColors: Record<ActionCategory, string> = {
  USER: "bg-blue-100 text-blue-800",
  SYSTEM: "bg-orange-100 text-orange-800",
  SECURITY: "bg-red-100 text-red-800",
  DATA: "bg-green-100 text-green-800",
};

// Dummy audit trail data (no API)
const LIMIT = 50;
const DUMMY_AUDIT_LOGS: AuditLog[] = (() => {
  const actions: ActionType[] = ["CREATE", "UPDATE", "DELETE", "VIEW", "LOGIN", "LOGOUT", "PERMISSION_CHANGE", "SETTINGS_CHANGE"];
  const categories: ActionCategory[] = ["USER", "SYSTEM", "SECURITY", "DATA"];
  const users = [
    { name: "Super Administrator", email: "superadmin@mpsepang.gov.my" },
    { name: "Admin User", email: "admin@mpsepang.gov.my" },
    { name: "Operator One", email: "operator1@mpsepang.gov.my" },
    { name: "Operator Two", email: "operator2@mpsepang.gov.my" },
  ];
  const resources = ["Users", "Audit Trail", "News Ticker", "CCTV Feed", "Settings", "Authentication", "Permissions"];
  const descriptions = [
    "User logged in successfully",
    "User logged out",
    "Viewed audit trail page",
    "Updated user permissions",
    "Created new news ticker item",
    "Deleted news ticker entry",
    "Viewed live CCTV feed",
    "Failed login attempt",
    "Settings updated",
    "Page view recorded",
  ];
  const logs: AuditLog[] = [];
  const now = Date.now();
  for (let i = 0; i < 120; i++) {
    const user = users[i % users.length];
    const action = actions[i % actions.length];
    const category = categories[i % categories.length];
    const status: "SUCCESS" | "FAILED" = i % 10 === 7 ? "FAILED" : "SUCCESS";
    logs.push({
      id: i + 1,
      timestamp: new Date(now - i * 60000 * (1 + (i % 5))).toISOString(),
      user_name: user.name,
      user_email: user.email,
      action,
      category,
      resource: resources[i % resources.length],
      description: descriptions[i % descriptions.length],
      ip_address: `192.168.1.${(i % 255)}`,
      status,
      metadata: {},
    });
  }
  return logs;
})();

// Memoized helper functions
const getInitials = (name?: string, email?: string): string => {
  if (name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return '??';
};

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return timestamp;
  }
};

export default function AuditTrailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    logPageView('/admin/audit-trail', 'Audit Trail');
  }, []);

  // Stats from dummy data (no API)
  const stats = useMemo((): AuditStats => {
    const total = DUMMY_AUDIT_LOGS.length;
    const success = DUMMY_AUDIT_LOGS.filter((l) => l.status === "SUCCESS").length;
    const failed = DUMMY_AUDIT_LOGS.filter((l) => l.status === "FAILED").length;
    const security = DUMMY_AUDIT_LOGS.filter((l) => l.category === "SECURITY").length;
    return { total, success, failed, security };
  }, []);

  // Filter dummy data client-side
  const filteredLogs = useMemo(() => {
    let list = [...DUMMY_AUDIT_LOGS];
    const q = debouncedSearchQuery.toLowerCase();
    if (q) {
      list = list.filter(
        (l) =>
          (l.user_name?.toLowerCase().includes(q)) ||
          (l.user_email?.toLowerCase().includes(q)) ||
          (l.resource?.toLowerCase().includes(q)) ||
          (l.description?.toLowerCase().includes(q)) ||
          (l.ip_address?.toLowerCase().includes(q))
      );
    }
    if (actionFilter !== "all") list = list.filter((l) => l.action === actionFilter);
    if (categoryFilter !== "all") list = list.filter((l) => l.category === categoryFilter);
    if (statusFilter !== "all") list = list.filter((l) => l.status === statusFilter);
    return list;
  }, [debouncedSearchQuery, actionFilter, categoryFilter, statusFilter]);

  const totalFiltered = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / LIMIT));
  const page = Math.max(1, Math.min(currentPage, totalPages));
  const paginatedLogs = useMemo(
    () => filteredLogs.slice((page - 1) * LIMIT, page * LIMIT),
    [filteredLogs, page]
  );

  const paginationInfo = useMemo(() => {
    const start = totalFiltered === 0 ? 0 : (page - 1) * LIMIT + 1;
    const end = Math.min(page * LIMIT, totalFiltered);
    return { start, end, total: totalFiltered };
  }, [page, totalFiltered]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, actionFilter, categoryFilter, statusFilter]);

  const tableRows = useMemo(() => {
    return paginatedLogs.map((log) => (
      <TableRow key={log.id}>
        <TableCell className="font-mono text-sm">
          {formatTimestamp(log.timestamp)}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {getInitials(log.user_name, log.user_email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {log.user_name || 'Unknown User'}
              </div>
              <div className="text-sm text-muted-foreground">
                {log.user_email || 'N/A'}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={categoryColors[log.category]}
          >
            {log.category}
          </Badge>
        </TableCell>
        <TableCell className="font-medium">
          {log.resource || 'N/A'}
        </TableCell>
        <TableCell className="max-w-[300px]">
          <div className="truncate" title={log.description}>
            {log.description || 'N/A'}
          </div>
        </TableCell>
        <TableCell className="font-mono text-sm">
          {log.ip_address || 'N/A'}
        </TableCell>
        <TableCell>
          <Badge
            variant={log.status === "SUCCESS" ? "default" : "destructive"}
            className={
              log.status === "SUCCESS"
                ? "bg-green-500"
                : "bg-red-500"
            }
          >
            {log.status}
          </Badge>
        </TableCell>
      </TableRow>
    ));
  }, [paginatedLogs]);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground">
          Track and monitor all system activities and user actions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All audit entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <p className="text-xs text-muted-foreground">Successful actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Failed attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.security}</div>
            <p className="text-xs text-muted-foreground">Security-related actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Complete history of all system activities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="VIEW">View</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="LOGOUT">Logout</SelectItem>
                  <SelectItem value="PERMISSION_CHANGE">Permission Change</SelectItem>
                  <SelectItem value="SETTINGS_CHANGE">Settings Change</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                  <SelectItem value="SECURITY">Security</SelectItem>
                  <SelectItem value="DATA">Data</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length > 0 ? (
                  tableRows
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No audit logs found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalFiltered > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {paginationInfo.start} to {paginationInfo.end} of {paginationInfo.total} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
