"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";

export async function signInEmailAction(formData: FormData) {

  const email = String(formData.get("email"));
  if (!email) return { error: "Entrez un email" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Entrez un mot de passe" };

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
      },
    });

     return { success: true, error: null };
  } catch (err) {
    if (err instanceof APIError) {
      // return { error: err.message };
      return { error: "Email ou mot de passe invalide" };
    }
   return { success: false, error: "Erreur du serveur interne" };
  }
}
