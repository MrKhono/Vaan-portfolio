"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Loader2, Images } from "lucide-react"
import { toast } from "sonner"
import {
  getHomeGalleryPhotosAction,
  createHomeGalleryPhotosAction,
  updateHomeGalleryPhotoAction,
  deleteHomeGalleryPhotoAction,
  type HomeGalleryPhoto,
  type HomeGalleryPhotoData,
} from "@/actions/home-gallery.actions"
import { PhotoCard }         from "./_components/photo-card"
import { PhotoFormDialog }   from "./_components/photo-form-dialog"
import { PhotoDeleteDialog } from "./_components/photo-delete-dialog"

const MAX_PHOTOS = 15

export default function HomeGalleryPage() {
  const [photos, setPhotos]             = useState<HomeGalleryPhoto[]>([])
  const [isLoading, setIsLoading]       = useState(true)
  const [isFormOpen, setIsFormOpen]     = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<HomeGalleryPhoto | null>(null)
  const [deletingId, setDeletingId]     = useState<string | null>(null)
  const [isSaving, setIsSaving]         = useState(false)

  const remainingSlots = MAX_PHOTOS - photos.length

  async function loadPhotos() {
    try {
      const data = await getHomeGalleryPhotosAction()
      setPhotos(data)
    } catch {
      toast.error("Impossible de charger les photos.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadPhotos() }, [])

  function handleOpenCreate() {
    if (photos.length >= MAX_PHOTOS) {
      toast.error(`Limite atteinte : ${MAX_PHOTOS} photos maximum.`)
      return
    }
    setEditingPhoto(null)
    setIsFormOpen(true)
  }

  function handleOpenEdit(photo: HomeGalleryPhoto) {
    setEditingPhoto(photo)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setIsFormOpen(false)
    setEditingPhoto(null)
  }

  async function handleSave(formData: HomeGalleryPhotoData) {
    if (!editingPhoto) return
    setIsSaving(true)

    const result = await updateHomeGalleryPhotoAction(editingPhoto.id, formData)

    if (result.success) {
      toast.success("Photo modifiée")
      await loadPhotos()
      handleCloseForm()
    } else {
      toast.error(result.error ?? "Impossible d'enregistrer la photo.")
    }

    setIsSaving(false)
  }

  async function handleSaveMultiple(images: string[]) {
    if (images.length === 0) return
    setIsSaving(true)

    const result = await createHomeGalleryPhotosAction(images)

    if (result.success) {
      toast.success(`${result.count} photo${result.count! > 1 ? "s ajoutées" : " ajoutée"}`)
      await loadPhotos()
      handleCloseForm()
    } else {
      toast.error(result.error ?? "Impossible d'ajouter les photos.")
    }

    setIsSaving(false)
  }

  async function handleDelete() {
    if (!deletingId) return

    const result = await deleteHomeGalleryPhotoAction(deletingId)

    if (result.success) {
      toast.success("La photo a été supprimée.")
      await loadPhotos()
    } else {
      toast.error(result.error ?? "Impossible de supprimer la photo.")
    }

    setIsDeleteOpen(false)
    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <AdminShell title="Galerie d'accueil" description="Gérez les photos affichées sur la page d'accueil">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Galerie d'accueil"
      description={`Gérez les photos de la page d'accueil (${photos.length}/${MAX_PHOTOS})`}
      actions={
        <Button onClick={handleOpenCreate} disabled={photos.length >= MAX_PHOTOS}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter des photos
        </Button>
      }
    >
      {photos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Images className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-medium">Aucune photo</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Commencez par ajouter des photos à votre galerie d&apos;accueil
            </p>
            <Button className="mt-4" onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter des photos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              onEdit={handleOpenEdit}
              onDelete={(id) => { setDeletingId(id); setIsDeleteOpen(true) }}
            />
          ))}
        </div>
      )}

      <PhotoFormDialog
        open={isFormOpen}
        editingPhoto={editingPhoto}
        isSaving={isSaving}
        remainingSlots={remainingSlots}
        onClose={handleCloseForm}
        onSave={handleSave}
        onSaveMultiple={handleSaveMultiple}
      />

      <PhotoDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
      />
    </AdminShell>
  )
}