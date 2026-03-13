"use client"

import { useEffect, useState } from "react"
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
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  type Experience,
} from "@/lib/admin-store"
import { Plus, Loader2, Pencil, Trash2, Award, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const emptyExperience = {
  year: "",
  title: "",
  description: "",
}

export default function AdminExperiencePage() {
  const [experiences, setExperiencesState] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyExperience)
  const { toast } = useToast()

  useEffect(() => {
    setExperiencesState(getExperiences())
    setIsLoading(false)
  }, [])

  const handleOpenDialog = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        year: experience.year,
        title: experience.title,
        description: experience.description,
      })
    } else {
      setEditingExperience(null)
      setFormData(emptyExperience)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingExperience(null)
    setFormData(emptyExperience)
  }

  const handleSave = () => {
    if (!formData.year.trim() || !formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "L'annee et le titre sont requis.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingExperience) {
        updateExperience(editingExperience.id, formData)
        toast({
          title: "Experience modifiee",
          description: "L'experience a ete mise a jour avec succes.",
        })
      } else {
        addExperience(formData)
        toast({
          title: "Experience ajoutee",
          description: "La nouvelle experience a ete creee avec succes.",
        })
      }
      setExperiencesState(getExperiences())
      handleCloseDialog()
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'experience.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    if (!deletingId) return
    try {
      deleteExperience(deletingId)
      setExperiencesState(getExperiences())
      toast({
        title: "Experience supprimee",
        description: "L'experience a ete supprimee avec succes.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'experience.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingId(null)
    }
  }

  // Sort experiences by year (most recent first)
  const sortedExperiences = [...experiences].sort((a, b) => 
    parseInt(b.year) - parseInt(a.year)
  )

  if (isLoading) {
    return (
      <AdminShell title="Experience" description="Gerez votre parcours et vos realisations">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Experience"
      description="Gerez votre parcours et vos realisations"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle experience
        </Button>
      }
    >
      {/* Timeline */}
      <Card>
        <CardContent className="p-6">
          {sortedExperiences.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border" />

              <div className="space-y-6">
                {sortedExperiences.map((experience, index) => (
                  <div key={experience.id} className="relative flex gap-4">
                    {/* Year badge */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      {experience.year}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{experience.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {experience.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDialog(experience)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              setDeletingId(experience.id)
                              setIsDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucune experience</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ajoutez vos realisations et etapes importantes
              </p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une experience
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? "Modifier l'experience" : "Nouvelle experience"}
            </DialogTitle>
            <DialogDescription>
              {editingExperience
                ? "Modifiez les informations de l'experience"
                : "Ajoutez une nouvelle etape a votre parcours"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="year">Annee *</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Prix du meilleur photographe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Decrivez cette experience..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingExperience ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette experience ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. L&apos;experience sera definitivement supprimee.
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
