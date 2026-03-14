"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  FolderOpen,
  MessageSquare,
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  Eye,
  ArrowRight,
  Image,
  Award,
  Handshake,
} from "lucide-react";
import {
  getProjects,
  getTestimonials,
  getServices,
  getCategories,
  getExperiences,
  getPartners,
  getAdmins,
} from "@/lib/admin-store";

interface Stats {
  projects: number;
  testimonials: number;
  services: number;
  categories: number;
  experiences: number;
  partners: number;
  admins: number;
}

const quickLinks = [
  {
    name: "Ajouter un projet",
    href: "/admin/projects?new=true",
    icon: Camera,
    color: "bg-blue-500",
  },
  {
    name: "Nouveau temoignage",
    href: "/admin/testimonials?new=true",
    icon: MessageSquare,
    color: "bg-green-500",
  },
  {
    name: "Nouvel article",
    href: "/admin/blog?new=true",
    icon: FileText,
    color: "bg-purple-500",
  },
  {
    name: "Modifier le hero",
    href: "/admin/hero",
    icon: Image,
    color: "bg-orange-500",
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    testimonials: 0,
    services: 0,
    categories: 0,
    experiences: 0,
    partners: 0,
    admins: 0,
  });

  useEffect(() => {
    setStats({
      projects: getProjects().length,
      testimonials: getTestimonials().length,
      services: getServices().length,
      categories: getCategories().length,
      experiences: getExperiences().length,
      partners: getPartners().length,
      admins: getAdmins().length,
    });
  }, []);

  const statCards = [
    {
      name: "Projets",
      value: stats.projects,
      icon: Camera,
      href: "/admin/projects",
      color: "text-blue-500",
    },
    {
      name: "Domaines",
      value: stats.categories,
      icon: FolderOpen,
      href: "/admin/categories",
      color: "text-emerald-500",
    },
    {
      name: "Temoignages",
      value: stats.testimonials,
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "text-amber-500",
    },
    {
      name: "Services",
      value: stats.services,
      icon: Briefcase,
      href: "/admin/services",
      color: "text-purple-500",
    },

    {
      name: "Experiences",
      value: stats.experiences,
      icon: Award,
      href: "/admin/experience",
      color: "text-indigo-500",
    },
    {
      name: "Partenaires",
      value: stats.partners,
      icon: Handshake,
      href: "/admin/partners",
      color: "text-cyan-500",
    },
    {
      name: "Admins",
      value: stats.admins,
      icon: Users,
      href: "/admin/admins",
      color: "text-rose-500",
    },
  ];

  return (
    <AdminShell
      title="Tableau de bord"
      description="Bienvenue dans votre espace d'administration"
      actions={
        <Button asChild>
          <Link href="/" target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            Voir le site
          </Link>
        </Button>
      }
    >
      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="transition-all hover:shadow-md hover:border-primary/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions rapides</CardTitle>
            <CardDescription>
              Acces rapide aux actions courantes
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Button
                key={link.name}
                variant="outline"
                className="justify-start h-auto py-4"
                asChild
              >
                <Link href={link.href}>
                  <div
                    className={`mr-3 rounded-lg p-2 ${link.color} text-white`}
                  >
                    <link.icon className="h-4 w-4" />
                  </div>
                  <span>{link.name}</span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guide de demarrage</CardTitle>
            <CardDescription>
              Conseils pour bien utiliser votre administration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">
                  Personnalisez votre page d&apos;accueil
                </p>
                <p className="text-sm text-muted-foreground">
                  Modifiez la section Hero et les textes de presentation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                2
              </div>
              <div>
                <p className="font-medium">Ajoutez vos projets</p>
                <p className="text-sm text-muted-foreground">
                  Creez des projets avec photos et descriptions detaillees
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Gerez vos temoignages</p>
                <p className="text-sm text-muted-foreground">
                  Ajoutez les avis de vos clients satisfaits
                </p>
              </div>
            </div>
            <Button variant="link" className="mt-2 h-auto p-0" asChild>
              <Link href="/admin/settings">
                Configurer les parametres du site
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

     
    </AdminShell>
  );
}
