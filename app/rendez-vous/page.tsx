"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Calendar, Clock, User, Mail, Phone, Briefcase,
  ChevronLeft, ChevronRight, CheckCircle2,
  ArrowRight, ArrowLeft, MapPin, Loader2,
} from "lucide-react"
import {
  getAvailabilitiesAction,
  getAvailableSlotsForDateAction,
  type TimeSlot,
} from "@/actions/availability.actions"
import { createAppointmentAction } from "@/actions/appointment.actions"
import { getServicesAction } from "@/actions/service.actions"
import { getSettingsAction } from "@/actions/settings.actions"
import { FadeIn } from "@/components/motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]

type BookingStep = "date" | "time" | "details" | "confirmation";

export const dynamic = "force-dynamic";

export default function BookingPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [services, setServices]             = useState<{ id: string; title: string }[]>([])
  const [address, setAddress]               = useState("")
  const [step, setStep]                     = useState<BookingStep>("date")
  const [isSubmitting, setIsSubmitting]     = useState(false)
  const [formData, setFormData] = useState({
    clientName: "", clientEmail: "", clientPhone: "",
    serviceType: "", message: "",
  })

  useEffect(() => {
    async function load() {
      const [avs, svcs, settings] = await Promise.all([
        getAvailabilitiesAction(),
        getServicesAction(),
        getSettingsAction(),
      ])
      const today = new Date().toISOString().split("T")[0]
      setAvailableDates(avs.filter((a) => a.date >= today && a.slots.length > 0).map((a) => a.date))
      setServices(svcs)
      setAddress(settings.address)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedDate) return
    getAvailableSlotsForDateAction(selectedDate).then(setAvailableSlots)
  }, [selectedDate])

  const formatDate = (d: Date) => d.toISOString().split("T")[0]

  const calendarDays = useMemo(() => {
    const year  = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const first = new Date(year, month, 1)
    const last  = new Date(year, month + 1, 0)
    const start = new Date(first)
    start.setDate(start.getDate() - first.getDay())
    const days: Date[] = []
    const cur = new Date(start)
    while (cur <= last || days.length % 7 !== 0) {
      days.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }
    return days
  }, [currentMonth])

  const today = formatDate(new Date())

  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : ""

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDate(date)
    if (!availableDates.includes(dateStr)) return
    setSelectedDate(dateStr)
    setSelectedSlot(null)
    setStep("time")
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setStep("details")
  }

  const canProceed = () => {
    if (step === "details")
      return formData.clientName.trim() && formData.clientEmail.trim() &&
             formData.clientPhone.trim() && formData.serviceType
    return false
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot) return
    setIsSubmitting(true)

    const result = await createAppointmentAction({
      ...formData,
      date:      selectedDate,
      slotStart: selectedSlot.start,
      slotEnd:   selectedSlot.end,
    })

    if (result.success) {
      setStep("confirmation")
    } else {
      alert(result.error ?? "Une erreur est survenue.")
    }

    setIsSubmitting(false)
  }

  const goBack = () => {
    if (step === "time")    setStep("date")
    if (step === "details") setStep("time")
  }

  const STEPS = [
    { key: "date",         label: "Date",         icon: Calendar     },
    { key: "time",         label: "Heure",        icon: Clock        },
    { key: "details",      label: "Détails",      icon: User         },
    { key: "confirmation", label: "Confirmation", icon: CheckCircle2 },
  ]

  return (
    <>
      <section className="bg-primary px-6 pb-16 pt-32 text-center lg:px-8 lg:pb-24 lg:pt-40">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">Disponibilités</p>
          <h1 className="font-serif text-5xl font-semibold text-primary-foreground md:text-6xl">Mon Agenda</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/60">
            Planifiez votre séance photo facilement et laissez-nous capturer vos moments avec créativité et excellence.
          </p>
        </FadeIn>
      </section>

      <main className="min-h-screen bg-background pb-20 pt-16">
        <div className="container mx-auto px-4">

          {/* Progress */}
          <div className="mb-12">
            <div className="mx-auto flex max-w-2xl items-center justify-between">
              {STEPS.map((s, index) => {
                const StepIcon = s.icon
                const isActive = step === s.key
                const isPast   = STEPS.findIndex((x) => x.key === step) > index
                return (
                  <div key={s.key} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                        isActive ? "border-primary bg-primary text-primary-foreground" :
                        isPast   ? "border-primary bg-primary/10 text-primary" :
                                   "border-muted-foreground/30 text-muted-foreground"
                      )}>
                        {isPast ? <CheckCircle2 className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                      </div>
                      <span className={cn("mt-2 text-xs font-medium",
                        isActive ? "text-primary" : isPast ? "text-foreground" : "text-muted-foreground"
                      )}>{s.label}</span>
                    </div>
                    {index < 3 && <div className={cn("mx-2 h-0.5 w-12 sm:w-20 md:w-28", isPast ? "bg-primary" : "bg-muted")} />}
                  </div>
                )
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* Étape 1 : Date */}
            {step === "date" && (
              <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mx-auto max-w-3xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Choisissez une date</CardTitle>
                    <CardDescription>Sélectionnez une date parmi les disponibilités affichées</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 flex items-center justify-between">
                      <Button variant="outline" size="icon" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="font-serif text-lg font-semibold">{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                      <Button variant="outline" size="icon" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mb-4 grid grid-cols-7 gap-1">
                      {DAYS_OF_WEEK.map((d) => (
                        <div key={d} className="py-2 text-center text-sm font-medium text-muted-foreground">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((date, i) => {
                        const dateStr        = formatDate(date)
                        const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                        const isToday        = dateStr === today
                        const isPast         = dateStr < today
                        const isAvailable    = availableDates.includes(dateStr)
                        const isSelected     = dateStr === selectedDate
                        return (
                          <button key={i} onClick={() => handleDateSelect(date)} disabled={!isAvailable || isPast}
                            className={cn(
                              "relative flex h-12 items-center justify-center rounded-lg text-sm font-medium transition-all",
                              isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                              isPast && "cursor-not-allowed opacity-40",
                              !isPast && !isAvailable && "cursor-not-allowed opacity-40",
                              isAvailable && !isPast && "cursor-pointer hover:bg-primary/10 ring-1 ring-primary/30",
                              isSelected && "bg-primary text-primary-foreground ring-2 ring-primary",
                              isToday && !isSelected && "ring-2 ring-primary/50",
                            )}
                          >
                            {date.getDate()}
                            {isAvailable && !isPast && !isSelected && (
                              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                    {availableDates.length === 0 && (
                      <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-muted-foreground">Aucune disponibilité pour le moment. <Link href="/contact" className="underline">Contactez-nous</Link>.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Étape 2 : Heure */}
            {step === "time" && (
              <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mx-auto max-w-3xl">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Choisissez un horaire</CardTitle>
                        <CardDescription className="mt-1">{selectedDateFormatted}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={goBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Changer de date
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {availableSlots.length === 0 ? (
                      <div className="rounded-lg bg-muted/50 p-8 text-center">
                        <p className="text-muted-foreground">Aucun créneau disponible. <button className="underline" onClick={goBack}>Choisir une autre date</button></p>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {availableSlots.map((slot, i) => (
                          <button key={i} onClick={() => handleSlotSelect(slot)}
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-all hover:border-primary hover:bg-primary/5",
                              selectedSlot?.start === slot.start && selectedSlot?.end === slot.end &&
                              "border-primary bg-primary text-primary-foreground"
                            )}
                          >
                            <Clock className="h-4 w-4" />{slot.start} - {slot.end}
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Étape 3 : Détails */}
            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mx-auto max-w-3xl">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Vos informations</CardTitle>
                        <CardDescription className="mt-1">{selectedDateFormatted} de {selectedSlot?.start} à {selectedSlot?.end}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={goBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Changer d'horaire
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          { id: "clientName",  label: "Nom complet *", icon: User,  type: "text",  placeholder: "Votre nom",           field: "clientName"  },
                          { id: "clientEmail", label: "Email *",       icon: Mail,  type: "email", placeholder: "votre@email.com",      field: "clientEmail" },
                          { id: "clientPhone", label: "Téléphone *",   icon: Phone, type: "tel",   placeholder: "+33 6 12 34 56 78",    field: "clientPhone" },
                        ].map(({ id, label, icon: Icon, type, placeholder, field }) => (
                          <div key={id} className="space-y-2">
                            <Label htmlFor={id}>{label}</Label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input id={id} type={type} placeholder={placeholder} className="pl-9"
                                value={formData[field as keyof typeof formData]}
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="space-y-2">
                          <Label>Type de prestation *</Label>
                          <Select value={formData.serviceType} onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
                            <SelectTrigger><SelectValue placeholder="Sélectionnez un service" /></SelectTrigger>
                            <SelectContent>
                              {services.map((s) => <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>)}
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message (optionnel)</Label>
                        <Textarea id="message" rows={4} placeholder="Décrivez votre projet..."
                          value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                      </div>

                      {/* Récapitulatif */}
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="mb-3 font-medium">Récapitulatif</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDateFormatted}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Horaire</span><span className="font-medium">{selectedSlot?.start} - {selectedSlot?.end}</span></div>
                          {formData.serviceType && <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{formData.serviceType}</span></div>}
                        </div>
                      </div>

                      <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="w-full" size="lg">
                        {isSubmitting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi en cours...</>
                        ) : (
                          <>Confirmer le rendez-vous<ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Étape 4 : Confirmation */}
            {step === "confirmation" && (
              <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl text-center">
                <Card>
                  <CardContent className="py-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </motion.div>
                    <h2 className="mb-2 font-serif text-2xl font-bold">Demande envoyée avec succès !</h2>
                    <p className="mb-8 text-muted-foreground">Votre demande a bien été enregistrée. Vous recevrez une confirmation soit par mail ou par appel une fois votre rendez-vous validé.</p>
                    <div className="mx-auto mb-8 max-w-md rounded-lg bg-muted/50 p-6 text-left">
                      <h4 className="mb-4 font-medium">Détails du rendez-vous</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{selectedDateFormatted}</span></div>
                        <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><span>{selectedSlot?.start} - {selectedSlot?.end}</span></div>
                        <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-muted-foreground" /><span>{formData.serviceType}</span></div>
                        {address && <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" /><span>{address}</span></div>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button asChild variant="outline"><Link href="/">Retour à l'accueil</Link></Button>
                      <Button asChild><Link href="/contact">Nous contacter</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </>
  )
}