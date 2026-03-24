"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";



export type ProjectData = {
  title: string;
  description: string;
  coverImage: string;
  images: string[];
  date: string;
  location: string;
  client: string;
  camera: string;
  lens: string;
  domainId: string;
};

export type Project = ProjectData & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  domain: { id: string; name: string; slug: string };
};

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");
}

export async function getProjectsAction(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { domain: { select: { id: true, name: true, slug: true } } },
  });

  return projects.map((p) => ({
    ...p,
    description: p.description ?? "",
  }));
}

export async function createProjectAction(
  data: ProjectData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    if (!data.title.trim())
      return { success: false, error: "Le titre est requis" };
    if (!data.domainId.trim())
      return { success: false, error: "Le domaine est requis" };

    await prisma.project.create({
      data: {
        title: data.title,
        description: data.description || null,
        coverImage: data.coverImage,
        images: data.images,
        date: data.date,
        location: data.location,
        client: data.client,
        camera: data.camera,
        lens: data.lens,
        domainId: data.domainId,
      },
    });

    revalidatePath("/portfolio");
    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" };
    return { success: false, error: "Erreur serveur" };
  }
}

export async function updateProjectAction(
  id: string,
  data: ProjectData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    if (!data.title.trim())
      return { success: false, error: "Le titre est requis" };
    if (!data.domainId.trim())
      return { success: false, error: "Le domaine est requis" };

    await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        coverImage: data.coverImage,
        images: data.images,
        date: data.date,
        location: data.location,
        client: data.client,
        camera: data.camera,
        lens: data.lens,
        domainId: data.domainId,
      },
    });

    revalidatePath("/portfolio");
    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" };
    return { success: false, error: "Erreur serveur" };
  }
}

export async function deleteProjectAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();
    await prisma.project.delete({ where: { id } });
    revalidatePath("/portfolio");
    return { success: true };
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" };
    return { success: false, error: "Erreur serveur" };
  }
}
