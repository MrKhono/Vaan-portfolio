"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { error } from "console";

export async function signUpEmailAction(formData: FormData) {
  const name = String(formData.get("name"));
  if (!name) return { error: "Entrez un nom" };

  const email = String(formData.get("email"));
  if (!email) return { error: "Entrez un email" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Entrez un mot de passe" };

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";

      switch (errCode) {
        case "USER_ALREADY_EXISTS":
          return {error : "Utilisateur déjà existant !"}
        default:
          return { error : err.message}
      }
    }
    return { error: "Erruer du serveur interne" };
  }
}
