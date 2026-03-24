"use server"

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";



export type TestimonialData = {
  name: string;
  title: string;
  content: string;
};

export type Testimonial = TestimonialData & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Helper pour sécuriser l'accès
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");
  return session; // retourne la session si nécessaire
}

// Récupération des témoignages (public)
export async function getTestimonialsAction(): Promise<Testimonial[]> {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

// Création d'un témoignage (protégé)
export async function createTestimonialAction(
  data: TestimonialData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    if (!data.name.trim()) return { success: false, error: "Le nom est requis" };
    if (!data.content.trim()) return { success: false, error: "Le témoignage est requis" };

    await prisma.testimonial.create({ data });
    revalidatePath("/"); // revalide la page d'accueil si nécessaire
    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé") {
      return { success: false, error: "Non autorisé" };
    }
    console.error("Erreur Testimonial:", e);
    return { success: false, error: "Erreur serveur" };
  }
}

// Mise à jour d'un témoignage (protégé)
export async function updateTestimonialAction(
  id: string,
  data: TestimonialData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    if (!data.name.trim()) return { success: false, error: "Le nom est requis" };
    if (!data.content.trim()) return { success: false, error: "Le témoignage est requis" };

    await prisma.testimonial.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé") {
      return { success: false, error: "Non autorisé" };
    }
    console.error("Erreur Testimonial Update:", e);
    return { success: false, error: "Erreur serveur" };
  }
}

// Suppression d'un témoignage (protégé)
export async function deleteTestimonialAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé") {
      return { success: false, error: "Non autorisé" };
    }
    console.error("Erreur Testimonial Delete:", e);
    return { success: false, error: "Erreur serveur" };
  }
}