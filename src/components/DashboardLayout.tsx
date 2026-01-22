"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState, useMemo } from "react";
import { Role } from "@/types";
import { LogOut, Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface MenuItem {
  name: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  mobileTitle: string;
  menuItems: MenuItem[];
  allowedRole: Role;
}

export default function DashboardLayout({
  children,
  title,
  mobileTitle,
  menuItems,
  allowedRole,
}: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user?.role !== allowedRole) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router, allowedRole]);

  const getInitials = useMemo(() => {
    return (name?: string | null) => {
      if (!name) return "U";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };
  }, []);

  if (status === "loading" || !session || session.user?.role !== allowedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="lg:flex items-center min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center h-16 px-6">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    size="lg"
                    className={cn(
                      "w-full justify-start hover:bg-gray-400/10 hover:text-primary",
                      isActive &&
                        "bg-primary/10 text-primary hover:bg-primary/10",
                    )}
                    asChild>
                    <Link href={item.href}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </nav>

            <Separator />

            {/* User section */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage
                    src={session.user?.image || undefined}
                    alt={session.user?.name || "User"}
                  />
                  <AvatarFallback>
                    {getInitials(session.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-white"
                  asChild>
                  <Link href="/">
                    <Home className="mr-3 h-5 w-5" />
                    Ke Halaman Client
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}>
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen bg-background shadow-lg">
        {/* Logo */}
        <div className="flex items-center h-16 px-6">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                variant="ghost"
                size="lg"
                className={cn(
                  "w-full justify-start hover:bg-gray-400/10 hover:text-primary",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/10",
                )}
                asChild>
                <Link href={item.href}>
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </nav>

        <Separator />

        {/* User section */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarImage
                src={session.user?.image || undefined}
                alt={session.user?.name || "User"}
              />
              <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.email}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-white"
              asChild>
              <Link href="/">
                <Home className="mr-3 h-5 w-5" />
                Ke Halaman Client
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-50 bg-background shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {mobileTitle}
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 h-screen w-full">{children}</main>
      </div>
    </div>
  );
}
