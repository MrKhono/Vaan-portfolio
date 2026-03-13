"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Loader2, Eye, EyeOff, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateAdmin, getCurrentUser, type Admin } from "@/lib/admin-store"

interface EditProfileFormProps {
  user: Admin
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ title: "Erreur", description: "Le nom et l'email sont requis.", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      updateAdmin(user.id, {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      })

      const updatedUser = getCurrentUser()
      if (updatedUser) {
        localStorage.setItem("admin_current_user", JSON.stringify({
          ...updatedUser,
          name: formData.name,
          email: formData.email,
          avatar: formData.avatar,
        }))
      }

      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." })
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le profil.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
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

        <div className="space-y-2">
          <Label htmlFor="avatar">Photo de profil (URL)</Label>
          <div className="flex gap-3">
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="/images/avatar.jpg"
              className="flex-1"
            />
            {formData.avatar && (
              <Avatar className="h-10 w-10">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback>
                  <Camera className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}