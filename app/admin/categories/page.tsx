"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Plus, Loader2, Pencil, Trash2, ImageIcon } from "lucide-react";
// import { useToast } from "@/hooks/use-toast"
import Image from "next/image";
import {
  createDomainAction,
  deleteDomainAction,
  Domain,
  DomainData,
  getDomainsAction,
  updateDomainAction,
} from "@/actions/domain.actions";
import { toast } from "sonner";

const emptyForm: DomainData = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

export default function AdminCategoriesPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DomainData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  // const { toast } = useToast()

  async function loadDomains() {
    try {
      const data = await getDomainsAction();
      setDomains(data);
    } catch {
      toast.error("Impossible de charger les domaines.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDomains();
  }, []);

  const handleOpenDialog = (domain?: Domain) => {
    if (domain) {
      setEditingDomain(domain);
      setFormData({
        name: domain.name,
        slug: domain.slug,
        description: domain.description,
        image: domain.image,
      });
    } else {
      setEditingDomain(null);
      setFormData(emptyForm);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDomain(null);
    setFormData(emptyForm);
  };

  // Génère le slug depuis le nom uniquement à la création
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      ...(!editingDomain && {
        slug: name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }),
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Le nom du domaine est requis.");
      return;
    }

    setIsSaving(true);

    const result = editingDomain
      ? await updateDomainAction(editingDomain.id, formData)
      : await createDomainAction(formData);

    if (result.success) {
      if (editingDomain) {
        toast.success("Domaine modifié");
      } else {
        toast.success("Domaine ajouté");
      }
      await loadDomains();
      handleCloseDialog();
    } else {
      toast.error("Impossible d'enregistrer le domaine.");
    }

    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    const result = await deleteDomainAction(deletingId);

    if (result.success) {
      toast.success("Le domaine a été supprimé avec succès.");
      await loadDomains();
    } else {
      toast.error("Impossible de supprimer le domaine.");
    }

    setIsDeleteOpen(false);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <AdminShell
        title="Domaines"
        description="Gérez vos catégories de photographie"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Domaines"
      description="Gérez vos catégories de photographie"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau domaine
        </Button>
      }
    >
      {/* Grille de cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="group overflow-hidden">
            <div className="relative aspect-4/3">
              {domain.image ? (
                <Image
                  src={domain.image}
                  alt={domain.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-serif text-lg font-semibold text-white">
                  {domain.name}
                </h3>
                <p className="line-clamp-1 text-sm text-white/80">
                  {domain.description}
                </p>
              </div>
            </div>
            <CardContent className="flex items-center justify-between p-3">
              <span className="font-mono text-xs text-muted-foreground">
                {domain.slug}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleOpenDialog(domain)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => {
                    setDeletingId(domain.id);
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {domains.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">Aucun domaine</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Commencez par ajouter un domaine de photographie
              </p>
              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un domaine
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog création / édition */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDomain ? "Modifier le domaine" : "Nouveau domaine"}
            </DialogTitle>
            <DialogDescription>
              {editingDomain
                ? "Modifiez les informations du domaine"
                : "Ajoutez un nouveau domaine de photographie"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du domaine *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Mariage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Identifiant (slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="mariage"
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour générer automatiquement
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Immortalisez le plus beau jour de votre vie"
                rows={3}
              />
            </div>

            <ImageUpload
              label="Image du domaine"
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
              aspectRatio="video"
              description="Format recommandé : 800x600px"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : editingDomain ? (
                "Enregistrer"
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce domaine ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le domaine sera définitivement
              supprimé.
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
  );
}
