"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type AppointmentData = {
  clientName:  string
  clientEmail: string
  clientPhone: string
  serviceType: string
  message:     string
  date:        string
  slotStart:   string
  slotEnd:     string
}

export type Appointment = AppointmentData & {
  id:         string
  status:     string
  adminNotes: string | null
  createdAt:  Date
  updatedAt:  Date
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

export async function getAppointmentsAction(): Promise<Appointment[]> {
  const rows = await prisma.appointment.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  })
  return rows.map((r) => ({ ...r, message: r.message ?? "", adminNotes: r.adminNotes }))
}

export async function createAppointmentAction(
  data: AppointmentData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.clientName.trim())  return { success: false, error: "Le nom est requis" }
    if (!data.clientEmail.trim()) return { success: false, error: "L'email est requis" }
    if (!data.clientPhone.trim()) return { success: false, error: "Le téléphone est requis" }
    if (!data.serviceType.trim()) return { success: false, error: "Le service est requis" }

    // Vérifier que le créneau est toujours disponible
    const conflict = await prisma.appointment.findFirst({
      where: {
        date:       data.date,
        slotStart:  data.slotStart,
        slotEnd:    data.slotEnd,
        status:     { in: ["pending", "confirmed"] },
      },
    })

    if (conflict) return { success: false, error: "Ce créneau n'est plus disponible" }

    await prisma.appointment.create({ data: { ...data, status: "pending" } })
    revalidatePath("/admin/rendez-vous")
    return { success: true }
  } catch {
    return { success: false, error: "Erreur serveur" }
  }
}

export async function confirmAppointmentAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.appointment.update({ where: { id }, data: { status: "confirmed" } })
    revalidatePath("/admin/rendez-vous")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function rejectAppointmentAction(
  id: string,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.appointment.update({
      where: { id },
      data:  { status: "rejected", adminNotes: adminNotes || null },
    })
    revalidatePath("/admin/rendez-vous")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function cancelAppointmentAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.appointment.update({ where: { id }, data: { status: "cancelled" } })
    revalidatePath("/admin/rendez-vous")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function deleteAppointmentAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()
    await prisma.appointment.delete({ where: { id } })
    revalidatePath("/admin/rendez-vous")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function getPendingAppointmentsCountAction(): Promise<number> {
  return prisma.appointment.count({
    where: { status: "pending" },
  })
}