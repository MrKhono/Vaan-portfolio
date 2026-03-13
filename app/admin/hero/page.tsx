"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { ImageUpload } from "@/components/admin/image-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getHero, setHero, type HeroContent } from "@/lib/admin-store"
import { Save, Loader2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function AdminHeroPage() {
  const [hero, setHeroState] = useState<HeroContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setHeroState(getHero())
    setIsLoading(false)
  }, [])

  const handleSave = async () => {
    if (!hero) return
    setIsSaving(true)
    try {
      setHero(hero)
      toast({
        title: "Modifications enregistrees",
        description: "La section Hero a ete mise a jour avec succes.",
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

  if (isLoading || !hero) {
    return (
      <AdminShell title="Section Hero" description="Gerez l'image et les textes de la section d'accueil">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Section Hero"
      description="Gerez l'image et les textes de la section d'accueil"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
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
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contenu</CardTitle>
            <CardDescription>Modifiez les textes et le bouton d&apos;appel a l&apos;action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre principal</Label>
              <Input
                id="title"
                value={hero.title}
                onChange={(e) => setHeroState({ ...hero, title: e.target.value })}
                placeholder="Votre nom ou titre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre / Description</Label>
              <Textarea
                id="subtitle"
                value={hero.subtitle}
                onChange={(e) => setHeroState({ ...hero, subtitle: e.target.value })}
                placeholder="Description de votre activite"
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ctaText">Texte du bouton</Label>
                <Input
                  id="ctaText"
                  value={hero.ctaText}
                  onChange={(e) => setHeroState({ ...hero, ctaText: e.target.value })}
                  placeholder="Decouvrir"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaLink">Lien du bouton</Label>
                <Input
                  id="ctaLink"
                  value={hero.ctaLink}
                  onChange={(e) => setHeroState({ ...hero, ctaLink: e.target.value })}
                  placeholder="/portfolio"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>Image d&apos;arriere-plan</CardTitle>
            <CardDescription>L&apos;image qui s&apos;affiche en fond de la section Hero</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={hero.image}
              onChange={(value) => setHeroState({ ...hero, image: value })}
              aspectRatio="video"
              description="Format recommande: 1920x1080px ou plus grand"
            />
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Apercu en direct</CardTitle>
          <CardDescription>Visualisez vos modifications en temps reel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-foreground">
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
              <Button className="mt-6" variant="secondary" size="sm">
                {hero.ctaText || "Bouton"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  )
}
