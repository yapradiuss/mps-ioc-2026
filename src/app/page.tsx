import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <Badge variant="secondary">MPSepang Dashboard</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Modern Admin Panel
          </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with Next.js 16, React 19, and shadcn/ui. A complete admin dashboard solution with beautiful UI components.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://ui.shadcn.com" target="_blank">
                View Components
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-20 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Fast & Modern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with Next.js 16 and React 19 for optimal performance and developer experience.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                Beautiful UI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                34+ shadcn/ui components installed and ready to use with customizable themes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Complete Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Full-featured admin panel with analytics, user management, and reports.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">Built With</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="text-sm py-2 px-4">Next.js 16.0.3</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">React 19.2.0</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Tailwind CSS 4</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">TypeScript</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">shadcn/ui</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Radix UI</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
