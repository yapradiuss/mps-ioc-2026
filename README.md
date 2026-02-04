# MPSepang Dashboard - Next.js + shadcn/ui

A modern dashboard built with the latest Next.js and shadcn/ui components.

## 🚀 Tech Stack

- **Next.js** 16.0.3 - The React Framework
- **React** 19.2.0 - Latest React version
- **Tailwind CSS** 4.0 - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **TypeScript** - Type-safe development
- **Lucide React** - Icon library

## 📦 Installed Components

All shadcn/ui components are installed and ready to use:

### Form Components
- Button
- Input
- Textarea
- Label
- Select
- Checkbox
- Radio Group
- Switch
- Slider
- Form (with react-hook-form integration)
- Calendar

### Layout Components
- Card
- Separator
- Tabs
- Accordion
- Sheet
- Scroll Area

### Navigation Components
- Breadcrumb
- Navigation Menu
- Dropdown Menu
- Context Menu
- Menubar
- Pagination

### Feedback Components
- Alert
- Badge
- Avatar
- Tooltip
- Progress
- Skeleton
- Sonner (Toast notifications)

### Overlay Components
- Dialog
- Popover
- Command

### Data Display
- Table

## 🛠️ Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo page.

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (component demo)
│   │   └── globals.css      # Global styles with CSS variables
│   ├── components/
│   │   └── ui/              # shadcn/ui components (34 components)
│   └── lib/
│       └── utils.ts         # Utility functions
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Customization

### Theme Configuration

The project uses CSS variables for theming. Edit `src/app/globals.css` to customize:

- Colors
- Border radius
- Font family
- Spacing

### Adding More Components

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add collapsible
```

### Component Aliases

Components can be imported using the `@/` alias:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com)

## 🎯 Features

- ✅ Server Components by default
- ✅ App Router
- ✅ TypeScript configured
- ✅ Tailwind CSS v4
- ✅ ESLint configured
- ✅ Beautiful UI components
- ✅ Accessible components (ARIA compliant)
- ✅ Dark mode ready
- ✅ Form validation with Zod
- ✅ Responsive design

## 📝 Notes

- Uses the "New York" style for shadcn/ui components
- CSS variables enabled for easy theming
- Lucide React for icons
- React Hook Form for form handling
- Sonner for toast notifications (replaces deprecated toast component)

## 🔧 Configuration Files

- `components.json` - shadcn/ui configuration
- `tailwind.config.ts` - Tailwind CSS configuration  
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

## 🚦 Getting Help

If you need to add more components, run:

```bash
npx shadcn@latest add
```

Then select from the interactive list of available components.

---

Built with ❤️ using Next.js and shadcn/ui
