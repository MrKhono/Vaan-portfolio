"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type ExperienceData = {
  year:        string
  title:       string
  description: string
}

export type Experience = ExperienceData & {
  id:        string
  order:     number
  createdAt: Date
  updatedAt: Date
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

export async function getExperiencesAction(): Promise<Experience[]> {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  })
  return experiences.map((e) => ({
    ...e,
    description: e.description ?? "",
  }))
}

export async function createExperienceAction(
  data: ExperienceData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    if (!data.year.trim())  return { success: false, error: "L'année est requise" }
    if (!data.title.trim()) return { success: false, error: "Le titre est requis" }

    const last = await prisma.experience.findFirst({ orderBy: { order: "desc" } })
    await prisma.experience.create({
      data: {
        year:        data.year,
        title:       data.title,
        description: data.description || null,
        order:       (last?.order ?? -1) + 1,
      },
    })

    revalidatePath("/about")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function updateExperienceAction(
  id: string,
  data: ExperienceData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    if (!data.year.trim())  return { success: false, error: "L'année est requise" }
    if (!data.title.trim()) return { success: false, error: "Le titre est requis" }

    await prisma.experience.update({
      where: { id },
      data: {
        year:        data.year,
        title:       data.title,
        description: data.description || null,
      },
    })

    revalidatePath("/about")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function deleteExperienceAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.experience.delete({ where: { id } })
    revalidatePath("/about")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}