"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";

export const runtime = "nodejs"; 

export async function signInEmailAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Entrez un email" };

  const password = String(formData.get("password") ?? "").trim();
  if (!password) return { error: "Entrez un mot de passe" };

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: { email, password },
    });

    // Optionnel : récupérer session si besoin
    // const session = await auth.api.getSession({ headers: await headers() });

    return { success: true, error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: "Email ou mot de passe invalide" };
    }

    console.error("Erreur signin:", err);
    return { success: false, error: "Erreur du serveur interne" };
  }
}