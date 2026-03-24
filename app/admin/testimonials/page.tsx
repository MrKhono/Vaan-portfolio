"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  getTestimonialsAction,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  type Testimonial,
  type TestimonialData,
} from "@/actions/testimonial.actions"
import { Plus, Loader2, Pencil, Trash2, Quote } from "lucide-react"
import { toast } from "sonner";

const emptyTestimonial: TestimonialData = {
  name:    "",
  title:   "",
  content: "",
}

function TestimonialsContent() {
  const searchParams = useSearchParams()
  const [testimonials, setTestimonials]       = useState<Testimonial[]>([])
  const [isLoading, setIsLoading]             = useState(true)
  const [isDialogOpen, setIsDialogOpen]       = useState(false)
  const [isDeleteOpen, setIsDeleteOpen]       = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deletingId, setDeletingId]           = useState<string | null>(null)
  const [formData, setFormData]               = useState<TestimonialData>(emptyTestimonial)
  const [isSaving, setIsSaving]               = useState(false)
 

  async function loadTestimonials() {
    try {
      const data = await getTestimonialsAction()
      setTestimonials(data)
    } catch {
      toast.error("Impossible de charger les témoignages");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
    if (searchParams.get("new")) {
      setEditingTestimonial(null)
      setFormData(emptyTestimonial)
      setIsDialogOpen(true)
    }
  }, [searchParams])

  function handleOpenDialog(testimonial?: Testimonial) {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({
        name:    testimonial.name,
        title:   testimonial.title,
        content: testimonial.content,
      })
    } else {
      setEditingTestimonial(null)
      setFormData(emptyTestimonial)
    }
    setIsDialogOpen(true)
  }

  function handleCloseDialog() {
    setIsDialogOpen(false)
    setEditingTestimonial(null)
    setFormData(emptyTestimonial)
    window.history.replaceState({}, "", "/admin/testimonials")
  }

  async function handleSave() {
    setIsSaving(true)

    const result = editingTestimonial
      ? await updateTestimonialAction(editingTestimonial.id, formData)
      : await createTestimonialAction(formData)

    if (result.success) {
      if (result.success) {
        if (editingTestimonial) {
          toast.success("Le témoignage a été mis à jour avec succès.")
        } else {
          toast.success("Le nouveau témoignage a été créé avec succès");
        }
      }
      await loadTestimonials()
      handleCloseDialog()
    } else {
      toast.error("Impossible d'enregistrer le témoignage");
    }
    setIsSaving(false)
  }

  async function handleDelete() {
    if (!deletingId) return

    const result = await deleteTestimonialAction(deletingId)

    if (result.success) {
      toast.success("Le témoignage a été supprimé avec succès");
      await loadTestimonials()
    } else {
      toast.error(result.error)
    }

    setIsDeleteOpen(false)
    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <AdminShell title="Témoignages" description="Gérez les avis de vos clients">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Témoignages"
      description="Gérez les avis de vos clients"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau témoignage
        </Button>
      }
    >
      {/* Grille des témoignages */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardContent className="p-6">
              <Quote className="absolute right-4 top-4 h-8 w-8 text-muted-foreground/20" />

              <p className="mb-4 line-clamp-4 text-sm text-muted-foreground">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  {testimonial.title && (
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(testimonial)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => { setDeletingId(testimonial.id); setIsDeleteOpen(true) }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {testimonials.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Quote className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">Aucun témoignage</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajoutez les avis de vos clients satisfaits
              </p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un témoignage
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog création / édition */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Modifier le témoignage" : "Nouveau témoignage"}
            </DialogTitle>
            <DialogDescription>
              {editingTestimonial
                ? "Modifiez les informations du témoignage"
                : "Ajoutez un nouveau témoignage client"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sophie Beaumont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre / Rôle</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mariée"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Témoignage *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Le témoignage de votre client..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                editingTestimonial ? "Enregistrer" : "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce témoignage ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le témoignage sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}

export default function AdminTestimonialsPage() {
  return (
    <Suspense fallback={
      <AdminShell title="Témoignages" description="Gérez les avis de vos clients">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    }>
      <TestimonialsContent />
    </Suspense>
  )
}