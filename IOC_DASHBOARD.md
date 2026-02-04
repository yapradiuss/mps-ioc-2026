# 🚨 IOC Dashboard Documentation

## Overview

The **IOC (Integrated Operations Center) Dashboard** is a **completely separate, full-screen monitoring interface** designed for operations centers, security teams, and facility management. 

**Key Features:** 
- ✅ **Standalone Page** - Not part of the admin panel structure
- ✅ **NO SIDEBAR** - Maximum screen space for monitoring
- ✅ **Opens in New Tab** - Keeps admin panel separate
- ✅ **Independent Interface** - Optimized for large displays, control rooms, and 24/7 monitoring

**Access:** 
- **Direct URL:** `http://localhost:3000/ioc-dashboard`
- **From Admin:** Click "IOC Dashboard" in sidebar (opens in new tab)

---

## 🎯 Key Features

### 🖥️ Full-Screen Dedicated Interface
- **Completely Standalone** - Not nested under /admin
- **Opens in New Tab** - Separate window from admin panel
- **No Sidebar** - Maximized screen space for monitoring
- **Independent Layout** - Completely separate from admin panel
- **Custom Header** - IOC-specific navigation and controls
- **Optimized for Control Rooms** - Perfect for large displays and monitoring stations

### 📍 IOC Header Bar

**Left Section:**
- **MPSepang IOC Logo** - Large Radio icon (📡)
- **Dashboard Title** - "MPSepang IOC Dashboard"
- **Live Status Badge** - Animated pulsing indicator
- **Subtitle** - "Integrated Operations Center - Real-Time Monitoring"

**Center Section:**
- **Live Clock** - Updates every second
- **Full Date Display** - Weekday, month, day, year

**Right Section:**
- **Refresh Button** - Manual data refresh
- **Notifications** - Alert center access
- **Fullscreen Toggle** - Maximize for control rooms
- **User Menu** - IOC operator profile

### 1. Real-Time Clock
- **Live Date & Time Display** - Updates every second in the header center
- **24-hour format** for professional operations
- **Always visible** and prominently displayed
- **Tabular numbers** for consistent width

### 2. Live Status Indicator
- **Animated "Live" badge** with pulsing green dot
- Indicates real-time data streaming
- Visual confirmation of active monitoring
- Located next to dashboard title

### 3. Critical Statistics (Top Cards)

#### Systems Online
- **Shows:** 5/6 systems operational
- **Percentage:** 83.3% uptime
- **Color:** Green background
- **Icon:** Check circle

#### Active Alerts
- **Shows:** Current alert count
- **Breakdown:** Critical and warning levels
- **Color:** Orange background (warning state)
- **Icon:** Bell

#### Active Incidents
- **Shows:** Current open incidents
- **Daily stats:** Resolved incidents today
- **Color:** Blue background
- **Icon:** Alert circle

#### Personnel on Site
- **Shows:** Total staff on premises
- **Breakdown:** Across all zones
- **Color:** Purple background
- **Icon:** Users

---

## 📊 Dashboard Tabs

### 🔍 Overview Tab (Default)

#### Live Alerts Feed
**Real-time alert monitoring with:**
- Alert type badges (Critical, Warning, Info)
- Timestamp for each alert
- Location information
- Color-coded borders:
  - 🔴 Critical (Red)
  - 🟠 Warning (Orange)
  - 🔵 Info (Blue)
- Scrollable list of recent alerts

**Current Alerts:**
1. Unusual network traffic in Zone A (Critical)
2. Server CPU usage above 85% (Warning)
3. Scheduled maintenance completed (Info)
4. Failed login attempts detected (Warning)
5. System backup successful (Info)

#### System Status
**Infrastructure monitoring:**
- Network Gateway: 99.9% uptime ✅
- Database Cluster: 99.8% uptime ✅
- Security Systems: 100% uptime ✅
- Monitoring Services: 98.5% uptime ⚠️
- Communication Hub: 99.7% uptime ✅
- Power Systems: 99.9% uptime ✅

**Features:**
- Status icons (✅ Operational, ⚠️ Warning, ❌ Critical)
- Progress bars for uptime visualization
- Icon for each system type
- Scrollable system list

#### Performance Metrics
**Real-time performance indicators:**

1. **Network Throughput**
   - Value: 78 Gbps
   - Status: Good
   - Visual progress bar

2. **System Response Time**
   - Value: 45 ms
   - Status: Good
   - Visual progress bar

3. **Active Connections**
   - Value: 1,247 connections
   - Status: Normal
   - Visual progress bar

4. **Data Processing**
   - Value: 92%
   - Status: Warning
   - Visual progress bar

---

### 🖥️ Systems Tab

**Individual system cards with:**
- Large system icon
- Current status badge
- Uptime percentage
- Progress visualization
- "View Details" button

**All 6 systems displayed in a grid:**
- Network Gateway (Wifi icon)
- Database Cluster (Server icon)
- Security Systems (Shield icon)
- Monitoring Services (Eye icon)
- Communication Hub (Radio icon)
- Power Systems (Lightning icon)

---

### 🗺️ Zones Tab

**Facility zone monitoring with 4 zones:**

#### Zone A - Main Facility
- Status: 🟢 Secure
- Personnel: 45
- Cameras: 12
- Alerts: 0

#### Zone B - Data Center
- Status: 🟢 Secure
- Personnel: 8
- Cameras: 8
- Alerts: 0

#### Zone C - Perimeter
- Status: 🟠 Alert (Animated badge)
- Personnel: 12
- Cameras: 24
- Alerts: 2

#### Zone D - Parking Area
- Status: 🟢 Secure
- Personnel: 5
- Cameras: 6
- Alerts: 0

**Each zone card shows:**
- Zone name and type
- Status badge (Secure/Alert)
- Personnel count
- Active camera count
- Alert count (highlighted if > 0)
- Action buttons (View, Map)

---

### 🚨 Incidents Tab

**Incident management system with:**

#### Active Incidents

1. **INC-2024-001: Network Latency Spike**
   - Priority: 🟠 High
   - Status: Investigating
   - Assigned: Team Alpha
   - Duration: 12 min

2. **INC-2024-002: Unauthorized Access Attempt**
   - Priority: 🔴 Critical
   - Status: Monitoring
   - Assigned: Security Team
   - Duration: 8 min

3. **INC-2024-003: Database Connection Pool**
   - Priority: 🔵 Medium
   - Status: ✅ Resolved
   - Assigned: Team Beta
   - Duration: 45 min

**Features:**
- Incident ID tracking
- Priority badges (Critical, High, Medium, Low)
- Status indicators
- Team assignment
- Duration tracking
- Details button for each incident

---

## 🎨 Design Elements

### Color Coding
- **🟢 Green** - Operational, Secure, Good status
- **🟠 Orange** - Warning, Alert, Needs attention
- **🔴 Red** - Critical, Down, Urgent action required
- **🔵 Blue** - Informational, Normal status
- **🟣 Purple** - Personnel/user-related metrics

### Visual Indicators
- **Progress Bars** - Uptime and performance metrics
- **Badges** - Status, priority, and category labels
- **Icons** - System type and status visualization
- **Animated Elements** - Live indicator, alert badges
- **Border Highlights** - Alert type differentiation

### Layout
- **Grid System** - Responsive card layouts
- **Tabs** - Organized content sections
- **Scroll Areas** - Long lists with fixed heights
- **Stat Cards** - Quick metrics at a glance

---

## 🔄 Real-Time Features

### Auto-Updating Elements
- ⏰ **Clock** - Updates every second
- 📊 **Metrics** - Ready for real-time data updates
- 🚨 **Alerts** - New alerts appear at top
- 📈 **Status** - System health updates

### Live Indicator
- Animated pulsing dot
- "Live" badge always visible
- Confirms active data streaming

---

## 💡 Use Cases

### 1. Control Room / NOC Display
- **Large Screen Display** - No sidebar distractions
- **24/7 Monitoring** - Always-on operations center
- **Multi-Monitor Setup** - Dedicated IOC screen
- **Team Viewing** - Shared situational awareness

### 2. Security Operations Center (SOC)
- Monitor all zones simultaneously
- Receive instant security alerts
- Track personnel locations
- Review camera coverage
- Full-screen incident response

### 3. IT Operations / Network Operations Center
- System health monitoring
- Performance metrics tracking
- Incident management
- Network monitoring
- Distraction-free interface

### 4. Facility Management
- Personnel tracking
- Zone status monitoring
- Alert response coordination
- Maintenance scheduling
- Clean, focused dashboard

### 5. Emergency Response
- Quick incident identification
- Priority-based response
- Team coordination
- Real-time status updates
- Maximum screen real estate

---

## 🔧 Customization

### Adding New Zones
Edit the `zones` array in the page:

```typescript
const zones = [
  {
    name: "Zone E - New Area",
    status: "secure",
    personnel: 10,
    alerts: 0,
    cameras: 15
  },
];
```

### Adding New Systems
Edit the `systemStatus` array:

```typescript
const systemStatus = [
  {
    name: "Your System",
    status: "operational",
    uptime: 99.5,
    icon: YourIcon
  },
];
```

### Adding New Alerts
Edit the `alerts` array:

```typescript
const alerts = [
  {
    id: 6,
    type: "warning", // or "critical", "info"
    message: "Your alert message",
    time: "1 min ago",
    location: "Location"
  },
];
```

### Modifying Metrics
Edit the `metrics` array:

```typescript
const metrics = [
  {
    label: "Your Metric",
    value: 85,
    unit: "units",
    status: "good" // or "warning", "normal"
  },
];
```

---

## 🔌 Backend Integration

To connect real data:

### 1. WebSocket Connection
```typescript
useEffect(() => {
  const ws = new WebSocket('ws://your-server.com/ioc');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update state with real-time data
  };
}, []);
```

### 2. API Polling
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await fetch('/api/ioc/status').then(r => r.json());
    // Update state
  }, 5000); // Poll every 5 seconds
  
  return () => clearInterval(interval);
}, []);
```

### 3. Server-Sent Events
```typescript
useEffect(() => {
  const eventSource = new EventSource('/api/ioc/stream');
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update state
  };
}, []);
```

---

## 📱 Responsive Design

### Large Display / Control Room (1920px+)
- **Full-screen optimized** - No wasted space
- 4-column stat cards
- Side-by-side layout for all content
- Maximum data visibility
- Perfect for TV/monitor displays

### Desktop (1024px+)
- 4-column stat cards
- Side-by-side layout for alerts and systems
- Full tab content visibility
- Large system cards
- Full IOC header with all controls

### Tablet (768px - 1023px)
- 2-column stat cards
- Stacked alerts and systems
- Full tab functionality
- Medium system cards
- Compact header

### Mobile (< 768px)
- Single column layout
- Stacked stat cards
- Scrollable content areas
- Touch-optimized buttons
- Mobile-friendly header

---

## 🎯 Best Practices

### Monitoring
- ✅ Check critical stats first
- ✅ Review alerts feed regularly
- ✅ Monitor zone status for anomalies
- ✅ Track incident response times

### Alert Management
- ✅ Address critical alerts immediately
- ✅ Investigate warnings promptly
- ✅ Document all incidents
- ✅ Review resolved incidents

### System Health
- ✅ Monitor uptime percentages
- ✅ Track performance metrics
- ✅ Set up alert thresholds
- ✅ Regular system checks

---

## 🚀 Future Enhancements

Potential additions:
- [ ] Interactive facility map
- [ ] Video feed integration
- [ ] Advanced analytics
- [ ] Alert history graph
- [ ] Export reports
- [ ] Mobile app notifications
- [ ] Multi-site support
- [ ] Audit logs
- [ ] Custom alert rules
- [ ] Team chat integration

---

## 📊 Sample Scenarios

### Scenario 1: Critical Alert
1. Alert appears in feed (red border)
2. Critical badge on top stat card
3. Incident created automatically
4. Team notified
5. Status tracked until resolved

### Scenario 2: Zone Breach
1. Zone status changes to "Alert"
2. Badge animates (orange)
3. Personnel count updates
4. Cameras activated
5. Incident logged

### Scenario 3: System Down
1. System status changes to "critical"
2. Alert generated
3. Uptime percentage drops
4. Progress bar reflects status
5. Team assigned to investigate

---

## 📝 Notes

- **Dedicated Page** - Has its own layout, NO sidebar menu
- **Full-Screen Design** - Maximizes monitoring space
- All demo data is static - ready for real API integration
- Clock updates in real-time to demonstrate live capability
- Color coding follows industry standards for operations centers
- Design optimized for 24/7 monitoring environments
- Perfect for control rooms, NOCs, and SOCs
- Easy navigation back to admin panel via header button
- Accessibility features included (ARIA labels via Radix UI)

## 🔄 Navigation

**Accessing IOC Dashboard:**
- **From Admin Panel:** Click "IOC Dashboard" in sidebar → **Opens in NEW TAB**
- **Direct URL:** `http://localhost:3000/ioc-dashboard`
- **Bookmarkable:** Save direct link for quick access
- **Multi-Monitor Setup:** Keep open on dedicated screen

**Why Separate Tab/Window?**
- ✅ **Independent Operation** - Doesn't interfere with admin panel workflow
- ✅ **Multi-Monitor Ready** - Move to dedicated display
- ✅ **Always Available** - Keep IOC open while working in admin
- ✅ **Maximum Screen Space** - No sidebar or navigation clutter
- ✅ **Parallel Monitoring** - Monitor operations while managing admin tasks
- ✅ **Professional Setup** - Typical NOC/SOC configuration

**Closing IOC Dashboard:**
- Simply close the browser tab/window
- Or use logout from user menu
- Admin panel remains open in original tab

---

**Built for professional operations monitoring and incident management.** 🚨

**Designed for control rooms, NOCs, and 24/7 monitoring environments.**

**Access URL:** `/ioc-dashboard` (opens in separate tab from admin panel)

