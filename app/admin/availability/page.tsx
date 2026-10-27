"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import {
  getAvailabilitiesAction,
  getAvailabilityForDateAction,
  saveAvailabilityAction,
  copyToWeekAction,
  copyToDayOfMonthAction,
  type Availability,
  type TimeSlot,
} from "@/actions/availability.actions"
import { useToast } from "@/hooks/use-toast"
import { AvailabilityCalendar }        from "./availability-calendar"
import { AvailabilitySidebar }         from "./availability-sidebar"
import { AvailabilitySlotsDialog }     from "./availability-slots-dialog"
import { AvailabilityCopyDialog }      from "./availability-copy-dialog"
import { AvailabilityCopyMonthDialog } from "./availability-copy-month-dialog"

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities]     = useState<Availability[]>([])
  const [currentMonth, setCurrentMonth]         = useState(new Date())
  const [selectedDate, setSelectedDate]         = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen]         = useState(false)
  const [copyDialogOpen, setCopyDialogOpen]     = useState(false)
  const [copyMonthDialogOpen, setCopyMonthDialogOpen] = useState(false)
  const [slots, setSlots]                       = useState<TimeSlot[]>([])
  const [newSlot, setNewSlot]                   = useState<TimeSlot>({ start: "09:00", end: "10:00" })
  const [isSaving, setIsSaving]                 = useState(false)
  const [isCopying, setIsCopying]               = useState(false)
  const [isCopyingMonth, setIsCopyingMonth]     = useState(false)
  const { toast } = useToast()

  const today = new Date().toISOString().split("T")[0]

  async function loadAvailabilities() {
    const data = await getAvailabilitiesAction()
    setAvailabilities(data)
  }

  useEffect(() => { loadAvailabilities() }, [])

  async function handleDateClick(date: Date) {
    const dateStr  = date.toISOString().split("T")[0]
    const existing = await getAvailabilityForDateAction(dateStr)
    setSelectedDate(dateStr)
    setSlots(existing?.slots || [])
    setIsDialogOpen(true)
  }

  function handleAddSlot() {
    if (newSlot.start >= newSlot.end) {
      toast({ title: "Erreur", description: "L'heure de fin doit être après l'heure de début.", variant: "destructive" })
      return
    }
    const overlapping = slots.some(
      (s) => (newSlot.start >= s.start && newSlot.start < s.end) ||
              (newSlot.end > s.start && newSlot.end <= s.end) ||
              (newSlot.start <= s.start && newSlot.end >= s.end)
    )
    if (overlapping) {
      toast({ title: "Erreur", description: "Ce créneau chevauche un créneau existant.", variant: "destructive" })
      return
    }
    setSlots([...slots, newSlot].sort((a, b) => a.start.localeCompare(b.start)))
    setNewSlot({ start: "09:00", end: "10:00" })
  }

  async function handleSave() {
    if (!selectedDate) return
    setIsSaving(true)

    const result = await saveAvailabilityAction({ date: selectedDate, slots })

    if (result.success) {
      toast({ title: "Disponibilités enregistrées", description: "Les créneaux ont été mis à jour." })
      await loadAvailabilities()
      setIsDialogOpen(false)
      setSelectedDate(null)
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" })
    }

    setIsSaving(false)
  }

  async function handleCopyToWeek() {
    if (!selectedDate) return
    setIsCopying(true)

    const result = await copyToWeekAction(selectedDate, slots)

    if (result.success) {
      toast({ title: "Créneaux copiés", description: "Les créneaux ont été appliqués à toute la semaine." })
      await loadAvailabilities()
      setCopyDialogOpen(false)
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" })
    }

    setIsCopying(false)
  }

  async function handleCopyToMonth() {
    if (!selectedDate) return
    setIsCopyingMonth(true)

    const result = await copyToDayOfMonthAction(selectedDate, slots)

    if (result.success) {
      toast({
        title: "Créneaux appliqués",
        description: `Les créneaux ont été appliqués à ${result.count} date${result.count! > 1 ? "s" : ""} du mois.`,
      })
      await loadAvailabilities()
      setCopyMonthDialogOpen(false)
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" })
    }

    setIsCopyingMonth(false)
  }

  return (
    <AdminShell
      title="Disponibilités"
      description="Gérez vos créneaux disponibles pour les rendez-vous"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <AvailabilityCalendar
          currentMonth={currentMonth}
          availabilities={availabilities}
          today={today}
          onDateClick={handleDateClick}
          onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
        />

        <AvailabilitySidebar availabilities={availabilities} />
      </div>

      <AvailabilitySlotsDialog
        open={isDialogOpen}
        selectedDate={selectedDate}
        slots={slots}
        newSlot={newSlot}
        isSaving={isSaving}
        onOpenChange={setIsDialogOpen}
        onNewSlotChange={setNewSlot}
        onAddSlot={handleAddSlot}
        onRemoveSlot={(i) => setSlots(slots.filter((_, idx) => idx !== i))}
        onSave={handleSave}
        onCopyWeek={() => setCopyDialogOpen(true)}
        onCopyMonth={() => setCopyMonthDialogOpen(true)}
      />

      <AvailabilityCopyDialog
        open={copyDialogOpen}
        isCopying={isCopying}
        onOpenChange={setCopyDialogOpen}
        onConfirm={handleCopyToWeek}
      />

      <AvailabilityCopyMonthDialog
        open={copyMonthDialogOpen}
        isCopying={isCopyingMonth}
        selectedDate={selectedDate}
        onOpenChange={setCopyMonthDialogOpen}
        onConfirm={handleCopyToMonth}
      />
    </AdminShell>
  )
}