"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Settings,
  Users,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Home,
  Calendar,
  CalendarCheck,
} from "lucide-react";
import { getPendingAppointmentsCountAction } from "@/actions/appointment.actions";
import { getCurrentUserAction, type AdminUser } from "@/actions/user.actions";
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
  { name: "Disponibilités", href: "/admin/availability", icon: Calendar },
  { name: "Section Hero", href: "/admin/hero", icon: Image },
  { name: "Domaines", href: "/admin/categories", icon: FolderOpen },
  { name: "Portfolio", href: "/admin/portfolio", icon: Camera },
  { name: "Projets", href: "/admin/projects", icon: FolderOpen },
  { name: "À propos", href: "/admin/about", icon: User },
  { name: "Témoignages", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Expérience", href: "/admin/experience", icon: Award },
  { name: "Partenaires", href: "/admin/partners", icon: Handshake },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Administrateurs", href: "/admin/admins", icon: Users },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Charge les données fraîches depuis la BDD
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUserAction();
        setCurrentUser(user);
      } catch {
        // silencieux
      }
    }
    loadUser();
  }, []);

  // Recharge quand la session change
  useEffect(() => {
    if (!session?.user) return;
    async function loadUser() {
      try {
        const user = await getCurrentUserAction();
        setCurrentUser(user);
      } catch {
        // silencieux
      }
    }
    loadUser();
  }, [session?.user?.id]);

  const name = currentUser?.name ?? session?.user?.name ?? "";
  const email = currentUser?.email ?? session?.user?.email ?? "";
  const image = currentUser?.image ?? session?.user?.image ?? "";
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "AD";

  useEffect(() => {
    async function updateCounts() {
      try {
        const count = await getPendingAppointmentsCountAction();
        setPendingCount(count);
      } catch {
        // silencieux
      }
    }
    updateCounts();
    const interval = setInterval(updateCounts, 60_000);
    return () => clearInterval(interval);
  }, []);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // silencieux
    } finally {
      // Supprime le cookie côté client avant de rediriger
      document.cookie = "better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = "__Secure-better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure";

      toast.success("Déconnexion réussie !");
      window.location.href = "/admin/login"; // hard redirect — pas router.push
    }
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-lg">
          <img
            src="/sno.png"
            alt="Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-lg font-semibold">Admin</span>
          <span className="truncate text-xs text-muted-foreground">{name}</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const badgeValue = item.badge === "appointments" ? pendingCount : 0;

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
                <item.icon className="h-4 w-4 shrink-0" />
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
                    {badgeValue > 99 ? "99+" : badgeValue}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User menu */}
      <div className="shrink-0 border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                <span className="w-full truncate text-sm font-medium">
                  {name}
                </span>
                <span className="w-full truncate text-xs text-muted-foreground">
                  {email}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
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
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-full flex-col overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
