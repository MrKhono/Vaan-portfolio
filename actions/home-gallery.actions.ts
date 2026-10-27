"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const MAX_PHOTOS = 15

export type HomeGalleryPhotoData = {
  image:    string
  title:    string
  category: string
  order:    number
}

export type HomeGalleryPhoto = HomeGalleryPhotoData & {
  id:        string
  createdAt: Date
  updatedAt: Date
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

function revalidateAll() {
  revalidatePath("/", "layout")
  revalidatePath("/admin/home-gallery", "layout")
}

export async function getHomeGalleryPhotosAction(): Promise<HomeGalleryPhoto[]> {
  return prisma.homeGalleryPhoto.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })
}

export async function createHomeGalleryPhotoAction(
  data: HomeGalleryPhotoData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()

    if (!data.image.trim()) {
      return { success: false, error: "L'image est requise" }
    }

    const count = await prisma.homeGalleryPhoto.count()
    if (count >= MAX_PHOTOS) {
      return {
        success: false,
        error: `Vous avez atteint la limite de ${MAX_PHOTOS} photos. Supprimez-en une avant d'en ajouter.`,
      }
    }

    await prisma.homeGalleryPhoto.create({
      data: {
        image:    data.image,
        title:    data.title,
        category: data.category,
        order:    data.order || count,
      },
    })

    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function updateHomeGalleryPhotoAction(
  id: string,
  data: HomeGalleryPhotoData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()

    if (!data.image.trim()) {
      return { success: false, error: "L'image est requise" }
    }

    await prisma.homeGalleryPhoto.update({
      where: { id },
      data: {
        image:    data.image,
        title:    data.title,
        category: data.category,
        order:    data.order,
      },
    })

    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function deleteHomeGalleryPhotoAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.homeGalleryPhoto.delete({ where: { id } })
    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function reorderHomeGalleryPhotosAction(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.homeGalleryPhoto.update({
          where: { id },
          data:  { order: index },
        })
      )
    )

    revalidateAll()
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function getHomeGalleryCountAction(): Promise<number> {
  return prisma.homeGalleryPhoto.count()
}

export async function createHomeGalleryPhotosAction(
  images: string[]
): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    await requireAuth()

    if (images.length === 0) {
      return { success: false, error: "Aucune image à ajouter" }
    }

    const currentCount = await prisma.homeGalleryPhoto.count()
    const available    = MAX_PHOTOS - currentCount

    if (available <= 0) {
      return {
        success: false,
        error: `Vous avez atteint la limite de ${MAX_PHOTOS} photos.`,
      }
    }

    const toInsert = images.slice(0, available).filter((img) => img.trim())

    await prisma.homeGalleryPhoto.createMany({
      data: toInsert.map((image, index) => ({
        image,
        title:    "",
        category: "",
        order:    currentCount + index,
      })),
    })

    revalidateAll()
    return { success: true, count: toInsert.length }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}