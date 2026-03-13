"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { type Admin } from "@/lib/admin-store";
import { useRouter } from "next/navigation";
import { signUpEmailAction } from "@/actions/sign-up-email.action";
import { toast } from "sonner";

interface AdminFormProps {
  admin?: Admin | null;
  onClose: () => void;
}

export default function AdminForm({ admin, onClose }: AdminFormProps) {
  const [formData, setFormData] = useState({
    name: admin?.name ?? "",
    email: admin?.email ?? "",
    password: "",
    avatar: admin?.avatar ?? "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);

    const form = new FormData(evt.target as HTMLFormElement);
    const { error } = await signUpEmailAction(form);

    if (error) {
      toast.error(error);
    } else {
      toast.success(admin ? "Utilisateur mis à jour" : "Utilisateur ajouté");
      router.refresh(); // ou router.push("/admin/admins");
      onClose();
    }

    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {admin ? "Modifier l'administrateur" : "Nouvel administrateur"}
          </DialogTitle>
          <DialogDescription>
            {admin
              ? "Modifiez les informations de l'administrateur"
              : "Ajoutez un nouvel administrateur"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="jean@exemple.fr"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Mot de passe {admin ? "(laisser vide pour ne pas modifier)" : "*"}
            </Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={admin ? "Nouveau mot de passe" : "Mot de passe"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar (URL)</Label>
            <Input
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              placeholder="/images/avatar.jpg"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {admin ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
}