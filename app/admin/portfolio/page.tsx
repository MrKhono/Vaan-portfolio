"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"


import { Plus, Loader2, Pencil, ImageIcon, Eye, X, Upload, Link as LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { getProjectsAction, Project, updateProjectAction } from "@/actions/project.actions"
import { Domain, getDomainsAction } from "@/actions/domain.actions"

export default function AdminPortfolioPage() {
  const [projects, setProjects]           = useState<Project[]>([])
  const [domains, setDomains]             = useState<Domain[]>([])
  const [isLoading, setIsLoading]         = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen]   = useState(false)
  const [isDeleteOpen, setIsDeleteOpen]   = useState(false)
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null)
  const [filterDomain, setFilterDomain]   = useState<string>("all")
  const [isUploading, setIsUploading]     = useState(false)
  const [useUrl, setUseUrl]               = useState(false)
  const [urlInput, setUrlInput]           = useState("")
  const fileInputRef                      = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  async function loadData() {
    try {
      const [p, d] = await Promise.all([getProjectsAction(), getDomainsAction()])
      setProjects(p)
      setDomains(d)
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filteredProjects = filterDomain === "all"
    ? projects
    : projects.filter((p) => p.domainId === filterDomain)

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }

  // Sauvegarde les images + coverImage en base et met à jour l'état local
  async function saveImages(
    project: Project,
    updatedImages: string[],
    updatedCover?: string
  ) {
    const coverImage = updatedCover ?? project.coverImage

    const result = await updateProjectAction(project.id, {
      title:       project.title,
      description: project.description,
      coverImage,
      images:      updatedImages,
      date:        project.date,
      location:    project.location,
      client:      project.client,
      camera:      project.camera,
      lens:        project.lens,
      domainId:    project.domainId,
    })

    if (!result.success) throw new Error(result.error)

    const updated = { ...project, images: updatedImages, coverImage }
    setSelectedProject(updated)
    setProjects((prev) => prev.map((p) => p.id === project.id ? updated : p))
  }

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!selectedProject || files.length === 0) return

    setIsUploading(true)

    try {
      const form = new FormData()
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .forEach((f) => form.append("files", f))

      const res  = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()

      if (!data.urls?.length) throw new Error("Aucune image uploadée")

      const updatedImages = [...selectedProject.images, ...data.urls]
      const updatedCover  = selectedProject.coverImage || data.urls[0]

      await saveImages(selectedProject, updatedImages, updatedCover)

      toast({
        title: "Images ajoutées",
        description: `${data.urls.length} image(s) ajoutée(s) au projet.`,
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'uploader les images.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }, [selectedProject])

  const handleUrlAdd = async () => {
    if (!selectedProject || !urlInput.trim()) return

    try {
      const url           = urlInput.trim()
      const updatedImages = [...selectedProject.images, url]
      const updatedCover  = selectedProject.coverImage || url

      await saveImages(selectedProject, updatedImages, updatedCover)

      setUrlInput("")
      setUseUrl(false)

      toast({
        title: "Image ajoutée",
        description: "L'image a été ajoutée au projet.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'image.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setDeletingImageIndex(index)
    setIsDeleteOpen(true)
  }

  const confirmRemoveImage = async () => {
    if (!selectedProject || deletingImageIndex === null) return

    try {
      const removedImage  = selectedProject.images[deletingImageIndex]
      const updatedImages = selectedProject.images.filter((_, i) => i !== deletingImageIndex)

      let updatedCover = selectedProject.coverImage
      if (removedImage === selectedProject.coverImage) {
        updatedCover = updatedImages[0] ?? ""
      }

      await saveImages(selectedProject, updatedImages, updatedCover)

      toast({
        title: "Image supprimée",
        description: "L'image a été retirée du projet.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingImageIndex(null)
    }
  }

  const handleSetCover = async (imageUrl: string) => {
    if (!selectedProject || imageUrl === selectedProject.coverImage) return

    try {
      await saveImages(selectedProject, selectedProject.images, imageUrl)
      toast({
        title: "Image de couverture modifiée",
        description: "L'image de couverture a été mise à jour.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de changer la couverture.",
        variant: "destructive",
      })
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedProject(null)
    setUseUrl(false)
    setUrlInput("")
  }

  if (isLoading) {
    return (
      <AdminShell title="Portfolio" description="Gérez les photos de vos projets">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Portfolio"
      description="Gérez les photos de vos projets"
      actions={
        <div className="flex gap-2">
          <Select value={filterDomain} onValueChange={setFilterDomain}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filtrer par domaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les domaines</SelectItem>
              {domains.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/admin/projets?new=true">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Link>
          </Button>
        </div>
      }
    >
      {/* Grille des projets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
            onClick={() => handleSelectProject(project)}
          >
            <div className="relative aspect-[4/3]">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
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
                <h3 className="line-clamp-1 font-serif text-lg font-semibold text-white">
                  {project.title}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                    {project.domain.name}
                  </span>
                  <span className="text-xs text-white/80">
                    {project.images.length} photo{project.images.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">Aucun projet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filterDomain !== "all"
                  ? "Aucun projet dans ce domaine"
                  : "Commencez par créer un projet"}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/admin/projets?new=true">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un projet
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog photos du projet */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Photos — {selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Gérez les photos de ce projet. Cliquez sur une image pour la définir comme couverture.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Zone d'upload */}
            <div className="rounded-lg border-2 border-dashed border-border p-6">
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload en cours...</span>
                </div>
              ) : useUrl ? (
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://exemple.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={handleUrlAdd} disabled={!urlInput.trim()}>
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => { setUseUrl(false); setUrlInput("") }}>
                    Annuler
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-muted p-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez des photos à ce projet
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Télécharger des images
                    </Button>
                    <Button variant="outline" onClick={() => setUseUrl(true)}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Ajouter par URL
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedProject?.images.length ?? 0} / 30 photos
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Grille des images */}
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
              {selectedProject?.images.map((image, index) => {
                const isCover = image === selectedProject.coverImage
                return (
                  <div
                    key={index}
                    className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                      isCover
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleSetCover(image)}
                  >
                    <Image src={image} alt={`Photo ${index + 1}`} fill className="object-cover" />
                    {isCover && (
                      <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        Couverture
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(index) }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-1 right-1 rounded bg-black/50 px-1 text-[10px] text-white">
                      {index + 1}
                    </div>
                  </div>
                )
              })}

              {selectedProject?.images.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
                  <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Aucune photo dans ce projet</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href={`/admin/projets?edit=${selectedProject?.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier le projet
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/portfolio/${selectedProject?.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Voir le projet
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression image */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette image ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;image sera retirée du projet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveImage}
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