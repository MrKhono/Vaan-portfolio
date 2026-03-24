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
  getExperiencesAction,
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
  type Experience,
  type ExperienceData,
} from "@/actions/experience.actions"
import { Plus, Loader2, Pencil, Trash2, Award } from "lucide-react"
import { toast } from "sonner";

const emptyExperience: ExperienceData = {
  year:        "",
  title:       "",
  description: "",
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences]         = useState<Experience[]>([])
  const [isLoading, setIsLoading]             = useState(true)
  const [isDialogOpen, setIsDialogOpen]       = useState(false)
  const [isDeleteOpen, setIsDeleteOpen]       = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [deletingId, setDeletingId]           = useState<string | null>(null)
  const [formData, setFormData]               = useState<ExperienceData>(emptyExperience)
  const [isSaving, setIsSaving]               = useState(false)
  

  async function loadExperiences() {
    try {
      const data = await getExperiencesAction()
      setExperiences(data)
    } catch {
      toast.error("Impossible de charger les expériences.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadExperiences() }, [])

  function handleOpenDialog(experience?: Experience) {
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        year:        experience.year,
        title:       experience.title,
        description: experience.description,
      })
    } else {
      setEditingExperience(null)
      setFormData(emptyExperience)
    }
    setIsDialogOpen(true)
  }

  function handleCloseDialog() {
    setIsDialogOpen(false)
    setEditingExperience(null)
    setFormData(emptyExperience)
  }

  async function handleSave() {
    setIsSaving(true)

    const result = editingExperience
      ? await updateExperienceAction(editingExperience.id, formData)
      : await createExperienceAction(formData)

    if (result.success) {
      if (editingExperience) {
        toast.success("L'expérience a été mise à jour avec succès.")
      }else{
        toast.success("La nouvelle expérience a été créée avec succès.")
      }
      await loadExperiences()
      handleCloseDialog()
    } else {
      toast.error("Impossible d'enregistrer l'expérience.")
    }

    setIsSaving(false)
  }

  async function handleDelete() {
    if (!deletingId) return

    const result = await deleteExperienceAction(deletingId)

    if (result.success) {
      toast.success("L'expérience a été supprimé avec succès.")
      await loadExperiences()
    } else {
      toast.error(result.error)
    }

    setIsDeleteOpen(false)
    setDeletingId(null)
  }

  // Tri par année décroissante
  const sortedExperiences = [...experiences].sort(
    (a, b) => parseInt(b.year) - parseInt(a.year)
  )

  if (isLoading) {
    return (
      <AdminShell title="Expérience" description="Gérez votre parcours et vos réalisations">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Expérience"
      description="Gérez votre parcours et vos réalisations"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle expérience
        </Button>
      }
    >
      <Card>
        <CardContent className="p-6">
          {sortedExperiences.length > 0 ? (
            <div className="relative">
              {/* Ligne de timeline */}
              <div className="absolute bottom-0 left-[27px] top-0 w-px bg-border" />

              <div className="space-y-6">
                {sortedExperiences.map((experience) => (
                  <div key={experience.id} className="relative flex gap-4">
                    {/* Badge année */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {experience.year}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{experience.title}</h3>
                          {experience.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {experience.description}
                            </p>
                          )}
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
                            onClick={() => { setDeletingId(experience.id); setIsDeleteOpen(true) }}
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
              <Award className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">Aucune expérience</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajoutez vos réalisations et étapes importantes
              </p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une expérience
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog création / édition */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? "Modifier l'expérience" : "Nouvelle expérience"}
            </DialogTitle>
            <DialogDescription>
              {editingExperience
                ? "Modifiez les informations de l'expérience"
                : "Ajoutez une nouvelle étape à votre parcours"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="year">Année *</Label>
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
                placeholder="Décrivez cette expérience..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                editingExperience ? "Enregistrer" : "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette expérience ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;expérience sera définitivement supprimée.
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