"use server"

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs"; // ← obligatoire pour lire la session côté serveur

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
};

// Helper pour vérifier la session
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");
  return session;
}

// Actions
export async function getUsersCountAction(): Promise<number> {
  await requireAuth(); // sécuriser l'accès si nécessaire
  return prisma.user.count();
}

export async function getUsersAction(): Promise<AdminUser[]> {
  await requireAuth();
  return prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  });
}

export async function getCurrentUserAction(): Promise<AdminUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  });
}

export async function deleteUserAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await requireAuth();

    if (session.user.id === id) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte." };
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" };
    return { success: false, error: "Erreur serveur" };
  }
}

export async function updateProfileAction(data: {
  name: string;
  email: string;
  image?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await requireAuth();

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: data.name, email: data.email, image: data.image ?? null },
    });

    revalidatePath("/admin/profile");
    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" };
    return { success: false, error: "Erreur serveur" };
  }
}

export async function updatePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await requireAuth();

    await auth.api.changePassword({
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message === "Non autorisé") return { success: false, error: "Non autorisé" };
      return { success: false, error: e.message };
    }
    return { success: false, error: "Erreur serveur" };
  }
}