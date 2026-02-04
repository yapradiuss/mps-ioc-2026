# Widget Container Guide

## Overview

The `WidgetContainer` component provides a reusable, collapsible container for card widgets in the IOC Dashboard. It supports show/hide functionality and is ready for API integration.

## 📦 Component Location

```
src/components/ioc/widget-container.tsx
```

## 🎯 Features

- ✅ **Collapsible** - Expand/collapse widget content
- ✅ **Show/Hide** - Completely hide widget with show button
- ✅ **Glass Effect** - Matches IOC Dashboard transparent style
- ✅ **Positioning** - 4 corner positions available
- ✅ **API Ready** - Callbacks for saving preferences
- ✅ **Customizable** - Icon, title, and content

## 📝 Usage Example

```tsx
import WidgetContainer from "@/components/ioc/widget-container";

export default function MyWidget() {
  return (
    <WidgetContainer
      title="My Widget"
      icon={<MyIcon className="h-4 w-4" />}
      defaultOpen={true}
      defaultVisible={true}
      onVisibilityChange={(visible) => {
        // Save to API
        // await updateWidgetPreferences({ myWidget: visible });
      }}
      position="top-right"
    >
      {/* Your widget content here */}
      <div>Widget Content</div>
    </WidgetContainer>
  );
}
```

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Widget title displayed in header |
| `icon` | `ReactNode` | Optional | Icon displayed next to title |
| `defaultOpen` | `boolean` | `true` | Initial collapsed/expanded state |
| `defaultVisible` | `boolean` | `true` | Initial visible/hidden state |
| `onVisibilityChange` | `(visible: boolean) => void` | Optional | Callback when visibility changes |
| `children` | `ReactNode` | Required | Widget content |
| `position` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right"` | `"top-right"` | Widget position on screen |

## 📍 Position Options

### Top Left
```tsx
position="top-left"
```
- Below header, left side
- Good for: Filters, controls

### Top Right
```tsx
position="top-right"
```
- Below header, right side
- Good for: Status widgets, stats

### Bottom Left
```tsx
position="bottom-left"
```
- Above footer, left side
- Good for: Secondary controls

### Bottom Right
```tsx
position="bottom-right"
```
- Above footer, right side
- Good for: Notifications, alerts

## 🎨 Styling

The widget container automatically applies:
- Glass transparent background (`bg-background/10 backdrop-blur-2xl`)
- White text for visibility
- Border with transparency
- Shadow for depth
- Responsive sizing (min 280px, max 400px width)

## 🔄 Visibility States

### Visible State
- Widget shows with collapsible header
- Content can be expanded/collapsed
- Eye-off icon to hide widget

### Hidden State
- Widget completely hidden
- Small "Show [Title]" button appears
- Click to restore widget

## 💡 Example Widgets

### System Status Widget
```tsx
<WidgetContainer title="System Status" icon={<Activity />} position="top-right">
  <div className="space-y-2">
    <div>Systems: 5/6</div>
    <div>Alerts: 3</div>
  </div>
</WidgetContainer>
```

### Zone Info Widget
```tsx
<WidgetContainer title="Zone Info" icon={<MapPin />} position="bottom-left">
  <div>Zone A: Secure</div>
  <div>Zone B: Alert</div>
</WidgetContainer>
```

## 🔌 API Integration

### Save Widget Visibility
```tsx
onVisibilityChange={async (visible) => {
  try {
    await fetch('/api/widgets/preferences', {
      method: 'POST',
      body: JSON.stringify({ 
        widgetId: 'system-status',
        visible 
      })
    });
  } catch (error) {
    console.error('Failed to save preference:', error);
  }
}}
```

### Load Widget Preferences
```tsx
useEffect(() => {
  const loadPreferences = async () => {
    const response = await fetch('/api/widgets/preferences');
    const data = await response.json();
    setWidgetVisible(data.systemStatus?.visible ?? true);
  };
  loadPreferences();
}, []);
```

## 📂 File Structure

```
src/components/ioc/
├── widget-container.tsx      # Reusable container component
└── widgets/
    ├── example-widget.tsx    # Example implementation
    └── [your-widget].tsx     # Your custom widgets
```

## 🎯 Best Practices

1. **One widget per position** - Don't overlap widgets
2. **Use appropriate positions** - Top for controls, bottom for info
3. **Save preferences** - Use `onVisibilityChange` to persist state
4. **Keep content concise** - Widgets should be quick-reference
5. **Match glass style** - Use transparent backgrounds in content

## 🚀 Creating New Widgets

1. **Create widget file:**
```bash
src/components/ioc/widgets/my-widget.tsx
```

2. **Import WidgetContainer:**
```tsx
import WidgetContainer from "../widget-container";
```

3. **Wrap your content:**
```tsx
export default function MyWidget() {
  return (
    <WidgetContainer title="My Widget" position="top-right">
      {/* Your content */}
    </WidgetContainer>
  );
}
```

4. **Add to IOC Dashboard:**
```tsx
import MyWidget from "@/components/ioc/widgets/my-widget";

// In component:
<MyWidget />
```

## 📊 Current Widgets

- ✅ **Map Filters** - Top left (landmarks toggle)
- ✅ **Example Widget** - Top right (system status demo)

## 🔮 Future Widget Ideas

- Zone Status Widget
- Active Incidents Widget
- Personnel Tracker Widget
- System Health Widget
- Alert Feed Widget
- Weather Widget
- Traffic Status Widget

---

**Ready to create custom widgets with show/hide functionality!** 🎨

