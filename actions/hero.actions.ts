"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type HeroContent = {
  title: string
  subtitle: string
  image: string
}

// — Lecture
export async function getHeroAction(): Promise<HeroContent> {
  const hero = await prisma.hero.findFirst()

  return {
    title: hero?.title ?? "",
    subtitle: hero?.description ?? "",
    image: hero?.backgroundImage ?? "",
  }
}

// — Écriture
export async function updateHeroAction(data: HeroContent): Promise<{ success: boolean; error?: string }> {
  // Vérification de la session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return { success: false, error: "Non autorisé" }
  }

  // Validation
  if (!data.title.trim()) {
    return { success: false, error: "Le titre est requis" }
  }

  if (!data.subtitle.trim()) {
    return { success: false, error: "La description est requise" }
  }

  try {
    const existing = await prisma.hero.findFirst()

    if (existing) {
      await prisma.hero.update({
        where: { id: existing.id },
        data: {
          title: data.title,
          description: data.subtitle,
          backgroundImage: data.image,
        },
      })
    } else {
      await prisma.hero.create({
        data: {
          title: data.title,
          description: data.subtitle,
          backgroundImage: data.image,
        },
      })
    }

    // Revalider la page publique
    revalidatePath("/")

    return { success: true }
  } catch {
    return { success: false, error: "Erreur serveur, réessayez." }
  }
}