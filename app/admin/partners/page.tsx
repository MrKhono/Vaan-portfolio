"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { ImageUpload } from "@/components/admin/image-upload"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  getPartners,
  addPartner,
  updatePartner,
  deletePartner,
  type Partner,
} from "@/lib/admin-store"
import { Plus, Loader2, Pencil, Trash2, Handshake, ExternalLink, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const emptyPartner = {
  name: "",
  logo: "",
  website: "",
}

export default function AdminPartnersPage() {
  const [partners, setPartnersState] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyPartner)
  const { toast } = useToast()

  useEffect(() => {
    setPartnersState(getPartners())
    setIsLoading(false)
  }, [])

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner)
      setFormData({
        name: partner.name,
        logo: partner.logo,
        website: partner.website || "",
      })
    } else {
      setEditingPartner(null)
      setFormData(emptyPartner)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingPartner(null)
    setFormData(emptyPartner)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du partenaire est requis.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingPartner) {
        updatePartner(editingPartner.id, formData)
        toast({
          title: "Partenaire modifie",
          description: "Le partenaire a ete mis a jour avec succes.",
        })
      } else {
        addPartner(formData)
        toast({
          title: "Partenaire ajoute",
          description: "Le nouveau partenaire a ete cree avec succes.",
        })
      }
      setPartnersState(getPartners())
      handleCloseDialog()
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le partenaire.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    if (!deletingId) return
    try {
      deletePartner(deletingId)
      setPartnersState(getPartners())
      toast({
        title: "Partenaire supprime",
        description: "Le partenaire a ete supprime avec succes.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le partenaire.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <AdminShell title="Partenaires" description="Gerez vos partenaires et collaborateurs">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Partenaires"
      description="Gerez vos partenaires et collaborateurs"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau partenaire
        </Button>
      }
    >
      {/* Partners grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {partners.map((partner) => (
          <Card key={partner.id} className="group">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Logo */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  ) : (
                    <Handshake className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                <h3 className="font-semibold">{partner.name}</h3>

                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Site web
                  </a>
                )}

                <div className="mt-4 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(partner)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      setDeletingId(partner.id)
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

        {partners.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Handshake className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucun partenaire</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ajoutez vos partenaires et collaborateurs
              </p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un partenaire
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
              {editingPartner ? "Modifier le partenaire" : "Nouveau partenaire"}
            </DialogTitle>
            <DialogDescription>
              {editingPartner
                ? "Modifiez les informations du partenaire"
                : "Ajoutez un nouveau partenaire"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du partenaire *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Canon France"
              />
            </div>

            <ImageUpload
              label="Logo"
              value={formData.logo}
              onChange={(value) => setFormData({ ...formData, logo: value })}
              aspectRatio="square"
              description="Logo du partenaire (format carre recommande)"
            />

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.canon.fr"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingPartner ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce partenaire ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Le partenaire sera definitivement supprime.
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
