"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"



export type SiteSettings = {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    instagram: string
    facebook: string
    twitter: string
    linkedin: string
  }
}

export async function getSettingsAction(): Promise<SiteSettings> {
  const s = await prisma.siteSettings.findFirst()

  return {
    siteName:        s?.siteName       ?? "",
    siteDescription: s?.seoDescription ?? "",
    contactEmail:    s?.email          ?? "",
    contactPhone:    s?.phone          ?? "",
    address:         s?.address        ?? "",
    socialLinks: {
      instagram: s?.instagram ?? "",
      facebook:  s?.facebook  ?? "",
      twitter:   s?.twitter   ?? "",
      linkedin:  s?.linkedin  ?? "",
    },
  }
}

export async function updateSettingsAction(
  data: SiteSettings
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return { success: false, error: "Non autorisé" }
  }

  try {
    const existing = await prisma.siteSettings.findFirst()

    // On aplatit le type du composant vers le schéma Prisma
    const payload = {
      siteName:       data.siteName,
      seoDescription: data.siteDescription,
      email:          data.contactEmail,
      phone:          data.contactPhone,
      address:        data.address,
      instagram:      data.socialLinks.instagram,
      facebook:       data.socialLinks.facebook,
      twitter:        data.socialLinks.twitter,
      linkedin:       data.socialLinks.linkedin,
    }

    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: payload,
      })
    } else {
      await prisma.siteSettings.create({ data: payload })
    }

    revalidatePath("/")

    return { success: true }
  } catch {
    return { success: false, error: "Erreur serveur, réessayez." }
  }
}