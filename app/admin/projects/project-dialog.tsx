"use client"

import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Project, ProjectData } from "@/actions/project.actions"
import { Domain } from "@/actions/domain.actions"
import { ProjectForm } from "./project-form"
import { emptyProject } from "./project-constants"

interface ProjectDialogProps {
  open:           boolean
  onClose:        () => void
  onSave:         (data: ProjectData) => Promise<void>
  editingProject: Project | null
  domains:        Domain[]
  isSaving:       boolean
}

export function ProjectDialog({
  open,
  onClose,
  onSave,
  editingProject,
  domains,
  isSaving,
}: ProjectDialogProps) {
  const [formData, setFormData] = useState<ProjectData>(emptyProject)

  // Sync formData quand le projet édité change
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title:       editingProject.title,
        description: editingProject.description,
        coverImage:  editingProject.coverImage,
        images:      editingProject.images,
        date:        editingProject.date,
        location:    editingProject.location,
        client:      editingProject.client,
        camera:      editingProject.camera,
        lens:        editingProject.lens,
        domainId:    editingProject.domainId,
      })
    } else {
      setFormData({ ...emptyProject, domainId: domains[0]?.id ?? "" })
    }
  }, [editingProject, domains, open])

  function handleClose() {
    setFormData(emptyProject)
    onClose()
  }

  async function handleSubmit() {
    await onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingProject ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
          <DialogDescription>
            {editingProject
              ? "Modifiez les informations du projet"
              : "Ajoutez un nouveau projet à votre portfolio"}
          </DialogDescription>
        </DialogHeader>

        <ProjectForm
          formData={formData}
          onChange={setFormData}
          domains={domains}
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || domains.length === 0}>
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
            ) : (
              editingProject ? "Enregistrer" : "Créer le projet"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}