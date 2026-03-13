// app/admin/profile/page.tsx
import AdminProfilePageClient from "./AdminProfilePageClient"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminProfilePage() {
 const session = await auth.api.getSession({
  headers: await headers()
 })

  if (!session) redirect("/admin/login")

  return <AdminProfilePageClient session={session} />
}