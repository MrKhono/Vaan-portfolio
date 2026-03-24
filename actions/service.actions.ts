"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type ServiceData = {
  title:       string
  price:       string
  description: string | null
  image:       string
  features:    string[]
}

export type Service = ServiceData & {
  id:        string
  createdAt: Date
  updatedAt: Date
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

export async function getServicesAction(): Promise<Service[]> {
  return prisma.service.findMany({ orderBy: { createdAt: "asc" } })
}

export async function createServiceAction(
  data: ServiceData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    if (!data.title.trim()) return { success: false, error: "Le titre est requis" }
    if (!data.price.trim()) return { success: false, error: "Le prix est requis" }

    await prisma.service.create({ data })
    revalidatePath("/")
    revalidatePath("/services")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function updateServiceAction(
  id: string,
  data: ServiceData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    if (!data.title.trim()) return { success: false, error: "Le titre est requis" }
    if (!data.price.trim()) return { success: false, error: "Le prix est requis" }

    await prisma.service.update({ where: { id }, data })
    revalidatePath("/")
    revalidatePath("/services")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function deleteServiceAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.service.delete({ where: { id } })
    revalidatePath("/")
    revalidatePath("/services")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}