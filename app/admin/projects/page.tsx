"use client"

import { useEffect, useState, Suspense, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { ImageUpload, MultiImageUpload } from "@/components/admin/image-upload"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getCategories,
  type CategoryItem,
} from "@/lib/admin-store"
import type { Project, Category } from "@/lib/data"
import { Plus, Loader2, Pencil, Trash2, Eye, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

const emptyProject = {
  title: "",
  category: "mariage" as Category,
  coverImage: "",
  images: [] as string[],
  description: "",
  date: "",
  location: "",
  client: "",
  camera: "",
  lens: "",
}

function ProjectsContent() {
  const searchParams = useSearchParams()
  const [projects, setProjectsState] = useState<Project[]>([])
  const [categories, setCategoriesState] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyProject)
  const { toast } = useToast()

  useEffect(() => {
    const loadedProjects = getProjects()
    const loadedCategories = getCategories()
    setProjectsState(loadedProjects)
    setCategoriesState(loadedCategories)
    setIsLoading(false)

    // Check URL params for actions
    const isNew = searchParams.get("new")
    const editId = searchParams.get("edit")

    if (isNew) {
      setEditingProject(null)
      setFormData({
        ...emptyProject,
        category: loadedCategories[0]?.value as Category || "mariage"
      })
      setIsDialogOpen(true)
    } else if (editId) {
      const project = loadedProjects.find((p) => p.id === editId)
      if (project) {
        setEditingProject(project)
        setFormData({
          title: project.title,
          category: project.category,
          coverImage: project.coverImage,
          images: project.images,
          description: project.description,
          date: project.date,
          location: project.location,
          client: project.client || "",
          camera: project.camera || "",
          lens: project.lens || "",
        })
        setIsDialogOpen(true)
      }
    }
  }, [searchParams])

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        category: project.category,
        coverImage: project.coverImage,
        images: project.images,
        description: project.description,
        date: project.date,
        location: project.location,
        client: project.client || "",
        camera: project.camera || "",
        lens: project.lens || "",
      })
    } else {
      setEditingProject(null)
      setFormData({
        ...emptyProject,
        category: categories[0]?.value as Category || "mariage"
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
    setFormData(emptyProject)
    window.history.replaceState({}, "", "/admin/projects")
  }

  const handleImagesChange = (newImages: string[]) => {
    // Auto-set cover if none exists
    const coverImage = formData.coverImage && newImages.includes(formData.coverImage)
      ? formData.coverImage
      : newImages[0] || ""
    
    setFormData({ ...formData, images: newImages, coverImage })
  }

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du projet est requis.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingProject) {
        updateProject(editingProject.id, formData)
        toast({
          title: "Projet modifie",
          description: "Le projet a ete mis a jour avec succes.",
        })
      } else {
        addProject(formData)
        toast({
          title: "Projet ajoute",
          description: "Le nouveau projet a ete cree avec succes.",
        })
      }
      setProjectsState(getProjects())
      handleCloseDialog()
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le projet.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    if (!deletingId) return
    try {
      deleteProject(deletingId)
      setProjectsState(getProjects())
      toast({
        title: "Projet supprime",
        description: "Le projet a ete supprime avec succes.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingId(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setIsDeleteOpen(true)
  }

  if (isLoading) {
    return (
      <AdminShell title="Projets" description="Gerez vos projets photo">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Projets"
      description="Gerez vos projets photo"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      }
    >
      {/* Projects table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Domaine</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead className="text-center">Photos</TableHead>
                <TableHead className="w-32"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Camera className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {categories.find((c) => c.value === project.category)?.label || project.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.date}</TableCell>
                  <TableCell className="text-muted-foreground">{project.location}</TableCell>
                  <TableCell className="text-center">{project.images.length}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/portfolio/${project.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Aucun projet</p>
                      <Button className="mt-4" onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Creer un projet
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Modifier le projet" : "Nouveau projet"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Modifiez les informations du projet"
                : "Ajoutez un nouveau projet a votre portfolio"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du projet *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sophie & Thomas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Domaine *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un domaine" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Decrivez ce projet..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Juin 2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Paris, France"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="Nom du client"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="camera">Appareil photo</Label>
                <Input
                  id="camera"
                  value={formData.camera}
                  onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                  placeholder="Canon EOS R5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lens">Objectif</Label>
                <Input
                  id="lens"
                  value={formData.lens}
                  onChange={(e) => setFormData({ ...formData, lens: e.target.value })}
                  placeholder="RF 28-70mm f/2L"
                />
              </div>
            </div>

            {/* Cover Image */}
            <ImageUpload
              label="Image de couverture"
              value={formData.coverImage}
              onChange={(value) => setFormData({ ...formData, coverImage: value })}
              aspectRatio="video"
              description="L'image principale qui represente le projet"
            />

            {/* Project Images */}
            <MultiImageUpload
              label="Photos du projet"
              values={formData.images}
              onChange={handleImagesChange}
              maxImages={30}
              description="Ajoutez toutes les photos de ce projet (max 30)"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingProject ? "Enregistrer" : "Creer le projet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Le projet et toutes ses photos seront supprimes.
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

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={
      <AdminShell title="Projets" description="Gerez vos projets photo">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    }>
      <ProjectsContent />
    </Suspense>
  )
}
