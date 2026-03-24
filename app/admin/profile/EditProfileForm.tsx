"use client"

import { useState, useRef } from "react"
import {
  Card, CardContent, CardHeader,
  CardTitle, CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Loader2, User } from "lucide-react"
import { toast } from "sonner"
import { updateProfileAction } from "@/actions/user.actions"

interface EditProfileFormProps {
  user: {
    name:  string
    email: string
    image: string | null
  }
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name:  user.name,
    email: user.email,
    image: user.image ?? "",
  })
  const [isSaving, setIsSaving]     = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const form = new FormData()
      form.append("files", file)

      const res  = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()

      if (data.urls?.[0]) {
        setFormData((prev) => ({ ...prev, image: data.urls[0] }))
      }
    } catch {
      toast.error("Impossible d'uploader l'image.")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSave() {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Le nom et l'email sont requis.")
      return
    }

    setIsSaving(true)

    const result = await updateProfileAction({
      name:  formData.name,
      email: formData.email,
      image: formData.image || undefined,
    })

    if (result.success) {
      toast.success("Profil mis à jour avec succès.")
    } else {
      toast.error(result.error ?? "Impossible de mettre à jour le profil.")
    }

    setIsSaving(false)
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informations personnelles
        </CardTitle>
        <CardDescription>Modifiez vos informations de profil</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Votre nom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="votre@email.fr"
            />
          </div>
        </div>

        {/* Photo de profil */}
        <div className="space-y-2">
          <Label htmlFor="avatar">Photo de profil</Label>
          <div className="flex items-center gap-3">
            <Input
              ref={inputRef}
              type="file"
              id="avatar"
              accept="image/*"
              className="flex-1"
              disabled={isUploading}
              onChange={handleFileChange}
            />
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : formData.image ? (
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={formData.image} />
                <AvatarFallback>
                  <Camera className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={isSaving || isUploading}>
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Enregistrer</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}