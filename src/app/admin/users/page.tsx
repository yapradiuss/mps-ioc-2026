"use client";

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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal, UserPlus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { logPageView } from "@/lib/audit-logger";

interface Page {
  id: number;
  page_path: string;
  page_name: string;
  page_group: string;
  description?: string;
  icon?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  created_by_name?: string;
  page_count?: number;
  pages?: Page[];
}

// Dummy pages (no API)
const DUMMY_PAGES: Page[] = [
  { id: 1, page_path: "/admin", page_name: "Dashboard", page_group: "Admin", description: "Admin home" },
  { id: 2, page_path: "/admin/users", page_name: "User Management", page_group: "Admin", description: "Manage users" },
  { id: 3, page_path: "/admin/audit-trail", page_name: "Audit Trail", page_group: "Admin", description: "Activity logs" },
  { id: 4, page_path: "/admin/news-ticker", page_name: "News Ticker", page_group: "Admin", description: "News items" },
  { id: 5, page_path: "/admin/live-cctv-feed", page_name: "Live CCTV Feed", page_group: "Admin", description: "CCTV cameras" },
];

// Dummy users (no API)
const now = new Date().toISOString();
const DUMMY_USERS_INITIAL: User[] = [
  {
    id: 1,
    username: "superadmin",
    email: "superadmin@mpsepang.gov.my",
    full_name: "Super Administrator",
    role: "admin",
    status: "active",
    created_at: now,
    updated_at: now,
    page_count: 5,
    pages: [...DUMMY_PAGES],
  },
  {
    id: 2,
    username: "manager1",
    email: "manager@mpsepang.gov.my",
    full_name: "Manager One",
    role: "manager",
    status: "active",
    created_at: now,
    updated_at: now,
    page_count: 3,
    pages: [DUMMY_PAGES[0], DUMMY_PAGES[1], DUMMY_PAGES[3]],
  },
  {
    id: 3,
    username: "operator1",
    email: "operator@mpsepang.gov.my",
    full_name: "Operator One",
    role: "user",
    status: "active",
    created_at: now,
    updated_at: now,
    page_count: 2,
    pages: [DUMMY_PAGES[0], DUMMY_PAGES[4]],
  },
];

interface UserFormData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  status: string;
  page_ids: number[];
}

// Helper to get initials
const getInitials = (name?: string, username?: string): string => {
  if (name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (username) {
    return username.substring(0, 2).toUpperCase();
  }
  return '??';
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(() => [...DUMMY_USERS_INITIAL]);
  const [pages] = useState<Page[]>(DUMMY_PAGES);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    password: "",
    full_name: "",
    role: "user",
    status: "active",
    page_ids: [],
  });
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  useEffect(() => {
    logPageView("/admin/users", "User Management");
  }, []);

  // Filter users client-side (no API)
  const filteredUsers = useMemo(() => {
    let list = users;
    const q = searchQuery.toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.full_name?.toLowerCase().includes(q))
      );
    }
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all") list = list.filter((u) => u.status === statusFilter);
    return list;
  }, [users, searchQuery, roleFilter, statusFilter]);

  const loadUserIntoForm = (user: User) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      full_name: user.full_name || "",
      role: user.role,
      status: user.status,
      page_ids: user.pages?.map((p) => p.id) || [],
    });
    setSelectedPages(user.pages?.map((p) => p.id) || []);
  };

  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      role: 'user',
      status: 'active',
      page_ids: [],
    });
    setSelectedPages([]);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setIsEditMode(true);
      setEditingUserId(userId);
      loadUserIntoForm(user);
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      role: 'user',
      status: 'active',
      page_ids: [],
    });
    setSelectedPages([]);
  };

  const handleTogglePage = (pageId: number) => {
    setSelectedPages(prev => 
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const userPages = pages.filter((p) => selectedPages.includes(p.id));
    const updatedAt = new Date().toISOString();

    if (isEditMode && editingUserId !== null) {
      const existing = users.find((u) => u.id === editingUserId);
      if (existing && formData.email !== existing.email && users.some((u) => u.id !== editingUserId && u.email === formData.email)) {
        setError("Email already in use.");
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                username: formData.username,
                email: formData.email,
                full_name: formData.full_name || undefined,
                role: formData.role,
                status: formData.status,
                updated_at: updatedAt,
                pages: userPages,
                page_count: userPages.length,
              }
            : u
        )
      );
    } else {
      if (users.some((u) => u.email === formData.email || u.username === formData.username)) {
        setError("Username or email already in use.");
        return;
      }
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers((prev) => [
        ...prev,
        {
          id: newId,
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name || undefined,
          role: formData.role,
          status: formData.status,
          created_at: updatedAt,
          updated_at: updatedAt,
          pages: userPages,
          page_count: userPages.length,
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleDelete = (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setError(null);
  };

  // Group pages by page_group
  const groupedPages = pages.reduce((acc, page) => {
    const group = page.page_group || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(page);
    return acc;
  }, {} as Record<string, Page[]>);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their page access permissions.
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">Admin accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.managers}</div>
            <p className="text-xs text-muted-foreground">Manager accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>A list of all users in your system</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              {error}
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(user.full_name, user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.full_name || user.username}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "default"
                            : user.role === "manager"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={
                          user.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {user.page_count || 0} pages
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update user information and page permissions.'
                : 'Create a new user account and assign page access permissions.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password {isEditMode && '(leave empty to keep current)'}
                    {!isEditMode && ' *'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!isEditMode}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Page Permissions */}
              <div className="space-y-2">
                <Label>Page Access Permissions</Label>
                <Card>
                  <CardContent className="pt-4">
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {Object.entries(groupedPages).map(([group, groupPages]) => (
                          <div key={group}>
                            <div className="font-semibold text-sm mb-2 text-muted-foreground">
                              {group}
                            </div>
                            <div className="space-y-2 pl-4">
                              {groupPages.map((page) => (
                                <div key={page.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`page-${page.id}`}
                                    checked={selectedPages.includes(page.id)}
                                    onCheckedChange={() => handleTogglePage(page.id)}
                                  />
                                  <Label
                                    htmlFor={`page-${page.id}`}
                                    className="text-sm font-normal cursor-pointer flex-1"
                                  >
                                    {page.page_name}
                                    {page.description && (
                                      <span className="text-muted-foreground ml-2">
                                        - {page.description}
                                      </span>
                                    )}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">
                  Select which pages this user can access. {selectedPages.length} page(s) selected.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
