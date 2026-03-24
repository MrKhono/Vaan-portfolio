"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Loader2, Users } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import {
  getUsersAction,
  deleteUserAction,
  type AdminUser,
} from "@/actions/user.actions"
import { AdminDeleteDialog } from "./admin-delete-dialog"
import { AdminUserCard } from "./admin-user-card"
import { AdminUserForm } from "./admin-user-form"

export default function AdminAdminsPage() {
  const { data: session }         = useSession()
  const [users, setUsers]         = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen]       = useState(false)
  const [isDeleteOpen, setIsDeleteOpen]   = useState(false)
  const [deletingId, setDeletingId]       = useState<string | null>(null)

  async function loadUsers() {
    try {
      const data = await getUsersAction()
      setUsers(data)
    } catch {
      toast.error("Impossible de charger les utilisateurs.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  function handleDeleteClick(id: string) {
    setDeletingId(id)
    setIsDeleteOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!deletingId) return

    const result = await deleteUserAction(deletingId)

    if (result.success) {
      toast.success("L'utilisateur a été supprimé avec succès.")
      await loadUsers()
    } else {
      toast.error(result.error ?? "Impossible de supprimer l'utilisateur.")
    }

    setIsDeleteOpen(false)
    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <AdminShell title="Administrateurs" description="Gérez les accès au panel d'administration">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Administrateurs"
      description="Gérez les accès au panel d'administration"
      actions={
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel administrateur
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <AdminUserCard
            key={user.id}
            user={user}
            isCurrentUser={user.id === session?.user.id}
            onDelete={handleDeleteClick}
          />
        ))}

        {users.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">Aucun administrateur</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajoutez des administrateurs pour gérer le site
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <AdminUserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={loadUsers}
      />

      <AdminDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
      />
    </AdminShell>
  )
}