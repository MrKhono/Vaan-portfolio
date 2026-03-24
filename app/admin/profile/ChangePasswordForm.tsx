"use client"

import { useState } from "react"
import {
  Card, CardContent, CardHeader,
  CardTitle, CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updatePasswordAction } from "@/actions/user.actions"

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  })
  const [isSaving, setIsSaving]           = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  async function handleChangePassword() {
    if (!formData.currentPassword) {
      toast.error("Veuillez entrer votre mot de passe actuel.")
      return
    }
    if (!formData.newPassword || formData.newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères.")
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.")
      return
    }

    setIsSaving(true)

    const result = await updatePasswordAction({
      currentPassword: formData.currentPassword,
      newPassword:     formData.newPassword,
    })

    if (result.success) {
      toast.success("Mot de passe modifié avec succès.")
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } else {
      toast.error(result.error ?? "Impossible de modifier le mot de passe.")
    }

    setIsSaving(false)
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Changer le mot de passe</CardTitle>
        <CardDescription>Modifiez votre mot de passe de connexion</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { id: "currentPassword", label: "Mot de passe actuel",    field: "currentPassword" },
            { id: "newPassword",     label: "Nouveau mot de passe",   field: "newPassword"     },
            { id: "confirmPassword", label: "Confirmer le mot de passe", field: "confirmPassword" },
          ].map(({ id, label, field }) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                type={showPasswords ? "text" : "password"}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                placeholder={label}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost" size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-muted-foreground"
          >
            {showPasswords ? (
              <><EyeOff className="mr-2 h-4 w-4" />Masquer les mots de passe</>
            ) : (
              <><Eye className="mr-2 h-4 w-4" />Afficher les mots de passe</>
            )}
          </Button>

          <Button onClick={handleChangePassword} disabled={isSaving}>
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Modification...</>
            ) : "Changer le mot de passe"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}