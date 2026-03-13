"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";

export async function signInEmailAction(formData: FormData) {
  const name = String(formData.get("name"));
  if (!name) return { error: "Entrez un nom" };

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
      asResponse: true,
    });

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }
    return { error: "Erruer du serveur interne" };
  }
}
