"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
// import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Image,
  FolderOpen,
  Camera,
  User,
  MessageSquare,
  Award,
  Handshake,
  Briefcase,
  FileText,
  Settings,
  Users,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Home,
  Calendar,
  CalendarCheck,
  Bell,
} from "lucide-react";
import {
  getPendingAppointmentsCount,
  getUnreadNotificationsCount,
} from "@/lib/admin-store";
import { useEffect, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

const navigation = [
  { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  {
    name: "Rendez-vous",
    href: "/admin/appointments",
    icon: CalendarCheck,
    badge: "appointments",
  },
  { name: "Disponibilites", href: "/admin/availability", icon: Calendar },
  // {
  //   name: "Notifications",
  //   href: "/admin/notifications",
  //   icon: Bell,
  //   badge: "notifications",
  // },
  { name: "Section Hero", href: "/admin/hero", icon: Image },
  { name: "Domaines", href: "/admin/categories", icon: FolderOpen },
  { name: "Portfolio", href: "/admin/portfolio", icon: Camera },
  { name: "Projets", href: "/admin/projects", icon: FolderOpen },
  { name: "A propos", href: "/admin/about", icon: User },
  { name: "Temoignages", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Experience", href: "/admin/experience", icon: Award },
  { name: "Partenaires", href: "/admin/partners", icon: Handshake },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  // { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Administrateurs", href: "/admin/admins", icon: Users },
  { name: "Parametres", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  // const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = "Armand Khono";

  const { data: session, isPending } = useSession();

  useEffect(() => {
    const updateCounts = () => {
      setPendingCount(getPendingAppointmentsCount());
      setUnreadCount(getUnreadNotificationsCount());
    };
    updateCounts();
    const interval = setInterval(updateCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  async function handleClick() {
    await signOut({
      fetchOptions: {
        onRequest: () => {},
        onResponse: () => {},
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Déconnexion réussie !");
          router.push("/admin/login");
          // logout()
        },
      },
    });
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground">
          {/* <Camera className="h-5 w-5" /> */}
          <img
            src="/sno.png"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-lg font-semibold">Admin</span>
          <span className="text-xs text-muted-foreground">
            {session?.user.name}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const badgeValue =
              item.badge === "appointments"
                ? pendingCount
                : item.badge === "notifications"
                  ? unreadCount
                  : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.name}</span>
                {item.badge && badgeValue > 0 && (
                  <span
                    className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                      isActive
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    {badgeValue}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User menu */}
      <div className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    "https://i.pinimg.com/736x/4e/75/2c/4e752cf9c1e29ec3105e1f2c2049cca5.jpg"
                  }
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {session?.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col items-start text-left">
                <span className="text-sm font-medium">{session?.user.name}</span>
                {/* <span className="text-xs text-muted-foreground">{user?.role === "super_admin" ? "Super Admin" : "Admin"}</span> */}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/" target="_blank">
                <Home className="mr-2 h-4 w-4" />
                Voir le site
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleClick}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Deconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card border-r border-border transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-card border-r border-border lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
