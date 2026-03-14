"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import {
  getPartnersAction,
  createPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
  type Partner,
  type PartnerData,
} from "@/actions/partner.actions";

import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Handshake,
  ExternalLink,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const emptyPartner: PartnerData = {
  name: "",
  logo: "",
  website: "",
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<PartnerData>(emptyPartner);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  async function loadPartners() {
    try {
      const data = await getPartnersAction();
      setPartners(data);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPartners();
  }, []);

  function handleOpenDialog(partner?: Partner) {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        logo: partner.logo,
        website: partner.website,
      });
    } else {
      setEditingPartner(null);
      setFormData(emptyPartner);
    }

    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingPartner(null);
    setFormData(emptyPartner);
  }

  async function handleSave() {
    setIsSaving(true);

    const result = editingPartner
      ? await updatePartnerAction(editingPartner.id, formData)
      : await createPartnerAction(formData);

    if (result.success) {
      toast({
        title: editingPartner ? "Partenaire modifié" : "Partenaire ajouté",
        description: editingPartner
          ? "Le partenaire a été mis à jour avec succès."
          : "Le nouveau partenaire a été créé avec succès.",
      });

      await loadPartners();
      handleCloseDialog();
    } else {
      toast({
        title: "Erreur",
        description: result.error ?? "Impossible d'enregistrer le partenaire.",
        variant: "destructive",
      });
    }

    setIsSaving(false);
  }

  async function handleDelete() {
    if (!deletingId) return;

    const result = await deletePartnerAction(deletingId);

    if (result.success) {
      toast({
        title: "Partenaire supprimé",
        description: "Le partenaire a été supprimé avec succès.",
      });

      await loadPartners();
    } else {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsDeleteOpen(false);
    setDeletingId(null);
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Partenaires"
        description="Gérez vos partenaires et collaborateurs"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Partenaires"
      description="Gérez vos partenaires et collaborateurs"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau partenaire
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Handshake className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold">{partner.name}</h3>

                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Site web
                  </a>
                )}

                <div className="mt-4 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(partner)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      setDeletingId(partner.id);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {partners.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Handshake className="mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="font-medium">Aucun partenaire</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Ajoutez vos partenaires et collaborateurs
              </p>

              <Button className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un partenaire
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Modifier le partenaire" : "Nouveau partenaire"}
            </DialogTitle>

            <DialogDescription>
              {editingPartner
                ? "Modifiez les informations du partenaire"
                : "Ajoutez un nouveau partenaire"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du partenaire *</Label>

              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="Canon France"
              />
            </div>

            <ImageUpload
              label="Logo"
              value={formData.logo}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  logo: value,
                })
              }
              aspectRatio="square"
              description="Logo du partenaire (format carré recommandé)"
            />

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>

              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    website: e.target.value,
                  })
                }
                placeholder="https://www.canon.fr"
              />
            </div>
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
              ) : editingPartner ? (
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
            <AlertDialogTitle>Supprimer ce partenaire ?</AlertDialogTitle>

            <AlertDialogDescription>
              Cette action est irréversible. Le partenaire sera définitivement
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
