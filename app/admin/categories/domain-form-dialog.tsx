"use client"

import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import { Loader2 } from "lucide-react"
import type { Domain, DomainData } from "@/actions/domain.actions"

const emptyForm: DomainData = {
  name:        "",
  slug:        "",
  description: "",
  image:       "",
}

interface DomainFormDialogProps {
  open:          boolean
  editingDomain: Domain | null
  onClose:       () => void
  onSave:        (data: DomainData) => Promise<void>
  isSaving:      boolean
}

export function DomainFormDialog({
  open,
  editingDomain,
  onClose,
  onSave,
  isSaving,
}: DomainFormDialogProps) {
  const [formData, setFormData] = useState<DomainData>(emptyForm)

  // Sync quand le domaine édité change
  useEffect(() => {
    if (editingDomain) {
      setFormData({
        name:        editingDomain.name,
        slug:        editingDomain.slug,
        description: editingDomain.description,
        image:       editingDomain.image,
      })
    } else {
      setFormData(emptyForm)
    }
  }, [editingDomain, open])

  function handleNameChange(name: string) {
    setFormData((prev) => ({
      ...prev,
      name,
      // Auto-slug uniquement à la création
      ...(!editingDomain && {
        slug: name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }),
    }))
  }

  function handleClose() {
    setFormData(emptyForm)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingDomain ? "Modifier le domaine" : "Nouveau domaine"}
          </DialogTitle>
          <DialogDescription>
            {editingDomain
              ? "Modifiez les informations du domaine"
              : "Ajoutez un nouveau domaine de photographie"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du domaine *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Mariage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Identifiant (slug)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="mariage"
              />
              <p className="text-xs text-muted-foreground">
                Laissez vide pour générer automatiquement
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
            description="Format recommandé : 800x600px"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Annuler</Button>
          <Button onClick={() => onSave(formData)} disabled={isSaving}>
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
            ) : (
              editingDomain ? "Enregistrer" : "Ajouter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}