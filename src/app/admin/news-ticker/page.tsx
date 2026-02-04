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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Loader2,
  Newspaper,
  Smile,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { logPageView } from "@/lib/audit-logger";
import { getCurrentUser } from "@/lib/auth";
import dynamic from "next/dynamic";

// Dynamically import emoji picker to avoid SSR issues
const EmojiPicker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
);
import {
  getNewsTickerItems,
  setNewsTickerItems,
  type NewsTickerItem,
} from "@/lib/news-ticker-storage";

type NewsTicker = NewsTickerItem;

interface NewsTickerFormData {
  title: string;
  content: string;
  status: string;
  priority: number;
  start_date: string;
  end_date: string;
}

export default function NewsTickerPage() {
  const [newsItems, setNewsItems] = useState<NewsTicker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewsTickerFormData>({
    title: '',
    content: '',
    status: 'active',
    priority: 0,
    start_date: '',
    end_date: '',
  });
  
  // Emoji picker states
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<'title' | 'content' | null>(null);

  // Log page view
  useEffect(() => {
    logPageView('/admin/news-ticker', 'News Ticker Management');
  }, []);

  // Load news ticker from localStorage (no API)
  const loadFromStorage = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const items = getNewsTickerItems();
      const sorted = [...items].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const filtered =
        statusFilter === "all"
          ? sorted
          : sorted.filter((item) => item.status === statusFilter);
      setNewsItems(filtered);
    } catch (err: any) {
      setError(err.message || "Failed to load news ticker items");
      setNewsItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      status: 'active',
      priority: 0,
      start_date: '',
      end_date: '',
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (item: NewsTicker) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      status: item.status,
      priority: item.priority,
      start_date: item.start_date ? item.start_date.slice(0, 16) : '',
      end_date: item.end_date ? item.end_date.slice(0, 16) : '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      title: '',
      content: '',
      status: 'active',
      priority: 0,
      start_date: '',
      end_date: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    const priority = parseInt(formData.priority.toString(), 10) || 0;
    const now = new Date().toISOString();

    try {
      const items = getNewsTickerItems();
      if (isEditMode && editingId !== null) {
        const index = items.findIndex((item) => item.id === editingId);
        if (index >= 0) {
          items[index] = {
            ...items[index],
            title: formData.title,
            content: formData.content,
            status: formData.status,
            priority,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            updated_at: now,
          };
        }
      } else {
        const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
        items.unshift({
          id: newId,
          title: formData.title,
          content: formData.content,
          status: formData.status,
          priority,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          created_at: now,
          updated_at: now,
          created_by_name: user?.full_name || user?.email,
        });
      }
      setNewsTickerItems(items);
      loadFromStorage();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || "Failed to save news ticker item");
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this news ticker item?")) return;
    try {
      const items = getNewsTickerItems().filter((item) => item.id !== id);
      setNewsTickerItems(items);
      loadFromStorage();
    } catch (err: any) {
      setError(err.message || "Failed to delete news ticker item");
    }
  };

  const filteredItems = newsItems.filter((item) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: newsItems.length,
    active: newsItems.filter(item => item.status === 'active').length,
    inactive: newsItems.filter(item => item.status === 'inactive').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Ticker Management</h1>
          <p className="text-muted-foreground">
            Manage news ticker items displayed on the dashboard.
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add News Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All news items</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Items</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.inactive}</div>
                <p className="text-xs text-muted-foreground">Currently inactive</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* News Ticker Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All News Items</CardTitle>
              <CardDescription>A list of all news ticker items</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="max-w-md truncate">{item.content}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "active" ? "default" : "secondary"}
                        className={
                          item.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No news items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit News Ticker Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit News Item' : 'Create New News Item'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update news ticker item information.'
                : 'Create a new news ticker item to display on the dashboard.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Title *</Label>
                  <Popover open={emojiPickerOpen === 'title'} onOpenChange={(open) => setEmojiPickerOpen(open ? 'title' : null)}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEmojiPickerOpen(emojiPickerOpen === 'title' ? null : 'title')}
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          const emoji = emojiData.emoji;
                          const input = document.getElementById('title') as HTMLInputElement;
                          if (input) {
                            const start = input.selectionStart || 0;
                            const end = input.selectionEnd || 0;
                            const text = formData.title;
                            const newText = text.substring(0, start) + emoji + text.substring(end);
                            setFormData({ ...formData, title: newText });
                            setTimeout(() => {
                              input.focus();
                              input.setSelectionRange(start + emoji.length, start + emoji.length);
                            }, 0);
                          }
                          setEmojiPickerOpen(null);
                        }}
                        skinTonesDisabled
                        searchDisabled={false}
                        previewConfig={{ showPreview: false }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter news title (emojis supported 🎉)"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content *</Label>
                  <Popover open={emojiPickerOpen === 'content'} onOpenChange={(open) => setEmojiPickerOpen(open ? 'content' : null)}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEmojiPickerOpen(emojiPickerOpen === 'content' ? null : 'content')}
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          const emoji = emojiData.emoji;
                          const textarea = document.getElementById('content') as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart || 0;
                            const end = textarea.selectionEnd || 0;
                            const text = formData.content;
                            const newText = text.substring(0, start) + emoji + text.substring(end);
                            setFormData({ ...formData, content: newText });
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + emoji.length, start + emoji.length);
                            }, 0);
                          }
                          setEmojiPickerOpen(null);
                        }}
                        skinTonesDisabled
                        searchDisabled={false}
                        previewConfig={{ showPreview: false }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Enter news content (emojis supported 🎉)"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Click the emoji button (😊) to open the emoji picker, or type emojis directly. Emojis will display on the IOC dashboard.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value, 10) || 0 })}
                    min="0"
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">Higher priority items appear first</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Optional: When to start showing</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Optional: When to stop showing</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? 'Update Item' : 'Create Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

