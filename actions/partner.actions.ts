"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type PartnerData = {
  name:    string
  logo:    string
  website: string
}

export type Partner = PartnerData & {
  id:        string
  createdAt: Date
  updatedAt: Date
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

export async function getPartnersAction(): Promise<Partner[]> {
  return prisma.partner.findMany({ orderBy: { createdAt: "asc" } })
}

export async function createPartnerAction(
  data: PartnerData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    if (!data.name.trim()) return { success: false, error: "Le nom est requis" }

    await prisma.partner.create({ data })
    revalidatePath("/")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function updatePartnerAction(
  id: string,
  data: PartnerData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    if (!data.name.trim()) return { success: false, error: "Le nom est requis" }

    await prisma.partner.update({ where: { id }, data })
    revalidatePath("/")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function deletePartnerAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.partner.delete({ where: { id } })
    revalidatePath("/")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}