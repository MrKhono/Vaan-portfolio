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
  getServices,
  addService,
  updateService,
  deleteService,
} from "@/lib/admin-store"
import type { Service } from "@/lib/data"
import { Plus, Loader2, Pencil, Trash2, Briefcase, ImageIcon, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

const emptyService = {
  title: "",
  description: "",
  features: [] as string[],
  price: "",
  image: "",
}

export default function AdminServicesPage() {
  const [services, setServicesState] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyService)
  const [newFeature, setNewFeature] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setServicesState(getServices())
    setIsLoading(false)
  }, [])

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        title: service.title,
        description: service.description,
        features: service.features,
        price: service.price,
        image: service.image,
      })
    } else {
      setEditingService(null)
      setFormData(emptyService)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingService(null)
    setFormData(emptyService)
    setNewFeature("")
  }

  const handleAddFeature = () => {
    if (!newFeature.trim()) return
    setFormData({
      ...formData,
      features: [...formData.features, newFeature.trim()],
    })
    setNewFeature("")
  }

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du service est requis.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingService) {
        updateService(editingService.id, formData)
        toast({
          title: "Service modifie",
          description: "Le service a ete mis a jour avec succes.",
        })
      } else {
        addService(formData)
        toast({
          title: "Service ajoute",
          description: "Le nouveau service a ete cree avec succes.",
        })
      }
      setServicesState(getServices())
      handleCloseDialog()
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le service.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    if (!deletingId) return
    try {
      deleteService(deletingId)
      setServicesState(getServices())
      toast({
        title: "Service supprime",
        description: "Le service a ete supprime avec succes.",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le service.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteOpen(false)
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <AdminShell title="Services" description="Gerez vos offres et tarifs">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Services"
      description="Gerez vos offres et tarifs"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/services" target="_blank">
              Voir la page
            </Link>
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau service
          </Button>
        </div>
      }
    >
      {/* Services grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative h-48 sm:h-auto sm:w-48 shrink-0">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <Briefcase className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className="flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-lg font-bold text-primary mt-1">{service.price} EUR</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => {
                        setDeletingId(service.id)
                        setIsDeleteOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>

                {service.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                      >
                        <Check className="h-3 w-3 text-primary" />
                        {feature.length > 20 ? feature.slice(0, 20) + "..." : feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{service.features.length - 3} autres
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        ))}

        {services.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucun service</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ajoutez vos services et tarifs
              </p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Modifier le service" : "Nouveau service"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Modifiez les informations du service"
                : "Ajoutez un nouveau service a votre catalogue"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du service *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mariage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="A partir de 2 800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Decrivez ce service..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/wedding-1.jpg"
              />
              {formData.image && (
                <div className="relative mt-2 aspect-video max-w-xs overflow-hidden rounded-lg border border-border">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label>Caracteristiques incluses</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une caracteristique"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddFeature} disabled={!newFeature.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2"
                  >
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="flex-1 text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune caracteristique ajoutee
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingService ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Le service sera definitivement supprime.
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
