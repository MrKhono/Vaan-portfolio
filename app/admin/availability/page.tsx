"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Plus, Trash2, Clock, ChevronLeft, ChevronRight, Copy } from "lucide-react"
import {
  getAvailabilities,
  addAvailability,
  updateAvailability,
  deleteAvailability,
  type Availability,
  type TimeSlot,
} from "@/lib/admin-store"
import { cn } from "@/lib/utils"

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
const DAYS_OF_WEEK_FULL = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
const MONTHS = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]

const TIME_OPTIONS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
]

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [newSlot, setNewSlot] = useState<TimeSlot>({ start: "09:00", end: "10:00" })
  const [copyDialogOpen, setCopyDialogOpen] = useState(false)
  const [copyToWeek, setCopyToWeek] = useState(false)

  useEffect(() => {
    loadAvailabilities()
  }, [])

  const loadAvailabilities = () => {
    setAvailabilities(getAvailabilities())
  }

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days: Date[] = []
    const current = new Date(startDate)
    
    while (current <= lastDay || days.length % 7 !== 0) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]
  }

  const getAvailabilityForDate = (date: string): Availability | undefined => {
    return availabilities.find((a) => a.date === date)
  }

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date)
    const existing = getAvailabilityForDate(dateStr)
    
    setSelectedDate(dateStr)
    setSlots(existing?.slots || [])
    setIsDialogOpen(true)
  }

  const handleAddSlot = () => {
    if (newSlot.start >= newSlot.end) {
      alert("L'heure de fin doit etre apres l'heure de debut")
      return
    }
    
    const overlapping = slots.some(
      (slot) =>
        (newSlot.start >= slot.start && newSlot.start < slot.end) ||
        (newSlot.end > slot.start && newSlot.end <= slot.end) ||
        (newSlot.start <= slot.start && newSlot.end >= slot.end)
    )
    
    if (overlapping) {
      alert("Ce creneau chevauche un creneau existant")
      return
    }
    
    setSlots([...slots, newSlot].sort((a, b) => a.start.localeCompare(b.start)))
    setNewSlot({ start: "09:00", end: "10:00" })
  }

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!selectedDate) return
    
    const existing = getAvailabilityForDate(selectedDate)
    
    if (slots.length === 0) {
      if (existing) {
        deleteAvailability(existing.id)
      }
    } else if (existing) {
      updateAvailability(existing.id, { slots })
    } else {
      addAvailability({ date: selectedDate, slots })
    }
    
    loadAvailabilities()
    setIsDialogOpen(false)
    setSelectedDate(null)
  }

  const handleCopyToWeek = () => {
    if (!selectedDate || slots.length === 0) return
    
    const currentDate = new Date(selectedDate)
    const dayOfWeek = currentDate.getDay()
    
    // Copy to all weekdays of the current week
    for (let i = 1; i <= 5; i++) { // Monday to Friday
      if (i === dayOfWeek) continue
      
      const targetDate = new Date(currentDate)
      targetDate.setDate(currentDate.getDate() - dayOfWeek + i)
      const targetDateStr = formatDate(targetDate)
      
      const existing = getAvailabilityForDate(targetDateStr)
      if (existing) {
        updateAvailability(existing.id, { slots })
      } else {
        addAvailability({ date: targetDateStr, slots })
      }
    }
    
    loadAvailabilities()
    setCopyDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteAvailability(deleteId)
      loadAvailabilities()
      setDeleteId(null)
    }
  }

  const calendarDays = getCalendarDays()
  const today = formatDate(new Date())

  return (
    <AdminShell
      title="Disponibilites"
      description="Gerez vos creneaux disponibles pour les rendez-vous"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendrier
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-32 text-center font-medium">
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days header */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const dateStr = formatDate(date)
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                const isToday = dateStr === today
                const isPast = dateStr < today
                const availability = getAvailabilityForDate(dateStr)
                const hasSlots = availability && availability.slots.length > 0
                
                return (
                  <button
                    key={index}
                    onClick={() => !isPast && handleDateClick(date)}
                    disabled={isPast}
                    className={cn(
                      "relative flex min-h-20 flex-col items-center rounded-lg border p-2 transition-colors",
                      isCurrentMonth ? "bg-card" : "bg-muted/30",
                      isPast && "cursor-not-allowed opacity-50",
                      !isPast && "hover:border-primary hover:bg-muted/50",
                      isToday && "ring-2 ring-primary",
                      hasSlots && "border-primary/50 bg-primary/5"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      !isCurrentMonth && "text-muted-foreground"
                    )}>
                      {date.getDate()}
                    </span>
                    {hasSlots && (
                      <div className="mt-1 flex flex-col items-center gap-0.5">
                        <Badge variant="secondary" className="text-xs">
                          {availability.slots.length} creneau{availability.slots.length > 1 ? "x" : ""}
                        </Badge>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Legende</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border-2 border-primary" />
                <span className="text-sm text-muted-foreground">{"Aujourd'hui"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border border-primary/50 bg-primary/10" />
                <span className="text-sm text-muted-foreground">Creneaux disponibles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-muted/50 opacity-50" />
                <span className="text-sm text-muted-foreground">Date passee</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Cliquez sur une date pour ajouter ou modifier vos disponibilites.</p>
              <p>Vous pouvez ajouter plusieurs creneaux par jour.</p>
              <p>Utilisez la fonction de copie pour dupliquer vos creneaux sur toute la semaine.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jours disponibles</span>
                  <span className="font-medium">{availabilities.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total creneaux</span>
                  <span className="font-medium">
                    {availabilities.reduce((acc, a) => acc + a.slots.length, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit slots dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && new Date(selectedDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </DialogTitle>
            <DialogDescription>
              Definissez vos creneaux disponibles pour cette journee
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Add new slot */}
            <div className="space-y-3">
              <Label>Ajouter un creneau</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={newSlot.start}
                  onValueChange={(value) => setNewSlot({ ...newSlot, start: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">a</span>
                <Select
                  value={newSlot.end}
                  onValueChange={(value) => setNewSlot({ ...newSlot, end: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddSlot} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Current slots */}
            <div className="space-y-2">
              <Label>Creneaux configures</Label>
              {slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun creneau configure pour cette journee
                </p>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {slot.start} - {slot.end}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveSlot(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {slots.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setCopyDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copier sur la semaine
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy confirmation dialog */}
      <AlertDialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Copier les creneaux</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va copier les creneaux actuels sur tous les jours de la semaine (lundi a vendredi). Les creneaux existants seront remplaces.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCopyToWeek}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer les disponibilites</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer les disponibilites pour cette date ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
