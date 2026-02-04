# MPSepang Admin Panel Documentation

A comprehensive, production-ready admin panel built with the latest web technologies.

## 🎯 Overview

This admin panel provides a complete dashboard solution with user management, analytics, reporting, and more. It's built with modern tools and follows best practices for scalability and maintainability.

## 🚀 Quick Start

```bash
npm run dev
```

Then navigate to:
- **Landing Page**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## 📱 Admin Panel Features

### 1. Dashboard (`/admin`)
- **Real-time Stats**: Revenue, users, sales, and activity metrics
- **Visual Charts**: Monthly revenue performance with interactive bars
- **Recent Sales**: Live feed of latest transactions
- **Performance Metrics**: Conversion rate, AOV, and customer retention
- **Tabs**: Overview, Analytics, and Reports sections

### 2. IOC Dashboard (`/ioc-dashboard`) 🚨 **SEPARATE PAGE - OPENS IN NEW TAB**
- **Standalone Interface**: Completely separate from admin panel structure
- **Opens in New Tab**: Click from admin sidebar opens in separate window
- **No Sidebar**: Full-screen layout optimized for control rooms
- **Custom Header**: Large IOC branding, live clock, refresh, notifications, fullscreen toggle
- **Real-time Monitoring**: Live operations center interface
- **System Status**: 6 critical systems with uptime tracking
- **Live Alerts**: Real-time alert feed (Critical, Warning, Info)
- **Zone Monitoring**: 4 facility zones with personnel and camera tracking
- **Performance Metrics**: Network, response time, connections, processing
- **Incident Management**: Active incident tracking and resolution
- **Live Clock**: Prominent real-time date and time display in header center
- **Status Indicators**: Color-coded operational status
- **4 Tabs**: Overview, Systems, Zones, and Incidents
- **Multi-Monitor Ready**: Perfect for dedicated NOC/SOC displays
- **Note**: This is NOT under /admin - it's a root-level page at /ioc-dashboard

### 3. Users Management (`/admin/users`)
- **User Table**: Sortable, searchable user list with avatars
- **User Stats**: Total, active, admin, and manager counts
- **Search & Filter**: Real-time search across name and email
- **Actions Menu**: View details, edit, and delete operations
- **Role Management**: Admin, Manager, and User role badges
- **Status Tracking**: Active/Inactive user status

### 4. Products (`/admin/products`)
- **Product Grid**: Visual card-based product display
- **Inventory Stats**: Total products, stock status, and total value
- **Stock Management**: In Stock, Low Stock, Out of Stock indicators
- **Search & Filter**: Find products quickly
- **Quick Actions**: Edit and delete products
- **Category Organization**: Products grouped by category

### 5. Orders (`/admin/orders`)
- **Order Table**: Complete order history with details
- **Order Stats**: Total orders, processing, completed, and revenue
- **Status Management**: Completed, Processing, Shipped, Cancelled
- **Search Functionality**: Find orders by ID, customer, or email
- **Action Menu**: View details, update status, download invoice
- **Customer Info**: Linked customer details with each order

### 6. Analytics (`/admin/analytics`)
- **Traffic Analytics**: Page views, bounce rate, session duration
- **Traffic Sources**: Organic, direct, social media, referral breakdown
- **Top Pages**: Most visited pages with trends
- **Revenue Analytics**: Total revenue, AOV, transaction count
- **Revenue by Category**: Category performance breakdown
- **Customer Analytics**: New vs returning, lifetime value, retention
- **Product Analytics**: Best sellers, category performance, inventory status
- **Visual Progress Bars**: Easy-to-read data visualization

### 7. Reports (`/admin/reports`)
- **Report Generation**: Generate custom reports on demand
- **Quick Templates**: Pre-built templates for common reports
  - Sales Report (Daily/Monthly)
  - User Report (Activity & Growth)
  - Order Report (Fulfillment)
  - Analytics (Performance)
- **Recent Reports**: View and download past reports
- **Scheduled Reports**: Automated email reports
- **Report Types**: Sales, Analytics, Inventory, Financial, Marketing, Products

### 8. Settings (`/admin/settings`)
**General Tab:**
- Profile Information (name, email, bio)
- Business Information (company, phone, timezone, address)

**Security Tab:**
- Password Management
- Two-Factor Authentication (2FA)
- SMS Authentication
- Active Sessions Management

**Notifications Tab:**
- Email Notifications (orders, marketing, system, reports)
- Push Notifications (new orders, low stock alerts)

**Billing Tab:**
- Payment Method Management
- Billing History
- Invoice Downloads

## 🎨 UI Components Used

### Layout Components
- ✅ Sidebar Navigation (desktop & mobile)
- ✅ Header with search and user menu
- ✅ Breadcrumb Navigation
- ✅ Responsive Design

### Data Display
- ✅ Tables with sorting and filtering
- ✅ Cards with statistics
- ✅ Badges for status indicators
- ✅ Avatars for user profiles
- ✅ Progress bars for metrics
- ✅ Tabs for organized content

### Interactive Elements
- ✅ Buttons (all variants)
- ✅ Dropdown Menus
- ✅ Search Inputs
- ✅ Forms with validation
- ✅ Switches and Checkboxes
- ✅ Select Dropdowns
- ✅ Sheets (mobile sidebar)

### Feedback Components
- ✅ Tooltips
- ✅ Alerts
- ✅ Skeleton Loaders
- ✅ Toast Notifications (Sonner)

## 📂 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin panel layout with sidebar
│   │   ├── page.tsx             # Dashboard (main admin page)
│   │   ├── users/
│   │   │   └── page.tsx         # User management
│   │   ├── products/
│   │   │   └── page.tsx         # Product management
│   │   ├── orders/
│   │   │   └── page.tsx         # Order management
│   │   ├── analytics/
│   │   │   └── page.tsx         # Analytics & insights
│   │   ├── reports/
│   │   │   └── page.tsx         # Report generation
│   │   └── settings/
│   │       └── page.tsx         # Settings & preferences
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── admin/
│   │   ├── sidebar.tsx          # Desktop & mobile sidebar
│   │   ├── header.tsx           # Top navigation bar
│   │   └── breadcrumb-nav.tsx   # Breadcrumb component
│   └── ui/                      # shadcn/ui components (34 components)
└── lib/
    └── utils.ts                 # Utility functions
```

## 🔐 Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with quick access to dashboard |
| `/admin` | Main dashboard with stats and overview |
| `/ioc-dashboard` ⚠️ | **Separate page** - Real-time operations center (opens in new tab) |
| `/admin/users` | User management interface |
| `/admin/products` | Product catalog management |
| `/admin/orders` | Order processing and tracking |
| `/admin/analytics` | Detailed analytics and insights |
| `/admin/reports` | Report generation and downloads |
| `/admin/settings` | Account and system settings |

## 💡 Key Features

### Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet optimized
- ✅ Desktop enhanced
- ✅ Mobile sidebar with slide-out drawer

### Search & Filter
- ✅ Real-time search across all pages
- ✅ Client-side filtering for instant results
- ✅ Filter buttons for advanced queries

### Data Visualization
- ✅ Bar charts for trends
- ✅ Progress bars for metrics
- ✅ Stat cards for KPIs
- ✅ Tables for detailed data

### User Experience
- ✅ Breadcrumb navigation
- ✅ Contextual actions
- ✅ Consistent design language
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling

## 🎯 Next Steps

### Backend Integration
To connect this admin panel to a real backend:

1. **Replace mock data** with API calls:
```typescript
// Example: Fetch users from API
const users = await fetch('/api/users').then(res => res.json());
```

2. **Add authentication**:
```typescript
// Add auth middleware
import { auth } from '@/lib/auth';
export default auth((req) => {
  // Protect admin routes
});
```

3. **Implement real-time updates**:
```typescript
// Use WebSocket or Server-Sent Events
const ws = new WebSocket('ws://api.example.com');
```

### Recommended Additions
- [ ] Authentication (NextAuth.js)
- [ ] API Integration (tRPC or REST)
- [ ] Database (Prisma + PostgreSQL)
- [ ] File Upload (UploadThing)
- [ ] Real-time (WebSocket)
- [ ] Email Service (Resend)
- [ ] Chart Library (Recharts)
- [ ] Form Validation (Zod + React Hook Form) ✅ Already installed
- [ ] Date Handling (date-fns) ✅ Already installed

## 🛠️ Customization

### Changing Theme
Edit `src/app/globals.css` to customize colors:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... more variables */
}
```

### Adding New Pages
1. Create a new folder in `src/app/admin/`
2. Add a `page.tsx` file
3. Update the sidebar navigation in `src/components/admin/sidebar.tsx`

### Modifying Sidebar
Edit `src/components/admin/sidebar.tsx`:

```typescript
const sidebarItems = [
  {
    title: "Your Page",
    href: "/admin/your-page",
    icon: YourIcon,
  },
  // ... more items
];
```

## 📊 Performance

- ⚡ Server Components by default (React 19)
- ⚡ Client Components only where needed
- ⚡ Optimized images (Next.js Image)
- ⚡ Route-based code splitting
- ⚡ Fast page transitions

## 🔒 Security Considerations

When deploying to production:

1. **Add authentication** - Protect all `/admin` routes
2. **Implement RBAC** - Role-based access control
3. **Add CSRF protection** - Prevent cross-site attacks
4. **Sanitize inputs** - Prevent XSS attacks
5. **Use HTTPS** - Always in production
6. **Rate limiting** - Prevent abuse
7. **Audit logging** - Track admin actions

## 📝 License

This project is built using open-source components:
- Next.js (MIT)
- React (MIT)
- shadcn/ui (MIT)
- Radix UI (MIT)
- Tailwind CSS (MIT)

---

**Built with ❤️ for MPSepang**

