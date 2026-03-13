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
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/admin-store"
import type { Testimonial } from "@/lib/data"
import { Plus, Loader2, Pencil, Trash2, Star, Quote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const emptyTestimonial = {
  name: "",
  role: "",
  content: "",
  rating: 5,
}

function TestimonialsContent() {
  const searchParams = useSearchParams()
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyTestimonial)
  const { toast } = useToast()

  useEffect(() => {
    setTestimonialsState(getTestimonials())
    setIsLoading(false)

    const isNew = searchParams.get("new")
    if (isNew) {
      setEditingTestimonial(null)
      setFormData(emptyTestimonial)
      setIsDialogOpen(true)
    }
  }, [searchParams])

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating,
      })
    } else {
      setEditingTestimonial(null)
      setFormData(emptyTestimonial)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTestimonial(null)
    setFormData(emptyTestimonial)
    window.history.replaceState({}, "", "/admin/testimonials")
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom et le contenu sont requis.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingTestimonial) {
        updateTestimonial(editingTestimonial.id, formData)
        toast({
          title: "Temoignage modifie",
          description: "Le temoignage a ete mis a jour avec succes.",
        })
      } else {
        addTestimonial(formData)
        toast({
          title: "Temoignage ajoute",
          description: "Le nouveau temoignage a ete cree avec succes.",
        })
      }
      setTestimonialsState(getTestimonials())
      handleCloseDialog()
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le temoignage.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    if (!deletingId) return
    try {
      deleteTestimonial(deletingId)
      setTestimonialsState(getTestimonials())
      toast({
        title: "Temoignage supprime",
        description: "Le temoignage a ete supprime avec succes.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le temoignage.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <AdminShell title="Temoignages" description="Gerez les avis de vos clients">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Temoignages"
      description="Gerez les avis de vos clients"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau temoignage
        </Button>
      }
    >
      {/* Testimonials grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardContent className="p-6">
              <Quote className="absolute right-4 top-4 h-8 w-8 text-muted-foreground/20" />

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
                    onClick={() => {
                      setDeletingId(testimonial.id)
                      setIsDeleteOpen(true)
                    }}
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
              <Quote className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucun temoignage</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ajoutez les avis de vos clients satisfaits
              </p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un temoignage
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Modifier le temoignage" : "Nouveau temoignage"}
            </DialogTitle>
            <DialogDescription>
              {editingTestimonial
                ? "Modifiez les informations du temoignage"
                : "Ajoutez un nouveau temoignage client"}
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
                <Label htmlFor="role">Role / Titre</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Mariee"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Temoignage *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Le temoignage de votre client..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Note</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= formData.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingTestimonial ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce temoignage ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Le temoignage sera definitivement supprime.
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
      <AdminShell title="Temoignages" description="Gerez les avis de vos clients">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    }>
      <TestimonialsContent />
    </Suspense>
  )
}
