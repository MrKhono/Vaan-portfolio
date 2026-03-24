"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"


export type AboutStat = {
  value: string
  label: string
}

export type AboutValue = {
  icon:        string
  title:       string
  description: string
}

export type AboutContent = {
  title:       string
  subtitle:    string
  description: string
  image:       string
  stats:       AboutStat[]
  values:      AboutValue[]
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

export async function getAboutAction(): Promise<AboutContent> {
  const about = await prisma.about.findFirst({
    include: {
      stats:  { orderBy: { order: "asc" } },
      values: { orderBy: { order: "asc" } },
    },
  })

  return {
    title:       about?.title       ?? "",
    subtitle:    about?.subtitle    ?? "",
    description: about?.description ?? "",
    image:       about?.image       ?? "",
    stats: about?.stats.map((s) => ({
      value: s.value,
      label: s.label,
    })) ?? [],
    values: about?.values.map((v) => ({
      icon:        v.icon,
      title:       v.title,
      description: v.description,
    })) ?? [],
  }
}

export async function updateAboutAction(
  data: AboutContent
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()

    const existing = await prisma.about.findFirst()

    if (existing) {
      // Supprimer stats et values existantes puis recréer
      await prisma.aboutStat.deleteMany({ where: { aboutId: existing.id } })
      await prisma.aboutValue.deleteMany({ where: { aboutId: existing.id } })

      await prisma.about.update({
        where: { id: existing.id },
        data: {
          title:       data.title,
          subtitle:    data.subtitle,
          description: data.description,
          image:       data.image,
          stats: {
            create: data.stats.map((s, i) => ({
              value: s.value,
              label: s.label,
              order: i,
            })),
          },
          values: {
            create: data.values.map((v, i) => ({
              icon:        v.icon,
              title:       v.title,
              description: v.description,
              order:       i,
            })),
          },
        },
      })
    } else {
      await prisma.about.create({
        data: {
          title:       data.title,
          subtitle:    data.subtitle,
          description: data.description,
          image:       data.image,
          stats: {
            create: data.stats.map((s, i) => ({
              value: s.value,
              label: s.label,
              order: i,
            })),
          },
          values: {
            create: data.values.map((v, i) => ({
              icon:        v.icon,
              title:       v.title,
              description: v.description,
              order:       i,
            })),
          },
        },
      })
    }

    revalidatePath("/")
    revalidatePath("/about")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}