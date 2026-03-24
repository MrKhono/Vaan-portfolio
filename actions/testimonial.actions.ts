"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type TestimonialData = {
  name:    string
  title:   string
  content: string
}

export type Testimonial = TestimonialData & {
  id:        string
  createdAt: Date
  updatedAt: Date
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

export async function getTestimonialsAction(): Promise<Testimonial[]> {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } })
}

export async function createTestimonialAction(
  data: TestimonialData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    if (!data.name.trim())    return { success: false, error: "Le nom est requis" }
    if (!data.content.trim()) return { success: false, error: "Le témoignage est requis" }

    await prisma.testimonial.create({ data })
    revalidatePath("/")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function updateTestimonialAction(
  id: string,
  data: TestimonialData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    if (!data.name.trim())    return { success: false, error: "Le nom est requis" }
    if (!data.content.trim()) return { success: false, error: "Le témoignage est requis" }

    await prisma.testimonial.update({ where: { id }, data })
    revalidatePath("/")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function deleteTestimonialAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.testimonial.delete({ where: { id } })
    revalidatePath("/")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}