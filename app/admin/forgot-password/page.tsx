"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState("")
  const [isPending, setIsPending] = useState(false)
  const [isSent, setIsSent]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setIsPending(true)

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/admin/reset-password",
    })

    if (error) {
      toast.error(error.message || "Impossible d'envoyer l'email.")
    } else {
      setIsSent(true)
    }

    setIsPending(false)
  }

  if (isSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="font-serif text-2xl font-semibold">Email envoyé</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email contenant les instructions pour réinitialiser votre mot de passe.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Pensez à vérifier vos spams.
            </p>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link href="/admin/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi en cours...</>
              ) : "Envoyer le lien"}
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/admin/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}