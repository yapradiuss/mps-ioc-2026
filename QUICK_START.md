# 🚀 Quick Start Guide - MPSepang Admin Panel

## Getting Started in 3 Steps

### 1️⃣ Start the Development Server

```bash
npm run dev
```

### 2️⃣ Open Your Browser

Visit: **http://localhost:3000**

You'll see a beautiful landing page with a button to access the admin panel.

### 3️⃣ Explore the Admin Panel

Click **"Go to Dashboard"** or visit: **http://localhost:3000/admin**

---

## 📍 Available Pages

| Page | URL | What You'll Find |
|------|-----|------------------|
| **Landing** | `/` | Welcome page with quick access |
| **Dashboard** | `/admin` | Overview with stats, charts, recent sales |
| **IOC Dashboard** 🆕 | `/ioc-dashboard` | **Opens in new tab** - Real-time operations center |
| **Users** | `/admin/users` | User management table with 8 demo users |
| **Products** | `/admin/products` | Product catalog with 6 demo products |
| **Orders** | `/admin/orders` | Order management with 6 demo orders |
| **Analytics** | `/admin/analytics` | Detailed insights and metrics |
| **Reports** | `/admin/reports` | Report generation and history |
| **Settings** | `/admin/settings` | Account and system preferences |

---

## 🎨 Admin Panel Layout

### Standard Admin Pages (WITH Sidebar)
```
┌─────────────────────────────────────────────────────────┐
│  [MPSepang Admin]  🔍 Search...     🔔  👤             │  ← Header
├──────────────┬──────────────────────────────────────────┤
│              │  Home > Admin > Users                     │  ← Breadcrumbs
│  Dashboard   ├──────────────────────────────────────────┤
│  IOC Dashboard                                          │
│  Users       │                                           │
│  Products    │         Main Content Area                 │
│  Orders      │      (Tables, Cards, Charts)              │
│  Analytics   │                                           │
│  Reports     │                                           │
│  Settings    │                                           │
└──────────────┴───────────────────────────────────────────┘
   Sidebar               Content
```

### IOC Dashboard (Separate Tab - Full Screen)
```
┌──────────────────────────────────────────────────────────┐
│ 📡 MPSepang IOC [●Live]  12:34:56 PM    🔄 🔔 ⛶  👤     │  ← IOC Header
├──────────────────────────────────────────────────────────┤
│                                                          │
│                                                          │
│              FULL-SCREEN MONITORING                      │
│           (Maximum Space for Operations)                 │
│         Opens in NEW TAB from Admin Panel                │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
      Standalone Interface at /ioc-dashboard
```

---

## 🎯 Key Features to Try

### Dashboard Page
- ✅ View 4 stat cards (Revenue, Users, Sales, Active)
- ✅ Check the monthly revenue chart
- ✅ See recent sales feed
- ✅ Explore tabs: Overview, Analytics, Reports

### IOC Dashboard Page 🚨 **OPENS IN NEW TAB**
- ✅ **Separate Window** - Completely independent from admin panel
- ✅ **Direct URL**: `/ioc-dashboard` (not under /admin)
- ✅ **Click from Admin** - Opens in new tab automatically
- ✅ **NO SIDEBAR** - Full-screen monitoring interface
- ✅ **Live clock** in center of header (updates every second)
- ✅ View real-time system status (6 systems)
- ✅ Monitor live alerts feed
- ✅ Track 4 facility zones
- ✅ Check performance metrics
- ✅ Review active incidents
- ✅ Full-screen toggle for control rooms
- ✅ **Multi-monitor ready** - Perfect for dedicated NOC/SOC displays
- ✅ **Keep both open** - Monitor IOC while using admin panel

### Users Page
- ✅ Search for users by name or email
- ✅ Click the three-dot menu for actions
- ✅ View user statistics at the top
- ✅ Filter by role or status

### Products Page
- ✅ Browse product cards with emojis
- ✅ Check stock status (In Stock / Low Stock / Out of Stock)
- ✅ Use search to find products
- ✅ View inventory value

### Orders Page
- ✅ See order history with status badges
- ✅ Check total revenue from orders
- ✅ Search orders by ID or customer
- ✅ View order details in dropdown menu

### Analytics Page
- ✅ Explore 4 tabs: Traffic, Revenue, Customers, Products
- ✅ View traffic sources breakdown
- ✅ Check revenue by category
- ✅ Analyze customer growth metrics

### Reports Page
- ✅ View recent reports list
- ✅ Generate new reports with templates
- ✅ Check scheduled reports
- ✅ Download report files

### Settings Page
- ✅ Update profile information
- ✅ Change password settings
- ✅ Configure 2FA
- ✅ Manage notifications
- ✅ View billing history

---

## 📱 Responsive Design

### Desktop (1024px+)
- Full sidebar visible on the left
- Complete navigation menu
- Multi-column layouts

### Tablet (768px - 1023px)
- Collapsible sidebar
- Adapted layouts
- Touch-friendly buttons

### Mobile (< 768px)
- Hamburger menu (☰) in header
- Slide-out sidebar drawer
- Single column layouts
- Optimized touch targets

---

## 🎨 Customization Tips

### Change Colors
Edit `src/app/globals.css`:
```css
:root {
  --primary: 222.2 47.4% 11.2%;  /* Change primary color */
}
```

### Add New Page
1. Create: `src/app/admin/your-page/page.tsx`
2. Update sidebar: `src/components/admin/sidebar.tsx`

### Modify Stats
Edit the data arrays in each page component:
```typescript
const stats = [
  { title: "Your Stat", value: "123", ... },
];
```

---

## 🔧 Common Tasks

### Add More Users
Edit `src/app/admin/users/page.tsx`:
```typescript
const users = [
  // Add your user objects here
];
```

### Change Sidebar Items
Edit `src/components/admin/sidebar.tsx`:
```typescript
const sidebarItems = [
  { title: "New Page", href: "/admin/new", icon: IconName },
];
```

### Update Dashboard Stats
Edit `src/app/admin/page.tsx`:
```typescript
const stats = [
  { title: "New Metric", value: "$123", ... },
];
```

---

## 💡 Pro Tips

1. **Use Command/Ctrl + Click** on sidebar items to open in new tab
2. **Search is instant** - no need to press Enter
3. **All dropdowns** have keyboard navigation
4. **Mobile sidebar** swipes to close
5. **Breadcrumbs** are clickable for quick navigation

---

## 🐛 Troubleshooting

### Port 3000 Already in Use?
```bash
# Use a different port
npm run dev -- -p 3001
```

### Components Not Showing?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Build Errors?
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📚 Next Steps

1. **Explore All Pages** - Click through each menu item
2. **Try Mobile View** - Resize browser or use DevTools
3. **Check Components** - See all 34 installed components
4. **Read Full Docs** - Open `ADMIN_PANEL.md` for details
5. **Customize** - Make it your own!

---

## 🎓 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

---

**Need Help?** Check `ADMIN_PANEL.md` for comprehensive documentation.

**Ready to Deploy?** See deployment guide in `README.md`.

Happy coding! 🎉

