"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Save, Loader2, Eye, Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AboutContent,
  AboutStat,
  AboutValue,
  getAboutAction,
  updateAboutAction,
} from "@/actions/about.actions";
import { toast } from "sonner";
import { RichTextEditor } from "./rich-text-editor";

const emptyStatForm: AboutStat = { value: "", label: "" };
const emptyValueForm: AboutValue = {
  icon: "Camera",
  title: "",
  description: "",
};

const defaultAbout: AboutContent = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  stats: [],
  values: [],
};

export default function AdminAboutPage() {
  const [about, setAboutState] = useState<AboutContent>(defaultAbout);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Stats dialog
  const [isStatDialogOpen, setIsStatDialogOpen] = useState(false);
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
  const [statForm, setStatForm] = useState<AboutStat>(emptyStatForm);

  // Values dialog
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false);
  const [editingValueIndex, setEditingValueIndex] = useState<number | null>(
    null,
  );
  const [valueForm, setValueForm] = useState<AboutValue>(emptyValueForm);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAboutAction();
        setAboutState(data);
      } catch {
        toast.error("Impossible de charger les données.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);

    const result = await updateAboutAction(about);
    if (result.success) {
      toast.success("La section À propos a été mise à jour avec succès.");
    } else {
      toast.error(result.error ?? "Impossible d'enregistrer.");
    }
    setIsSaving(false);
  };

  // — Stats handlers
  const openStatDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingStatIndex(index);
      setStatForm(about.stats[index]);
    } else {
      setEditingStatIndex(null);
      setStatForm(emptyStatForm);
    }
    setIsStatDialogOpen(true);
  };

  const closeStatDialog = () => {
    setIsStatDialogOpen(false);
    setEditingStatIndex(null);
    setStatForm(emptyStatForm);
  };

  const saveStat = () => {
    if (!statForm.value.trim() || !statForm.label.trim()) {
      toast.error("Tous les champs sont requis");
      return;
    }
    const newStats = [...about.stats];
    if (editingStatIndex !== null) {
      newStats[editingStatIndex] = statForm;
    } else {
      newStats.push(statForm);
    }
    setAboutState({ ...about, stats: newStats });
    closeStatDialog();
  };

  const deleteStat = (index: number) => {
    setAboutState({
      ...about,
      stats: about.stats.filter((_, i) => i !== index),
    });
  };

  // — Values handlers
  const openValueDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingValueIndex(index);
      setValueForm(about.values[index]);
    } else {
      setEditingValueIndex(null);
      setValueForm(emptyValueForm);
    }
    setIsValueDialogOpen(true);
  };

  const closeValueDialog = () => {
    setIsValueDialogOpen(false);
    setEditingValueIndex(null);
    setValueForm(emptyValueForm);
  };

  const saveValue = () => {
    if (!valueForm.title.trim() || !valueForm.description.trim()) {
      toast.error("Tous les champs sont requis");
      return;
    }
    const newValues = [...about.values];
    if (editingValueIndex !== null) {
      newValues[editingValueIndex] = valueForm;
    } else {
      newValues.push(valueForm);
    }
    setAboutState({ ...about, values: newValues });
    closeValueDialog();
  };

  const deleteValue = (index: number) => {
    setAboutState({
      ...about,
      values: about.values.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <AdminShell
        title="À propos"
        description="Gérez la section de présentation"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="À propos"
      description="Gérez la section de présentation"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/about" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Aperçu
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
        {/* Informations principales */}
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
                onChange={(e) =>
                  setAboutState({ ...about, title: e.target.value })
                }
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input
                id="subtitle"
                value={about.subtitle}
                onChange={(e) =>
                  setAboutState({ ...about, subtitle: e.target.value })
                }
                placeholder="Photographe depuis..."
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={about.description}
                onChange={(e) =>
                  setAboutState({ ...about, description: e.target.value })
                }
                placeholder="Votre parcours et philosophie..."
                rows={6}
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <RichTextEditor
                value={about.description}
                onChange={(value) =>
                  setAboutState({ ...about, description: value })
                }
                placeholder="Votre parcours et philosophie..."
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
              description="Format recommandé : 600x800px"
            />
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Vos chiffres clés</CardDescription>
            </div>
            <Button size="sm" onClick={() => openStatDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            {about.stats.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Aucune statistique. Cliquez sur Ajouter pour en créer.
              </p>
            ) : (
              <div className="space-y-2">
                {about.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <span className="font-bold text-primary">
                        {stat.value}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openStatDialog(index)}
                      >
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
      </div>

      {/* Dialog Statistique */}
      <Dialog
        open={isStatDialogOpen}
        onOpenChange={(open) => !open && closeStatDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingStatIndex !== null
                ? "Modifier la statistique"
                : "Nouvelle statistique"}
            </DialogTitle>
            <DialogDescription>
              Ajoutez un chiffre clé à mettre en avant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="statValue">Valeur *</Label>
              <Input
                id="statValue"
                value={statForm.value}
                onChange={(e) =>
                  setStatForm({ ...statForm, value: e.target.value })
                }
                placeholder="500+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statLabel">Libellé *</Label>
              <Input
                id="statLabel"
                value={statForm.label}
                onChange={(e) =>
                  setStatForm({ ...statForm, label: e.target.value })
                }
                placeholder="Projets réalisés"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeStatDialog}>
              Annuler
            </Button>
            <Button onClick={saveStat}>
              {editingStatIndex !== null ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Valeur */}
      <Dialog
        open={isValueDialogOpen}
        onOpenChange={(open) => !open && closeValueDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingValueIndex !== null
                ? "Modifier la valeur"
                : "Nouvelle valeur"}
            </DialogTitle>
            <DialogDescription>Décrivez ce qui vous définit</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="valueTitle">Titre *</Label>
              <Input
                id="valueTitle"
                value={valueForm.title}
                onChange={(e) =>
                  setValueForm({ ...valueForm, title: e.target.value })
                }
                placeholder="Excellence"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valueIcon">Icône</Label>
              <Input
                id="valueIcon"
                value={valueForm.icon}
                onChange={(e) =>
                  setValueForm({ ...valueForm, icon: e.target.value })
                }
                placeholder="Camera, Heart, Sparkles..."
              />
              <p className="text-xs text-muted-foreground">
                Noms d&apos;icônes Lucide : Camera, Heart, Sparkles, Star,
                Award...
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valueDescription">Description *</Label>
              <Textarea
                id="valueDescription"
                value={valueForm.description}
                onChange={(e) =>
                  setValueForm({ ...valueForm, description: e.target.value })
                }
                placeholder="Un engagement constant vers la qualité..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeValueDialog}>
              Annuler
            </Button>
            <Button onClick={saveValue}>
              {editingValueIndex !== null ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
