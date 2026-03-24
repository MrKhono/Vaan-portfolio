import { AdminShell } from "@/components/admin/admin-shell"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ProfileCard        from "./ProfileCard"
import EditProfileForm    from "./EditProfileForm"
import ChangePasswordForm from "./ChangePasswordForm"

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/admin/login")

  const user = {
    id:        session.user.id,
    name:      session.user.name,
    email:     session.user.email,
    image:     session.user.image ?? null,
    createdAt: session.user.createdAt,
  }

  return (
    <AdminShell title="Mon profil" description="Gérez vos informations personnelles">
      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileCard user={user} />
        <EditProfileForm user={user} />
        <ChangePasswordForm />
      </div>
    </AdminShell>
  )
}