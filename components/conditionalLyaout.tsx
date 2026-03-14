'use client'

import { ReactNode } from "react"
import { usePathname } from 'next/navigation'

interface ConditionalLayoutProps {
  children: ReactNode
  navbar: ReactNode
  footer: ReactNode
}

export default function ConditionalLayout({
  children,
  navbar,
  footer,
}: ConditionalLayoutProps) {
  const pathname = usePathname()

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
  ]

  const hideLayout = noLayoutPages.includes(pathname)

  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <div>
      {navbar}
      {children}
      {footer}
    </div>
  )
}