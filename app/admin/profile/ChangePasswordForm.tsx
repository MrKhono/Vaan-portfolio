"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateAdmin, getCurrentUser, type Admin } from "@/lib/admin-store"

interface ChangePasswordFormProps {
  user: Admin
}

export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const { toast } = useToast()

  const handleChangePassword = async () => {
    if (!formData.currentPassword) {
      toast({ title: "Erreur", description: "Veuillez entrer votre mot de passe actuel.", variant: "destructive" })
      return
    }

    if (formData.currentPassword !== user.password) {
      toast({ title: "Erreur", description: "Le mot de passe actuel est incorrect.", variant: "destructive" })
      return
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      toast({ title: "Erreur", description: "Le nouveau mot de passe doit contenir au moins 6 caractères.", variant: "destructive" })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      updateAdmin(user.id, { password: formData.newPassword })

      const updatedUser = getCurrentUser()
      if (updatedUser) {
        localStorage.setItem("admin_current_user", JSON.stringify({ ...updatedUser, password: formData.newPassword }))
      }

      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast({ title: "Mot de passe modifié", description: "Votre mot de passe a été changé avec succès." })
    } catch {
      toast({ title: "Erreur", description: "Impossible de modifier le mot de passe.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Changer le mot de passe</CardTitle>
        <CardDescription>Modifiez votre mot de passe de connexion</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              type={showPasswords ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="Mot de passe actuel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type={showPasswords ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="Nouveau mot de passe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirmer"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-muted-foreground"
          >
            {showPasswords ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Masquer les mots de passe
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Afficher les mots de passe
              </>
            )}
          </Button>

          <Button onClick={handleChangePassword} disabled={isSaving}>
            Changer le mot de passe
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}