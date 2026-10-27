"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/admin/image-upload"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import {
  getSettingsAction,
  updateSettingsAction,
  type SiteSettings,
} from "@/actions/settings.actions"

export default function BrandingPage() {
  const [settings, setSettings]   = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving]   = useState(false)

  async function loadSettings() {
    try {
      const data = await getSettingsAction()
      setSettings(data)
    } catch {
      toast.error("Impossible de charger les paramètres.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadSettings() }, [])

  async function handleSave() {
    if (!settings) return
    setIsSaving(true)

    const result = await updateSettingsAction(settings)

    if (result.success) {
      toast.success("Branding mis à jour sur tout le site.")
    } else {
      toast.error(result.error ?? "Impossible d'enregistrer.")
    }

    setIsSaving(false)
  }

  if (isLoading || !settings) {
    return (
      <AdminShell title="Branding" description="Gérez l'identité visuelle de votre site">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      title="Branding"
      description="Logo et identité visuelle affichés sur tout le site"
      actions={
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" />Enregistrer</>
          )}
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Colonne principale — upload logo */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Logo du site</CardTitle>
              <CardDescription>
                Ce logo sera affiché dans la navbar, le footer, l&apos;administration et comme favicon. Format recommandé : PNG transparent, carré, minimum 512×512px.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                label="Logo principal"
                value={settings.logo}
                onChange={(value) => setSettings({ ...settings, logo: value })}
                aspectRatio="square"
                description="PNG, JPG ou SVG — recommandé : fond transparent"
              />

              <div className="space-y-2">
                <Label htmlFor="siteName">Nom du site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="Vaan Photography"
                />
                <p className="text-xs text-muted-foreground">
                  Affiché à côté du logo si le logo n&apos;est pas défini.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite — aperçus */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aperçu Navbar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="h-10 w-10 object-contain" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                    Logo
                  </div>
                )}
                <span className="font-serif text-lg font-semibold">
                  {settings.siteName || "Nom du site"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aperçu Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg bg-card p-4">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="h-9 w-9 rounded-lg object-contain" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                    L
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-serif text-sm font-semibold">Admin</span>
                  <span className="text-xs text-muted-foreground">
                    {settings.siteName || "Nom du site"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aperçu Favicon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                {settings.logo ? (
                  <img src={settings.logo} alt="Favicon" className="h-4 w-4 object-contain" />
                ) : (
                  <div className="h-4 w-4 rounded-sm bg-muted" />
                )}
                <span className="text-xs text-muted-foreground">
                  {settings.siteName || "Site"} — Onglet navigateur
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AdminShell>
  )
}