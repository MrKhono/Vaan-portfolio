"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/admin/auth-context"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { signInEmailAction } from "@/actions/sign-in-email.action";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);

    // const { error } = await signInEmailAction(formData);

    const result = await signInEmailAction(formData);

    if (!result.success) {
      toast.error(result.error || "Erreur de connexion");
      setIsPending(false);
      return;
    }

    toast.success("Connexion réussie");
    router.push("/admin");

    setIsPending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-muted/50 to-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl text-primary-foreground shadow-lg">
            {/* <Camera className="h-5 w-5" /> */}
            <img
              src="/sno.png"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div>
            <CardTitle className="font-serif text-2xl">
              Administration
            </CardTitle>
            <CardDescription className="mt-1">
              Connectez-vous pour acceder au panel d&apos;administration
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Masquer" : "Afficher"} le mot de passe
                  </span>
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Identifiants par defaut:</strong>
              <br />
              Email: admin@alexandre-photo.fr
              <br />
              Mot de passe: admin123
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
