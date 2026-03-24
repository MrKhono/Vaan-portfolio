"use server"

import { auth, ErrorCode } from "@/lib/auth"
import { APIError } from "better-auth/api"

export async function signUpEmailAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  if (!name) return { error: "Entrez un nom" }

  const email = String(formData.get("email") ?? "").trim()
  if (!email) return { error: "Entrez un email" }

  const password = String(formData.get("password") ?? "").trim()
  if (!password) return { error: "Entrez un mot de passe" }

  // null si vide — better-auth stocke null dans User.image si pas d'image
  const imageRaw = String(formData.get("image") ?? "").trim()
  const image    = imageRaw || undefined

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        image,
      },
    })
    return { error: null }
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN"

      switch (errCode) {
        case "USER_ALREADY_EXISTS":
          return { error: "Utilisateur déjà existant !" }
        default:
          return { error: err.message }
      }
    }
    return { error: "Erreur du serveur interne" }
  }
}