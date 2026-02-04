/**
 * News ticker storage in browser localStorage (no DB/API).
 * Used by admin news-ticker page (CRUD) and IOC dashboard (read active items).
 */

const STORAGE_KEY = "news_ticker_items";

export interface NewsTickerItem {
  id: number;
  title: string;
  content: string;
  status: string;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  created_by_name?: string;
}

function safeParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function getNewsTickerItems(): NewsTickerItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const list = safeParse<NewsTickerItem[]>(raw, []);
  return Array.isArray(list) ? list : [];
}

export function setNewsTickerItems(items: NewsTickerItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/** Get items that are active and within date range (for display on IOC dashboard). */
export function getActiveNewsTickerItems(): NewsTickerItem[] {
  const items = getNewsTickerItems();
  const now = new Date();
  return items
    .filter((item) => {
      if (item.status !== "active") return false;
      if (item.start_date && new Date(item.start_date) > now) return false;
      if (item.end_date && new Date(item.end_date) < now) return false;
      return true;
    })
    .sort((a, b) => (b.priority !== a.priority ? b.priority - a.priority : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
}
