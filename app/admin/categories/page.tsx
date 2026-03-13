"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { ImageUpload } from "@/components/admin/image-upload"
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
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  type CategoryItem,
} from "@/lib/admin-store"
import { Plus, Loader2, Pencil, Trash2, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const emptyForm = {
  value: "",
  label: "",
  image: "",
  description: "",
}

export default function AdminCategoriesPage() {
  const [categories, setCategoriesState] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const { toast } = useToast()

  useEffect(() => {
    setCategoriesState(getCategories())
    setIsLoading(false)
  }, [])

  const handleOpenDialog = (category?: CategoryItem) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        value: category.value,
        label: category.label,
        image: category.image,
        description: category.description,
      })
    } else {
      setEditingCategory(null)
      setFormData(emptyForm)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    setFormData(emptyForm)
  }

  const handleSave = () => {
    if (!formData.label.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du domaine est requis.",
        variant: "destructive",
      })
      return
    }

    // Auto-generate slug if not provided
    const finalValue = formData.value.trim() || formData.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    try {
      if (editingCategory) {
        updateCategory(editingCategory.id, { ...formData, value: finalValue })
        toast({
          title: "Domaine modifie",
          description: "Le domaine a ete mis a jour avec succes.",
        })
      } else {
        addCategory({ ...formData, value: finalValue })
        toast({
          title: "Domaine ajoute",
          description: "Le nouveau domaine a ete cree avec succes.",
        })
      }
      setCategoriesState(getCategories())
      handleCloseDialog()
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le domaine.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    if (!deletingId) return
    try {
      deleteCategory(deletingId)
      setCategoriesState(getCategories())
      toast({
        title: "Domaine supprime",
        description: "Le domaine a ete supprime avec succes.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le domaine.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <AdminShell title="Domaines" description="Gerez vos categories de photographie">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Domaines"
      description="Gerez vos categories de photographie"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau domaine
        </Button>
      }
    >
      {/* Categories grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.id} className="group overflow-hidden">
            <div className="relative aspect-[4/3]">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-serif text-lg font-semibold text-white">{category.label}</h3>
                <p className="text-sm text-white/80 line-clamp-1">{category.description}</p>
              </div>
            </div>
            <CardContent className="flex items-center justify-between p-3">
              <span className="text-xs text-muted-foreground font-mono">{category.value}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleOpenDialog(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => {
                    setDeletingId(category.id)
                    setIsDeleteOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucun domaine</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Commencez par ajouter un domaine de photographie
              </p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un domaine
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier le domaine" : "Nouveau domaine"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modifiez les informations du domaine"
                : "Ajoutez un nouveau domaine de photographie"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="label">Nom du domaine *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Mariage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Identifiant (slug)</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="mariage"
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour generer automatiquement
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Immortalisez le plus beau jour de votre vie"
                rows={3}
              />
            </div>

            <ImageUpload
              label="Image du domaine"
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
              aspectRatio="video"
              description="Format recommande: 800x600px"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce domaine ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Le domaine sera definitivement supprime.
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
