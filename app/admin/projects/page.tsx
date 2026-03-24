"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { createProjectAction, deleteProjectAction, getProjectsAction, Project, ProjectData, updateProjectAction } from "@/actions/project.actions"
import { Domain, getDomainsAction } from "@/actions/domain.actions"
import { ProjectDeleteDialog } from "./project-delete-dialog"
import { ProjectDialog } from "./project-dialog"
import { ProjectsTable } from "./projects-table"
import { toast } from "sonner";


export const emptyProject: ProjectData = {
  title:       "",
  description: "",
  coverImage:  "",
  images:      [],
  date:        "",
  location:    "",
  client:      "",
  camera:      "",
  lens:        "",
  domainId:    "",
}

function ProjectsContent() {
  const searchParams = useSearchParams()
  const [projects, setProjects]   = useState<Project[]>([])
  const [domains, setDomains]     = useState<Domain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen]     = useState(false)
  const [isDeleteOpen, setIsDeleteOpen]     = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingId, setDeletingId]         = useState<string | null>(null)
  const [isSaving, setIsSaving]             = useState(false)
  

  async function loadData() {
    try {
      const [p, d] = await Promise.all([getProjectsAction(), getDomainsAction()])
      setProjects(p)
      setDomains(d)
    } catch {
      toast.error("Impossoble de charger les données");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (isLoading) return
    const isNew  = searchParams.get("new")
    const editId = searchParams.get("edit")
    if (isNew)    { handleOpenDialog() }
    else if (editId) {
      const project = projects.find((p) => p.id === editId)
      if (project) handleOpenDialog(project)
    }
  }, [isLoading, searchParams])

  function handleOpenDialog(project?: Project) {
    setEditingProject(project ?? null)
    setIsDialogOpen(true)
  }

  function handleCloseDialog() {
    setIsDialogOpen(false)
    setEditingProject(null)
    window.history.replaceState({}, "", "/admin/projects")
  }

  async function handleSave(formData: ProjectData) {
    setIsSaving(true)

    const result = editingProject
      ? await updateProjectAction(editingProject.id, formData)
      : await createProjectAction(formData)

    if (result.success) {
      if (editingProject) {
        toast.success("Le projet a été mis à jour avec succès.");
      }else{
        toast.success("Le nouveau projet a été créé avec succès.");
      }
      await loadData()
      handleCloseDialog()
    } else {
      toast.error("Impossible d'enregistrer")
    }

    setIsSaving(false)
  }

  async function handleDelete() {
    if (!deletingId) return

    const result = await deleteProjectAction(deletingId)

    if (result.success) {
      toast.success("Le projet a été supprimé avec succès.")
      await loadData()
    } else {
      toast.error(result.error)
    }

    setIsDeleteOpen(false)
    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <AdminShell title="Projets" description="Gérez vos projets photo">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Projets"
      description="Gérez vos projets photo"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      }
    >
      <ProjectsTable
        projects={projects}
        domains={domains}
        onEdit={handleOpenDialog}
        onDelete={(id) => { setDeletingId(id); setIsDeleteOpen(true) }}
      />

      <ProjectDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingProject={editingProject}
        domains={domains}
        isSaving={isSaving}
      />

      <ProjectDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
      />
    </AdminShell>
  )
}

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={
      <AdminShell title="Projets" description="Gérez vos projets photo">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    }>
      <ProjectsContent />
    </Suspense>
  )
}