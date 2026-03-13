"use client"

import { useAuth } from "@/components/admin/auth-context"
import { AdminShell } from "@/components/admin/admin-shell"
import { Loader2 } from "lucide-react"
import ProfileCard from "./ProfileCard"
import EditProfileForm from "./EditProfileForm"
import ChangePasswordForm from "./ChangePasswordForm"

export default function AdminProfilePageClient({ session }: { session: any }) {
  const { user } = useAuth() 
  
  if (!user) {
    return (
      <AdminShell title="Mon profil" description="Gérez vos informations personnelles">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Mon profil" description="Gérez vos informations personnelles">
      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileCard user={user} />
        <EditProfileForm user={user} />
        <ChangePasswordForm user={user} />
      </div>
    </AdminShell>
  )
}