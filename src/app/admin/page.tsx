"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Users, 
  BarChart3, 
  Star, 
  ShoppingCart, 
  GraduationCap, 
  Car, 
  Building2, 
  FileText, 
  MessageSquare,
  Award,
  Calculator,
  Receipt,
  FileSpreadsheet,
  PieChart,
  Wallet,
  FolderOpen,
  CreditCard,
  Shield,
  Wrench,
  Home,
  Hammer,
  Search,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { getCurrentUser, type User as UserType } from "@/lib/auth";

// Application shortcuts data
const appShortcuts = [
  {
    id: "e-mel",
    name: "e-Mel",
    description: "Sistem emel rasmi",
    icon: Mail,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
    url: "http://mail.mpsepang.gov.my/",
  },
  {
    id: "hrmis",
    name: "Sistem HRMIS",
    description: "Pengurusan sumber manusia",
    icon: Users,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    url: "https://hrmis2.eghrmis.gov.my/",
  },
  {
    id: "statistik-aduan",
    name: "Statistik Aduan",
    description: "Paparan statistik aduan",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
    url: "http://aduan.mpsepang.gov.my/chart-stats.php",
  },
  {
    id: "penilaian",
    name: "Sistem Penilaian",
    description: "Penilaian prestasi",
    icon: Star,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
    url: "http://epbt.mpsepang.gov.my/index.asp",
  },
  {
    id: "eperolehan",
    name: "Sistem ePerolehan",
    description: "Perolehan elektronik kerajaan",
    icon: ShoppingCart,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-500",
    url: "http://spp.mpsepang.gov.my/eperolehan",
  },
  {
    id: "elatihan",
    name: "Sistem eLatihan",
    description: "Pengurusan latihan kakitangan",
    icon: GraduationCap,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    url: "http://elatihan.mpsepang.gov.my/",
  },
  {
    id: "tempahan-kenderaan",
    name: "Sistem Tempahan Kenderaan",
    description: "Tempahan kenderaan jabatan",
    icon: Car,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
    url: "http://ekenderaan.mpsepang.gov.my/",
  },
  {
    id: "aims",
    name: "Sistem AIMS",
    description: "Asset Inventory Management",
    icon: Building2,
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-500/10",
    iconColor: "text-teal-500",
    url: "http://aims.mpsepang.gov.my/",
  },
  {
    id: "perjanjian",
    name: "Sistem Pemantauan Perjanjian",
    description: "Pemantauan kontrak & perjanjian",
    icon: FileText,
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-500/10",
    iconColor: "text-rose-500",
    url: "http://eperjanjian.mpsepang.gov.my/",
  },
  {
    id: "pcom",
    name: "Sistem PCOM",
    description: "Public Complaints Management",
    icon: MessageSquare,
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-500/10",
    iconColor: "text-pink-500",
    url: "http://pcom.mpsepang.gov.my/pcom/index.php/auth",
  },
  {
    id: "pelesenan",
    name: "Sistem Pelesenan",
    description: "Pengurusan lesen perniagaan",
    icon: Award,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-500/10",
    iconColor: "text-amber-500",
    url: "http://elesen.mpsepang.gov.my/",
  },
  {
    id: "perakaunan",
    name: "Sistem Perakaunan",
    description: "Akaun & kewangan",
    icon: Calculator,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10",
    iconColor: "text-green-500",
    url: "http://akaun.mpsepang.gov.my/",
  },
  {
    id: "cukai-taksiran",
    name: "Sistem Cukai Taksiran",
    description: "Pengurusan cukai pintu",
    icon: Receipt,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500/10",
    iconColor: "text-red-500",
    url: "http://epbt.mpsepang.gov.my/index.asp",
  },
  {
    id: "bajet",
    name: "Sistem Penyediaan Bajet",
    description: "Perancangan bajet tahunan",
    icon: FileSpreadsheet,
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-500/10",
    iconColor: "text-violet-500",
    url: "https://ebajet.mpsepang.gov.my/",
  },
  {
    id: "eksekutif",
    name: "Sistem Maklumat Eksekutif",
    description: "Dashboard pengurusan atasan",
    icon: PieChart,
    color: "from-sky-500 to-sky-600",
    bgColor: "bg-sky-500/10",
    iconColor: "text-sky-500",
    url: "http://eis.mpsepang.gov.my/",
  },
  {
    id: "kutipan",
    name: "Sistem Pengurusan Kutipan",
    description: "Pengurusan kutipan hasil",
    icon: Wallet,
    color: "from-lime-500 to-lime-600",
    bgColor: "bg-lime-500/10",
    iconColor: "text-lime-500",
    url: "http://epbt.mpsepang.gov.my/index.asp",
  },
  {
    id: "dokumen",
    name: "Sistem Pengurusan Dokumen",
    description: "Arkib & pengurusan dokumen",
    icon: FolderOpen,
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-500/10",
    iconColor: "text-slate-500",
    url: "http://dms.mpsepang.gov.my/OpenKM",
  },
  {
    id: "kaunter",
    name: "Sistem Penerimaan Hasil Kaunter",
    description: "Sistem kaunter bayaran",
    icon: CreditCard,
    color: "from-fuchsia-500 to-fuchsia-600",
    bgColor: "bg-fuchsia-500/10",
    iconColor: "text-fuchsia-500",
    url: "http://epbt.mpsepang.gov.my/index.asp",
  },
  {
    id: "penguatkuasaan",
    name: "Sistem Penguatkuasaan Berkomputer",
    description: "Penguatkuasaan undang-undang",
    icon: Shield,
    color: "from-stone-500 to-stone-600",
    bgColor: "bg-stone-500/10",
    iconColor: "text-stone-500",
    url: "http://ekompaun.mpsepang.gov.my/",
  },
  {
    id: "aset",
    name: "Sistem Pemantauan Pengurusan Aset",
    description: "Pengurusan aset kerajaan",
    icon: Wrench,
    color: "from-zinc-500 to-zinc-600",
    bgColor: "bg-zinc-500/10",
    iconColor: "text-zinc-500",
    url: "http://gis.mpsepang.gov.my/portalSPA/login.cfm",
  },
  {
    id: "sewaan",
    name: "Sistem Sewaan, Cagaran Dan Bil Pelbagai",
    description: "Pengurusan sewaan & cagaran",
    icon: Home,
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-400/10",
    iconColor: "text-blue-400",
    url: "http://esbp.mpsepang.gov.my/",
  },
  {
    id: "projek",
    name: "Sistem Pengurusan Projek Dan Penyelenggaraan",
    description: "Pengurusan projek pembangunan",
    icon: Hammer,
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-400/10",
    iconColor: "text-orange-400",
    url: "http://spp.mpsepang.gov.my/spp",
  },
];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Filter apps based on search
  const filteredApps = appShortcuts.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAppClick = (url: string, name: string) => {
    if (url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Placeholder - show toast or notification
      console.log(`Opening ${name}...`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {user ? (
              <>Selamat datang, <span className="font-medium text-foreground">{(user as any).name || user.username}</span>! Akses pantas ke sistem-sistem MPSepang.</>
            ) : (
              <>Akses pantas ke sistem-sistem MPSepang.</>
            )}
          </p>
        </div>
        <Badge variant="outline" className="text-sm w-fit">
          {filteredApps.length} Sistem Tersedia
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari sistem..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredApps.map((app) => {
          const Icon = app.icon;
          return (
            <Card
              key={app.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border-border/50 hover:border-primary/30 overflow-hidden"
              onClick={() => handleAppClick(app.url, app.name)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                {/* Icon Container */}
                <div
                  className={`relative w-14 h-14 rounded-2xl ${app.bgColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-7 w-7 ${app.iconColor}`} />
                  {/* External link indicator */}
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                      <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* App Name */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                    {app.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                    {app.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredApps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">Tiada hasil ditemui</h3>
          <p className="text-muted-foreground text-sm">
            Cuba carian lain atau semak ejaan anda.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">22</p>
                <p className="text-xs text-muted-foreground">Jumlah Sistem</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Aktif</p>
                <p className="text-xs text-muted-foreground">Status Sistem</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Selamat</p>
                <p className="text-xs text-muted-foreground">Keselamatan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">v2.0</p>
                <p className="text-xs text-muted-foreground">Versi Portal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
