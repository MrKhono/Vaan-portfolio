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
import { Save, Loader2, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  getHeroAction,
  HeroContent,
  updateHeroAction,
} from "@/actions/hero.actions";
import { toast } from "sonner";

const defaultHero: HeroContent = {
  title: "",
  subtitle: "",
  image: "",
};

export default function AdminHeroPage() {
  const [hero, setHeroState] = useState<HeroContent>(defaultHero);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadHero() {
      try {
        const data = await getHeroAction();
        setHeroState(data);
      } catch {
        toast.error("Impossible de charger les données du Hero.");
      } finally {
        setIsLoading(false);
      }
    }
    loadHero();
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);

    const result = await updateHeroAction(hero);

    if (result.success) {
      toast.success("Modifications enregistrées");
    } else {
      toast.error("Impossible d'enregistrer les modifications.");
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <AdminShell
        title="Section Hero"
        description="Gérez l'image et les textes de la section d'accueil"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Section Hero"
      description="Gérez l'image et les textes de la section d'accueil"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
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
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contenu</CardTitle>
            <CardDescription>
              Modifiez les textes et le bouton d&apos;appel à l&apos;action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre principal</Label>
              <Input
                id="title"
                value={hero.title}
                onChange={(e) =>
                  setHeroState({ ...hero, title: e.target.value })
                }
                placeholder="Votre nom ou titre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre / Description</Label>
              <Textarea
                id="subtitle"
                value={hero.subtitle}
                onChange={(e) =>
                  setHeroState({ ...hero, subtitle: e.target.value })
                }
                placeholder="Description de votre activité"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>Image d&apos;arrière-plan</CardTitle>
            <CardDescription>
              L&apos;image qui s&apos;affiche en fond de la section Hero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={hero.image}
              onChange={(value) => setHeroState({ ...hero, image: value })}
              aspectRatio="video"
              description="Format recommandé : 1920x1080px ou plus grand"
            />
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Aperçu en direct</CardTitle>
          <CardDescription>
            Visualisez vos modifications en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-21/9 overflow-hidden rounded-lg bg-foreground">
            {hero.image && (
              <Image
                src={hero.image}
                alt="Hero preview"
                fill
                className="object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-background">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl lg:text-4xl">
                {hero.title || "Votre titre"}
              </h2>
              <p className="mt-4 max-w-2xl text-sm opacity-90 sm:text-base">
                {hero.subtitle || "Votre description"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
