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
import {
  getProjects,
  updateProject,
  getCategories,
  type CategoryItem,
} from "@/lib/admin-store"
import type { Project } from "@/lib/data"
import { Plus, Loader2, Pencil, ImageIcon, Eye, X, Upload, Link as LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function AdminPortfolioPage() {
  const [projects, setProjectsState] = useState<Project[]>([])
  const [categories, setCategoriesState] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isUploading, setIsUploading] = useState(false)
  const [useUrl, setUseUrl] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    setProjectsState(getProjects())
    setCategoriesState(getCategories())
    setIsLoading(false)
  }, [])

  const filteredProjects = filterCategory === "all"
    ? projects
    : projects.filter((p) => p.category === filterCategory)

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!selectedProject || files.length === 0) return

    setIsUploading(true)
    const newImages: string[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue
      
      const result = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      newImages.push(result)
    }

    const updatedImages = [...selectedProject.images, ...newImages]
    const coverUpdate = selectedProject.coverImage ? {} : { coverImage: newImages[0] }
    
    updateProject(selectedProject.id, { images: updatedImages, ...coverUpdate })
    setSelectedProject({ 
      ...selectedProject, 
      images: updatedImages, 
      coverImage: selectedProject.coverImage || newImages[0] 
    })
    setProjectsState(getProjects())
    setIsUploading(false)
    
    toast({
      title: "Images ajoutees",
      description: `${newImages.length} image(s) ajoutee(s) au projet.`,
    })
  }, [selectedProject, toast])

  const handleUrlAdd = () => {
    if (!selectedProject || !urlInput.trim()) return

    const updatedImages = [...selectedProject.images, urlInput.trim()]
    const coverUpdate = selectedProject.coverImage ? {} : { coverImage: urlInput.trim() }
    
    updateProject(selectedProject.id, { images: updatedImages, ...coverUpdate })
    setSelectedProject({ 
      ...selectedProject, 
      images: updatedImages,
      coverImage: selectedProject.coverImage || urlInput.trim()
    })
    setProjectsState(getProjects())
    setUrlInput("")
    setUseUrl(false)
    
    toast({
      title: "Image ajoutee",
      description: "L'image a ete ajoutee au projet.",
    })
  }

  const handleRemoveImage = (index: number) => {
    if (!selectedProject) return
    setDeletingImageIndex(index)
    setIsDeleteOpen(true)
  }

  const confirmRemoveImage = () => {
    if (!selectedProject || deletingImageIndex === null) return

    const updatedImages = selectedProject.images.filter((_, i) => i !== deletingImageIndex)
    const removedImage = selectedProject.images[deletingImageIndex]
    
    let coverUpdate = {}
    if (removedImage === selectedProject.coverImage && updatedImages.length > 0) {
      coverUpdate = { coverImage: updatedImages[0] }
    } else if (removedImage === selectedProject.coverImage) {
      coverUpdate = { coverImage: "" }
    }

    updateProject(selectedProject.id, { images: updatedImages, ...coverUpdate })
    setSelectedProject({ ...selectedProject, images: updatedImages, ...coverUpdate })
    setProjectsState(getProjects())
    setIsDeleteOpen(false)
    setDeletingImageIndex(null)
    
    toast({
      title: "Image supprimee",
      description: "L'image a ete retiree du projet.",
    })
  }

  const handleSetCover = (imageUrl: string) => {
    if (!selectedProject) return
    updateProject(selectedProject.id, { coverImage: imageUrl })
    setSelectedProject({ ...selectedProject, coverImage: imageUrl })
    setProjectsState(getProjects())
    toast({
      title: "Image de couverture modifiee",
      description: "L'image de couverture a ete mise a jour.",
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedProject(null)
    setUseUrl(false)
    setUrlInput("")
  }

  if (isLoading) {
    return (
      <AdminShell title="Portfolio" description="Gerez les photos de vos projets">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Portfolio"
      description="Gerez les photos de vos projets"
      actions={
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les domaines</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/admin/projects?new=true">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Link>
          </Button>
        </div>
      }
    >
      {/* Projects grid */}
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
                <h3 className="font-serif text-lg font-semibold text-white line-clamp-1">
                  {project.title}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                    {categories.find(c => c.value === project.category)?.label || project.category}
                  </span>
                  <span className="text-xs text-white/80">
                    {project.images.length} photos
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucun projet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filterCategory !== "all"
                  ? "Aucun projet dans ce domaine"
                  : "Commencez par creer un projet"}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/admin/projects?new=true">
                  <Plus className="mr-2 h-4 w-4" />
                  Creer un projet
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Project images dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Photos - {selectedProject?.title}
            </DialogTitle>
            <DialogDescription>
              Gerez les photos de ce projet. Cliquez sur une image pour la definir comme couverture.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Upload zone */}
            <div className="rounded-lg border-2 border-dashed border-border p-6">
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Chargement des images...</span>
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
                  />
                  <Button onClick={handleUrlAdd} disabled={!urlInput.trim()}>
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setUseUrl(false)}>
                    Annuler
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-muted p-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez des photos a ce projet
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Telecharger des images
                    </Button>
                    <Button variant="outline" onClick={() => setUseUrl(true)}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Ajouter par URL
                    </Button>
                  </div>
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

            {/* Images grid */}
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
              {selectedProject?.images.map((image, index) => {
                const isCover = image === selectedProject.coverImage
                return (
                  <div
                    key={index}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                      isCover ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleSetCover(image)}
                  >
                    <Image
                      src={image}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {isCover && (
                      <div className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        Couverture
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveImage(index)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}

              {selectedProject?.images.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Aucune photo dans ce projet</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href={`/admin/projects?edit=${selectedProject?.id}`}>
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

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette image ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. L&apos;image sera retiree du projet.
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
