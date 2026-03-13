"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAuth } from "@/components/admin/auth-context";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  type Admin,
} from "@/lib/admin-store";
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Users,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner"
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const emptyAdmin = {
  name: "",
  email: "",
  password: "",
  role: "admin" as "admin" | "super_admin",
  avatar: "",
};

export default function AdminAdminsPage() {
  const { user: currentUser } = useAuth();
  const [admins, setAdminsState] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyAdmin);
  const [showPassword, setShowPassword] = useState(false);
  // const { toast } = useToast();

  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAdminsState(getAdmins());
    setIsLoading(false);
  }, []);

  const isSuperAdmin = currentUser?.role === "super_admin";

  const handleOpenDialog = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        password: "", // Don't show existing password
        role: admin.role,
        avatar: admin.avatar || "",
      });
    } else {
      setEditingAdmin(null);
      setFormData(emptyAdmin);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAdmin(null);
    setFormData(emptyAdmin);
    setShowPassword(false);
  };

  // const handleSave = () => {
  //   if (!formData.name.trim() || !formData.email.trim()) {
  //     toast({
  //       title: "Erreur",
  //       description: "Le nom et l'email sont requis.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (!editingAdmin && !formData.password.trim()) {
  //     toast({
  //       title: "Erreur",
  //       description:
  //         "Le mot de passe est requis pour un nouvel administrateur.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //     if (editingAdmin) {
  //       const updates: Partial<Admin> = {
  //         name: formData.name,
  //         email: formData.email,
  //         role: formData.role,
  //         avatar: formData.avatar,
  //       };
  //       if (formData.password.trim()) {
  //         updates.password = formData.password;
  //       }
  //       updateAdmin(editingAdmin.id, updates);
  //       toast({
  //         title: "Administrateur modifie",
  //         description: "L'administrateur a ete mis a jour avec succes.",
  //       });
  //     } else {
  //       addAdmin(formData);
  //       toast({
  //         title: "Administrateur ajoute",
  //         description: "Le nouvel administrateur a ete cree avec succes.",
  //       });
  //     }
  //     setAdminsState(getAdmins());
  //     handleCloseDialog();
  //   } catch {
  //     toast({
  //       title: "Erreur",
  //       description: "Impossible d'enregistrer l'administrateur.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleDelete = () => {
    if (!deletingId) return;

    // Prevent deleting yourself
    if (deletingId === currentUser?.id) { 
      toast.error("Vous ne pouvez pas supprimer votre propre compte.")
      setIsDeleteOpen(false);
      setDeletingId(null);
      return;
    }

    // Prevent deleting the last super admin
    const adminToDelete = admins.find((a) => a.id === deletingId);
    if (adminToDelete?.role === "super_admin") {
      const superAdminCount = admins.filter(
        (a) => a.role === "super_admin",
      ).length;
      if (superAdminCount <= 1) {
        toast.error("Vous ne pouvez pas supprimer le dernier super administrateur.")
        setIsDeleteOpen(false);
        setDeletingId(null);
        return;
      }
    }

    try {
      deleteAdmin(deletingId);
      setAdminsState(getAdmins());
       toast.success("L'administrateur a ete supprime avec succes.")
    } catch {
      toast.error("Impossible de supprimer l'administrateur.")
    } finally {
      setIsDeleteOpen(false);
      setDeletingId(null);
    }
  };

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    
    const formData = new FormData(evt.target as HTMLFormElement);

    const name = String(formData.get("name"));
    if (!name) return toast.error("Entrez un nom");

    const email = String(formData.get("email"));
    if (!email) return toast.error("Entrez un email");

    const password = String(formData.get("password"));
    if (!password) return toast.error("Entrez un mot de passe");

    // console.log({ name, email, password });

    await signUp.email(
      {
        name,
        email,
        password
      },
      {
        onRequest: () => {
          setIsPending(true)
        },
        onResponse: () => {
          setIsPending(false)
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        },
        onSuccess: () => {
          router.push("/admin/admins")
          toast.success("Utilisateur ajouté")
        },
      }
    )
  }

  // if (isLoading) {
  //   return (
  //     <AdminShell
  //       title="Administrateurs"
  //       description="Gerez les acces au panel d'administration"
  //     >
  //       <div className="flex items-center justify-center py-12">
  //         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  //       </div>
  //     </AdminShell>
  //   );
  // }

  return (
    <AdminShell
      title="Administrateurs"
      description="Gerez les acces au panel d'administration"
      actions={
        isSuperAdmin && (
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel administrateur
          </Button>
        )
      }
    >
      {!isSuperAdmin && (
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Seuls les super administrateurs peuvent gerer les comptes
              administrateurs.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Admins grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {admins.map((admin) => (
          <Card
            key={admin.id}
            className={
              admin.id === currentUser?.id ? "ring-2 ring-primary" : ""
            }
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={admin.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {admin.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{admin.name}</h3>
                    {admin.id === currentUser?.id && (
                      <Badge variant="outline" className="text-xs">
                        Vous
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {admin.email}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    {admin.role === "super_admin" ? (
                      <Badge className="gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Super Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="mt-4 flex justify-end gap-1 border-t border-border pt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(admin)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      setDeletingId(admin.id);
                      setIsDeleteOpen(true);
                    }}
                    disabled={admin.id === currentUser?.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {admins.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucun administrateur</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ajoutez des administrateurs pour gerer le site
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingAdmin
                  ? "Modifier l'administrateur"
                  : "Nouvel administrateur"}
              </DialogTitle>
              <DialogDescription>
                {editingAdmin
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Mot de passe{" "}
                  {editingAdmin ? "(laisser vide pour ne pas modifier)" : "*"}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={
                    editingAdmin ? "Nouveau mot de passe" : "Mot de passe"
                  }
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
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Annuler
              </Button>
              <Button type="submit">
                {editingAdmin ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet administrateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. L&apos;administrateur perdra son
              acces au panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
