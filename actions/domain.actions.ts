"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type DomainData = {
  name:        string
  slug:        string
  description: string
  image:       string
}

export type Domain = DomainData & {
  id:        string
  createdAt: Date
  updatedAt: Date
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

function revalidateAll() {
  revalidatePath("/", "layout")          // ← invalide toute l'arborescence
  revalidatePath("/portfolio", "layout")
  revalidatePath("/admin/categories", "layout")
}

export async function getDomainsAction(): Promise<Domain[]> {
  return prisma.domain.findMany({ orderBy: { createdAt: "asc" } })
}

export async function createDomainAction(
  data: DomainData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()

    if (!data.name.trim())        return { success: false, error: "Le nom est requis" }
    if (!data.slug.trim())        return { success: false, error: "Le slug est requis" }
    if (!data.description.trim()) return { success: false, error: "La description est requise" }

    const existing = await prisma.domain.findUnique({ where: { slug: data.slug } })
    if (existing) return { success: false, error: "Ce slug est déjà utilisé" }

    await prisma.domain.create({ data })
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function updateDomainAction(
  id: string,
  data: DomainData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()

    if (!data.name.trim())        return { success: false, error: "Le nom est requis" }
    if (!data.slug.trim())        return { success: false, error: "Le slug est requis" }
    if (!data.description.trim()) return { success: false, error: "La description est requise" }

    const existing = await prisma.domain.findUnique({ where: { slug: data.slug } })
    if (existing && existing.id !== id)
      return { success: false, error: "Ce slug est déjà utilisé" }

    await prisma.domain.update({ where: { id }, data })
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function deleteDomainAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.domain.delete({ where: { id } })
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}