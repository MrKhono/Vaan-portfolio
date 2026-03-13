"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { ImageUpload } from "@/components/admin/image-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { getAbout, setAbout, type AboutContent } from "@/lib/admin-store"
import { Save, Loader2, Eye, Plus, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const emptyStatForm = { value: "", label: "" }
const emptyValueForm = { icon: "Camera", title: "", description: "" }

export default function AdminAboutPage() {
  const [about, setAboutState] = useState<AboutContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Stats dialog
  const [isStatDialogOpen, setIsStatDialogOpen] = useState(false)
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null)
  const [statForm, setStatForm] = useState(emptyStatForm)
  
  // Values dialog
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false)
  const [editingValueIndex, setEditingValueIndex] = useState<number | null>(null)
  const [valueForm, setValueForm] = useState(emptyValueForm)
  
  const { toast } = useToast()

  useEffect(() => {
    setAboutState(getAbout())
    setIsLoading(false)
  }, [])

  const handleSave = async () => {
    if (!about) return
    setIsSaving(true)
    try {
      setAbout(about)
      toast({
        title: "Modifications enregistrees",
        description: "La section A propos a ete mise a jour avec succes.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les modifications.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Stats handlers
  const openStatDialog = (index?: number) => {
    if (index !== undefined && about) {
      setEditingStatIndex(index)
      setStatForm(about.stats[index])
    } else {
      setEditingStatIndex(null)
      setStatForm(emptyStatForm)
    }
    setIsStatDialogOpen(true)
  }

  const closeStatDialog = () => {
    setIsStatDialogOpen(false)
    setEditingStatIndex(null)
    setStatForm(emptyStatForm)
  }

  const saveStat = () => {
    if (!about || !statForm.value.trim() || !statForm.label.trim()) {
      toast({ title: "Erreur", description: "Tous les champs sont requis.", variant: "destructive" })
      return
    }
    
    const newStats = [...about.stats]
    if (editingStatIndex !== null) {
      newStats[editingStatIndex] = statForm
    } else {
      newStats.push(statForm)
    }
    setAboutState({ ...about, stats: newStats })
    closeStatDialog()
  }

  const deleteStat = (index: number) => {
    if (!about) return
    const newStats = about.stats.filter((_, i) => i !== index)
    setAboutState({ ...about, stats: newStats })
  }

  // Values handlers
  const openValueDialog = (index?: number) => {
    if (index !== undefined && about) {
      setEditingValueIndex(index)
      setValueForm(about.values[index])
    } else {
      setEditingValueIndex(null)
      setValueForm(emptyValueForm)
    }
    setIsValueDialogOpen(true)
  }

  const closeValueDialog = () => {
    setIsValueDialogOpen(false)
    setEditingValueIndex(null)
    setValueForm(emptyValueForm)
  }

  const saveValue = () => {
    if (!about || !valueForm.title.trim() || !valueForm.description.trim()) {
      toast({ title: "Erreur", description: "Tous les champs sont requis.", variant: "destructive" })
      return
    }
    
    const newValues = [...about.values]
    if (editingValueIndex !== null) {
      newValues[editingValueIndex] = valueForm
    } else {
      newValues.push(valueForm)
    }
    setAboutState({ ...about, values: newValues })
    closeValueDialog()
  }

  const deleteValue = (index: number) => {
    if (!about) return
    const newValues = about.values.filter((_, i) => i !== index)
    setAboutState({ ...about, values: newValues })
  }

  if (isLoading || !about) {
    return (
      <AdminShell title="A propos" description="Gerez la section de presentation">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="A propos"
      description="Gerez la section de presentation"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/about" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Apercu
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations principales</CardTitle>
            <CardDescription>Votre nom et description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nom / Titre</Label>
              <Input
                id="title"
                value={about.title}
                onChange={(e) => setAboutState({ ...about, title: e.target.value })}
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input
                id="subtitle"
                value={about.subtitle}
                onChange={(e) => setAboutState({ ...about, subtitle: e.target.value })}
                placeholder="Photographe depuis..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={about.description}
                onChange={(e) => setAboutState({ ...about, description: e.target.value })}
                placeholder="Votre parcours et philosophie..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
            <CardDescription>Votre photo professionnelle</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={about.image}
              onChange={(value) => setAboutState({ ...about, image: value })}
              aspectRatio="portrait"
              description="Format recommande: 600x800px"
            />
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Vos chiffres cles</CardDescription>
            </div>
            <Button size="sm" onClick={() => openStatDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            {about.stats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucune statistique. Cliquez sur Ajouter pour en creer.
              </p>
            ) : (
              <div className="space-y-2">
                {about.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <span className="font-bold text-primary">{stat.value}</span>
                      <span className="ml-2 text-muted-foreground">{stat.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openStatDialog(index)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteStat(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Values */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Valeurs</CardTitle>
              <CardDescription>Ce qui vous definit</CardDescription>
            </div>
            <Button size="sm" onClick={() => openValueDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            {about.values.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucune valeur. Cliquez sur Ajouter pour en creer.
              </p>
            ) : (
              <div className="space-y-2">
                {about.values.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium">{value.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{value.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openValueDialog(index)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteValue(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stat Dialog */}
      <Dialog open={isStatDialogOpen} onOpenChange={(open) => !open && closeStatDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStatIndex !== null ? "Modifier la statistique" : "Nouvelle statistique"}</DialogTitle>
            <DialogDescription>Ajoutez un chiffre cle a mettre en avant</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="statValue">Valeur *</Label>
              <Input
                id="statValue"
                value={statForm.value}
                onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                placeholder="500+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statLabel">Libelle *</Label>
              <Input
                id="statLabel"
                value={statForm.label}
                onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                placeholder="Projets realises"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeStatDialog}>Annuler</Button>
            <Button onClick={saveStat}>{editingStatIndex !== null ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Value Dialog */}
      <Dialog open={isValueDialogOpen} onOpenChange={(open) => !open && closeValueDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingValueIndex !== null ? "Modifier la valeur" : "Nouvelle valeur"}</DialogTitle>
            <DialogDescription>Decrivez ce qui vous definit</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="valueTitle">Titre *</Label>
              <Input
                id="valueTitle"
                value={valueForm.title}
                onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                placeholder="Excellence"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valueIcon">Icone</Label>
              <Input
                id="valueIcon"
                value={valueForm.icon}
                onChange={(e) => setValueForm({ ...valueForm, icon: e.target.value })}
                placeholder="Camera, Heart, Sparkles..."
              />
              <p className="text-xs text-muted-foreground">Noms d&apos;icones Lucide: Camera, Heart, Sparkles, Star, Award...</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valueDescription">Description *</Label>
              <Textarea
                id="valueDescription"
                value={valueForm.description}
                onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })}
                placeholder="Un engagement constant vers la qualite..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeValueDialog}>Annuler</Button>
            <Button onClick={saveValue}>{editingValueIndex !== null ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
