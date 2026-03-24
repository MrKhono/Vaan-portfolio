"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import {
  getDomainsAction,
  createDomainAction,
  updateDomainAction,
  deleteDomainAction,
  type Domain,
  type DomainData,
} from "@/actions/domain.actions"
import { DomainCard } from "./domain-card"
import { DomainDeleteDialog } from "./domain-delete-dialog"
import { DomainFormDialog } from "./domain-form-dialog"

export default function AdminCategoriesPage() {
  const [domains, setDomains]             = useState<Domain[]>([])
  const [isLoading, setIsLoading]         = useState(true)
  const [isFormOpen, setIsFormOpen]       = useState(false)
  const [isDeleteOpen, setIsDeleteOpen]   = useState(false)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [deletingId, setDeletingId]       = useState<string | null>(null)
  const [isSaving, setIsSaving]           = useState(false)

  async function loadDomains() {
    try {
      const data = await getDomainsAction()
      setDomains(data)
    } catch {
      toast.error("Impossible de charger les domaines.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadDomains() }, [])

  function handleOpenEdit(domain: Domain) {
    setEditingDomain(domain)
    setIsFormOpen(true)
  }

  function handleOpenCreate() {
    setEditingDomain(null)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setIsFormOpen(false)
    setEditingDomain(null)
  }

  async function handleSave(formData: DomainData) {
    if (!formData.name.trim()) {
      toast.error("Le nom du domaine est requis.")
      return
    }

    setIsSaving(true)

    const result = editingDomain
      ? await updateDomainAction(editingDomain.id, formData)
      : await createDomainAction(formData)

    if (result.success) {
      toast.success(editingDomain ? "Domaine modifié" : "Domaine ajouté")
      await loadDomains()
      handleCloseForm()
    } else {
      toast.error(result.error ?? "Impossible d'enregistrer le domaine.")
    }

    setIsSaving(false)
  }

  async function handleDelete() {
    if (!deletingId) return

    const result = await deleteDomainAction(deletingId)

    if (result.success) {
      toast.success("Le domaine a été supprimé avec succès.")
      await loadDomains()
    } else {
      toast.error(result.error ?? "Impossible de supprimer le domaine.")
    }

    setIsDeleteOpen(false)
    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <AdminShell title="Domaines" description="Gérez vos catégories de photographie">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Domaines"
      description="Gérez vos catégories de photographie"
      actions={
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau domaine
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {domains.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            onEdit={handleOpenEdit}
            onDelete={(id) => { setDeletingId(id); setIsDeleteOpen(true) }}
          />
        ))}

        {domains.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">Aucun domaine</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Commencez par ajouter un domaine de photographie
              </p>
              <Button className="mt-4" onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un domaine
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <DomainFormDialog
        open={isFormOpen}
        editingDomain={editingDomain}
        isSaving={isSaving}
        onClose={handleCloseForm}
        onSave={handleSave}
      />

      <DomainDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
      />
    </AdminShell>
  )
}