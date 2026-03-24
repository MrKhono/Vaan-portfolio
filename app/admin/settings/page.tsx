"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
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
  Save,
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import {
  getSettingsAction,
  SiteSettings,
  updateSettingsAction,
} from "@/actions/settings.actions";
import { toast } from "sonner";

const defaultSettings: SiteSettings = {
  siteName: "",
  siteDescription: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  socialLinks: {
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettingsState] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettingsAction();
        setSettingsState(data);
      } catch {
        toast.error("Impossible de charger les paramètres");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);

    // const result = await updateSettingsAction(settings);

    try {
      const result = await updateSettingsAction(settings);
      toast.success("Les paramètres du site ont été mis à jour.");
    }catch {
      toast.error("Impossible d'enregistrer les paramètres.")
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <AdminShell
        title="Paramètres"
        description="Configurez les informations générales du site"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Paramètres"
      description="Configurez les informations générales du site"
      actions={
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
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Informations générales
            </CardTitle>
            <CardDescription>
              Les informations de base de votre site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nom du site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) =>
                  setSettingsState({ ...settings, siteName: e.target.value })
                }
                placeholder="Alexandre Dubois Photographie"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Description (SEO)</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) =>
                  setSettingsState({
                    ...settings,
                    siteDescription: e.target.value,
                  })
                }
                placeholder="Description pour les moteurs de recherche..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Cette description apparaît dans les résultats de recherche
                Google.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Coordonnées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Coordonnées
            </CardTitle>
            <CardDescription>Vos informations de contact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettingsState({
                    ...settings,
                    contactEmail: e.target.value,
                  })
                }
                placeholder="contact@exemple.fr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Téléphone
              </Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) =>
                  setSettingsState({
                    ...settings,
                    contactPhone: e.target.value,
                  })
                }
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Adresse
              </Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) =>
                  setSettingsState({ ...settings, address: e.target.value })
                }
                placeholder="12 Rue de la Roquette, 75011 Paris"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Réseaux sociaux */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Réseaux sociaux</CardTitle>
            <CardDescription>
              Liens vers vos profils sur les réseaux sociaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={settings.socialLinks.instagram}
                  onChange={(e) =>
                    setSettingsState({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        instagram: e.target.value,
                      },
                    })
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={settings.socialLinks.facebook}
                  onChange={(e) =>
                    setSettingsState({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        facebook: e.target.value,
                      },
                    })
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  Twitter / X
                </Label>
                <Input
                  id="twitter"
                  value={settings.socialLinks.twitter}
                  onChange={(e) =>
                    setSettingsState({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        twitter: e.target.value,
                      },
                    })
                  }
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={settings.socialLinks.linkedin}
                  onChange={(e) =>
                    setSettingsState({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note informative */}
        <Card className="lg:col-span-2 bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">À propos des paramètres</h3>
            <p className="text-sm text-muted-foreground">
              Ces paramètres sont utilisés dans plusieurs endroits du site : le
              pied de page, la page de contact, les méta-données SEO et les
              liens vers vos réseaux sociaux. Assurez-vous de les maintenir à
              jour pour une meilleure visibilité.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
