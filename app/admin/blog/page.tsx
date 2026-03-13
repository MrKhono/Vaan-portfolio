"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  getBlogPosts,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/admin-store"
import type { BlogPost } from "@/lib/data"
import { Plus, Loader2, Pencil, Trash2, ImageIcon, Eye, FileText, Calendar, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

const emptyPost = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
  readTime: "5 min",
  category: "Conseils",
}

function BlogContent() {
  const searchParams = useSearchParams()
  const [posts, setPostsState] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyPost)
  const { toast } = useToast()

  useEffect(() => {
    setPostsState(getBlogPosts())
    setIsLoading(false)

    const isNew = searchParams.get("new")
    if (isNew) {
      setEditingPost(null)
      setFormData(emptyPost)
      setIsDialogOpen(true)
    }
  }, [searchParams])

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        date: post.date,
        readTime: post.readTime,
        category: post.category,
      })
    } else {
      setEditingPost(null)
      setFormData(emptyPost)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingPost(null)
    setFormData(emptyPost)
    window.history.replaceState({}, "", "/admin/blog")
  }

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de l'article est requis.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingPost) {
        updateBlogPost(editingPost.id, formData)
        toast({
          title: "Article modifie",
          description: "L'article a ete mis a jour avec succes.",
        })
      } else {
        addBlogPost(formData)
        toast({
          title: "Article ajoute",
          description: "Le nouvel article a ete cree avec succes.",
        })
      }
      setPostsState(getBlogPosts())
      handleCloseDialog()
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'article.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    if (!deletingId) return
    try {
      deleteBlogPost(deletingId)
      setPostsState(getBlogPosts())
      toast({
        title: "Article supprime",
        description: "L'article a ete supprime avec succes.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <AdminShell title="Blog" description="Gerez vos articles de blog">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Blog"
      description="Gerez vos articles de blog"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/blog" target="_blank">
              Voir le blog
            </Link>
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Button>
        </div>
      }
    >
      {/* Posts table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Temps de lecture</TableHead>
                <TableHead className="w-32"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/blog/${post.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeletingId(post.id)
                          setIsDeleteOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Aucun article</p>
                      <Button className="mt-4" onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Creer un article
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
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Modifiez les informations de l'article"
                : "Ajoutez un nouvel article a votre blog"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l&apos;article *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Les secrets d'une photo reussie"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category">Categorie</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Conseils"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date de publication</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="15 Janvier 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readTime">Temps de lecture</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="5 min"
                />
              </div>
            </div>

            <ImageUpload
              label="Image de couverture"
              value={formData.coverImage}
              onChange={(value) => setFormData({ ...formData, coverImage: value })}
              aspectRatio="video"
              description="Image principale de l'article"
            />

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resume / Extrait</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Un court resume de l'article..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu de l&apos;article</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Le contenu complet de votre article..."
                rows={10}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingPost ? "Enregistrer" : "Publier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. L&apos;article sera definitivement supprime.
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

export default function AdminBlogPage() {
  return (
    <Suspense fallback={
      <AdminShell title="Blog" description="Gerez vos articles de blog">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    }>
      <BlogContent />
    </Suspense>
  )
}
