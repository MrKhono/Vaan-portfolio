// app/admin/profile/page.tsx
import AdminProfilePageClient from "./AdminProfilePageClient"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function AdminProfilePage() {
 const session = await auth.api.getSession({
  headers: await headers()
 })

  if (!session) {
    return <p className="text-destructive text-center py-12">Non autorisé</p>
  }

  return <AdminProfilePageClient session={session} />
}