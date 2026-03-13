'use client';

import { ReactNode } from "react";
import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  const noLayoutPages = [
    "/admin",
    "/admin/appointments",
    "/admin/availability",
    "/admin/categories",
    "/admin/experience",
    "/admin/hero",
    "/admin/login",
    "/admin/notifications",
    "/admin/partners",
    "/admin/portfolio",
    "/admin/profile",
    "/admin/projects",
    "/admin/services",
    "/admin/settings",
    "/admin/testimonials",
    "/admin/about",
    "/admin/admins",
  ];

  const hideLayout = noLayoutPages.includes(pathname);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}