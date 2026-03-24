"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export const runtime = "nodejs"; 

export type TimeSlot = {
  start: string
  end:   string
}

export type AvailabilityData = {
  date:  string
  slots: TimeSlot[]
}

export type Availability = AvailabilityData & {
  id:        string
  createdAt: Date
  updatedAt: Date
}

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

function parseSlots(raw: unknown): TimeSlot[] {
  if (!Array.isArray(raw)) return []
  return raw as TimeSlot[]
}

export async function getAvailabilitiesAction(): Promise<Availability[]> {
  const rows = await prisma.availability.findMany({ orderBy: { date: "asc" } })
  return rows.map((r) => ({ ...r, slots: parseSlots(r.slots) }))
}

export async function getAvailabilityForDateAction(
  date: string
): Promise<Availability | null> {
  const row = await prisma.availability.findUnique({ where: { date } })
  if (!row) return null
  return { ...row, slots: parseSlots(row.slots) }
}

export async function getAvailableSlotsForDateAction(
  date: string
): Promise<TimeSlot[]> {
  const availability = await getAvailabilityForDateAction(date)
  if (!availability) return []

  // Exclure les créneaux déjà réservés (pending ou confirmed)
  const booked = await prisma.appointment.findMany({
    where: { date, status: { in: ["pending", "confirmed"] } },
    select: { slotStart: true, slotEnd: true },
  })

  return availability.slots.filter(
    (slot) => !booked.some((b) => b.slotStart === slot.start && b.slotEnd === slot.end)
  )
}

export async function saveAvailabilityAction(
  data: AvailabilityData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()

    if (data.slots.length === 0) {
      // Supprimer si aucun créneau
      await prisma.availability.deleteMany({ where: { date: data.date } })
    } else {
      await prisma.availability.upsert({
        where:  { date: data.date },
        update: { slots: data.slots },
        create: { date: data.date, slots: data.slots },
      })
    }

    revalidatePath("/rendez-vous")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}

export async function copyToWeekAction(
  date: string,
  slots: TimeSlot[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth()

    const current    = new Date(date)
    const dayOfWeek  = current.getDay()

    for (let i = 1; i <= 5; i++) {
      if (i === dayOfWeek) continue
      const target = new Date(current)
      target.setDate(current.getDate() - dayOfWeek + i)
      const targetDate = target.toISOString().split("T")[0]

      await prisma.availability.upsert({
        where:  { date: targetDate },
        update: { slots },
        create: { date: targetDate, slots },
      })
    }

    revalidatePath("/rendez-vous")
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Non autorisé")
      return { success: false, error: "Non autorisé" }
    return { success: false, error: "Erreur serveur" }
  }
}