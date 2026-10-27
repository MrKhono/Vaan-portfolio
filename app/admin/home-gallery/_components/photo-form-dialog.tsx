"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload, MultiImageUpload } from "@/components/admin/image-upload";
import { Loader2 } from "lucide-react";
import type {
  HomeGalleryPhoto,
  HomeGalleryPhotoData,
} from "@/actions/home-gallery.actions";

const emptyForm: HomeGalleryPhotoData = {
  image: "",
  title: "",
  category: "",
  order: 0,
};

interface PhotoFormDialogProps {
  open: boolean;
  editingPhoto: HomeGalleryPhoto | null;
  isSaving: boolean;
  remainingSlots: number;
  onClose: () => void;
  onSave: (data: HomeGalleryPhotoData) => Promise<void>;
  onSaveMultiple: (images: string[]) => Promise<void>;
}

export function PhotoFormDialog({
  open,
  editingPhoto,
  isSaving,
  remainingSlots,
  onClose,
  onSave,
  onSaveMultiple,
}: PhotoFormDialogProps) {
  const [formData, setFormData] = useState<HomeGalleryPhotoData>(emptyForm);
  const [multiImages, setMultiImages] = useState<string[]>([]);

  useEffect(() => {
    if (editingPhoto) {
      setFormData({
        image: editingPhoto.image,
        title: editingPhoto.title,
        category: editingPhoto.category,
        order: editingPhoto.order,
      });
    } else {
      setFormData(emptyForm);
      setMultiImages([]);
    }
  }, [editingPhoto, open]);

  function handleClose() {
    setFormData(emptyForm);
    setMultiImages([]);
    onClose();
  }

  async function handleSubmit() {
    if (editingPhoto) {
      await onSave(formData);
    } else {
      await onSaveMultiple(multiImages);
    }
  }

  const canSubmit = editingPhoto
    ? !!formData.image.trim()
    : multiImages.length > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingPhoto ? "Modifier la photo" : "Ajouter des photos"}
          </DialogTitle>
          <DialogDescription>
            {editingPhoto
              ? "Modifiez les informations de cette photo."
              : `Sélectionnez jusqu'à ${remainingSlots} photo${remainingSlots > 1 ? "s" : ""} à ajouter à la galerie.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {editingPhoto ? (
            <>
              <ImageUpload
                label="Photo *"
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                aspectRatio="video"
                description="Format recommandé : paysage ou carré"
              />

              <div className="space-y-2">
                <Label htmlFor="title">Titre (optionnel)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Mariage de Sarah & Thomas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie (optionnel)</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Mariage, Portrait, Mode..."
                />
              </div>
            </>
          ) : (
            <MultiImageUpload
              label={`Photos (${multiImages.length}/${remainingSlots})`}
              values={multiImages}
              onChange={setMultiImages}
              maxImages={remainingSlots}
              description="Vous pourrez modifier le titre et la catégorie après ajout"
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !canSubmit}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : editingPhoto ? (
              "Enregistrer"
            ) : (
              `Ajouter ${multiImages.length > 1 ? `${multiImages.length} photos` : "la photo"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
