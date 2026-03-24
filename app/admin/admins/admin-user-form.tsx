"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { ImageUpload } from "@/components/admin/image-upload"
import { Loader2 } from "lucide-react"
import { signUpEmailAction } from "@/actions/sign-up-email.action"
import { toast } from "sonner"

interface AdminUserFormProps {
  open:      boolean
  onClose:   () => void
  onSuccess: () => void
}

const emptyForm = {
  name:     "",
  email:    "",
  password: "",
  image:    "",
}

export function AdminUserForm({ open, onClose, onSuccess }: AdminUserFormProps) {
  const [formData, setFormData] = useState(emptyForm)
  const [isPending, setIsPending] = useState(false)

  function handleClose() {
    setFormData(emptyForm)
    onClose()
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    setIsPending(true)

    // On construit le FormData manuellement pour inclure l'image uploadée
    const form = new FormData()
    form.append("name",     formData.name)
    form.append("email",    formData.email)
    form.append("password", formData.password)
    form.append("image",    formData.image)

    const { error } = await signUpEmailAction(form)

    if (error) {
      toast.error(error)
    } else {
      toast.success("Utilisateur ajouté avec succès.")
      onSuccess()
      handleClose()
    }

    setIsPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouvel administrateur</DialogTitle>
            <DialogDescription>Ajoutez un nouvel administrateur</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name" name="name" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email" name="email" type="email" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean@exemple.fr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password" name="password" type="password" required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mot de passe"
              />
            </div>

            <ImageUpload
              label="Photo de profil"
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
              aspectRatio="square"
              description="Format recommandé : carré, 400x400px minimum"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ajout en cours...</>
              ) : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}