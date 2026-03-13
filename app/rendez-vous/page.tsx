"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import {
  getAvailabilities,
  getAvailableSlotsForDate,
  addAppointment,
  getServices,
  getSettings,
  type TimeSlot,
  type Service,
  type SiteSettings,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FadeIn } from "@/components/motion";

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
];

type BookingStep = "date" | "time" | "details" | "confirmation";

export default function BookingPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettingsState] = useState<SiteSettings | null>(null);
  const [step, setStep] = useState<BookingStep>("date");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceType: "",
    message: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableSlotsForDate(selectedDate);
      setAvailableSlots(slots);
    }
  }, [selectedDate]);

  const loadData = () => {
    const availabilities = getAvailabilities();
    const today = new Date().toISOString().split("T")[0];
    const dates = availabilities
      .filter((a) => a.date >= today && a.slots.length > 0)
      .map((a) => a.date);
    setAvailableDates(dates);
    setServices(getServices());
    setSettingsState(getSettings());
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);

    while (current <= lastDay || days.length % 7 !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDate(date);
    if (!availableDates.includes(dateStr)) return;
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setStep("time");
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep("details");
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addAppointment({
      ...formData,
      date: selectedDate,
      timeSlot: selectedSlot,
    });

    setStep("confirmation");
    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (step) {
      case "date":
        return !!selectedDate;
      case "time":
        return !!selectedSlot;
      case "details":
        return (
          formData.clientName.trim() !== "" &&
          formData.clientEmail.trim() !== "" &&
          formData.clientPhone.trim() !== "" &&
          formData.serviceType !== ""
        );
      default:
        return false;
    }
  };

  const goBack = () => {
    switch (step) {
      case "time":
        setStep("date");
        break;
      case "details":
        setStep("time");
        break;
    }
  };

  const calendarDays = getCalendarDays();
  const today = formatDate(new Date());

  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <section className="bg-primary px-6 pb-16 pt-32 text-center lg:px-8 lg:pb-24 lg:pt-40">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Disponibilités
          </p>
          <h1 className="font-serif text-5xl font-semibold text-primary-foreground md:text-6xl">
            Mon Agenda
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/60">
            {
              "Planifiez votre séance photo facilement et laissez-nous capturer vos moments avec créativité, qualité et excellence."
            }
          </p>
        </FadeIn>
      </section>
      <main className="min-h-screen bg-background pb-20 pt-32">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Prendre rendez-vous
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Selectionnez une date et un creneau disponible pour reserver votre
              seance photo
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="mx-auto flex max-w-2xl items-center justify-between">
              {[
                { key: "date", label: "Date", icon: Calendar },
                { key: "time", label: "Heure", icon: Clock },
                { key: "details", label: "Details", icon: User },
                {
                  key: "confirmation",
                  label: "Confirmation",
                  icon: CheckCircle2,
                },
              ].map((s, index) => {
                const StepIcon = s.icon;
                const isActive = step === s.key;
                const isPast =
                  (step === "time" && s.key === "date") ||
                  (step === "details" && ["date", "time"].includes(s.key)) ||
                  (step === "confirmation" && s.key !== "confirmation");

                return (
                  <div key={s.key} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : isPast
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-muted-foreground/30 text-muted-foreground",
                        )}
                      >
                        {isPast ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "mt-2 text-xs font-medium",
                          isActive
                            ? "text-primary"
                            : isPast
                              ? "text-foreground"
                              : "text-muted-foreground",
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div
                        className={cn(
                          "mx-2 h-0.5 w-12 sm:w-20 md:w-28",
                          isPast ? "bg-primary" : "bg-muted",
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {step === "date" && (
              <motion.div
                key="date"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto max-w-3xl"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Choisissez une date
                    </CardTitle>
                    <CardDescription>
                      Selectionnez une date parmi les disponibilites affichees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Month navigation */}
                    <div className="mb-6 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() - 1,
                            ),
                          )
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="font-serif text-lg font-semibold">
                        {MONTHS[currentMonth.getMonth()]}{" "}
                        {currentMonth.getFullYear()}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() + 1,
                            ),
                          )
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Calendar */}
                    <div className="mb-4 grid grid-cols-7 gap-1">
                      {DAYS_OF_WEEK.map((day) => (
                        <div
                          key={day}
                          className="py-2 text-center text-sm font-medium text-muted-foreground"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((date, index) => {
                        const dateStr = formatDate(date);
                        const isCurrentMonth =
                          date.getMonth() === currentMonth.getMonth();
                        const isToday = dateStr === today;
                        const isPast = dateStr < today;
                        const isAvailable = availableDates.includes(dateStr);
                        const isSelected = dateStr === selectedDate;

                        return (
                          <button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            disabled={!isAvailable || isPast}
                            className={cn(
                              "relative flex h-12 items-center justify-center rounded-lg text-sm font-medium transition-all",
                              isCurrentMonth
                                ? "text-foreground"
                                : "text-muted-foreground/50",
                              isPast && "cursor-not-allowed opacity-40",
                              !isPast &&
                                !isAvailable &&
                                "cursor-not-allowed opacity-40",
                              isAvailable &&
                                !isPast &&
                                "cursor-pointer hover:bg-primary/10",
                              isAvailable &&
                                !isPast &&
                                "ring-1 ring-primary/30",
                              isSelected &&
                                "bg-primary text-primary-foreground ring-2 ring-primary",
                              isToday &&
                                !isSelected &&
                                "ring-2 ring-primary/50",
                            )}
                          >
                            {date.getDate()}
                            {isAvailable && !isPast && !isSelected && (
                              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-muted-foreground">
                          Disponible
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-muted" />
                        <span className="text-muted-foreground">
                          Non disponible
                        </span>
                      </div>
                    </div>

                    {availableDates.length === 0 && (
                      <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-muted-foreground">
                          Aucune disponibilite pour le moment. Veuillez nous
                          contacter directement.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "time" && (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto max-w-3xl"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Choisissez un horaire
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {selectedDateFormatted}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={goBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Changer de date
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {availableSlots.length === 0 ? (
                      <div className="rounded-lg bg-muted/50 p-8 text-center">
                        <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                          Aucun creneau disponible pour cette date. Veuillez
                          choisir une autre date.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={goBack}
                        >
                          Choisir une autre date
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleSlotSelect(slot)}
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-all hover:border-primary hover:bg-primary/5",
                              selectedSlot?.start === slot.start &&
                                selectedSlot?.end === slot.end &&
                                "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            )}
                          >
                            <Clock className="h-4 w-4" />
                            {slot.start} - {slot.end}
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto max-w-3xl"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Vos informations
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {selectedDateFormatted} de {selectedSlot?.start} a{" "}
                          {selectedSlot?.end}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={goBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Changer d'horaire
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="clientName">
                            Nom complet{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="clientName"
                              value={formData.clientName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  clientName: e.target.value,
                                })
                              }
                              placeholder="Votre nom"
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientEmail">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="clientEmail"
                              type="email"
                              value={formData.clientEmail}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  clientEmail: e.target.value,
                                })
                              }
                              placeholder="votre@email.com"
                              className="pl-9"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="clientPhone">
                            Telephone{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="clientPhone"
                              type="tel"
                              value={formData.clientPhone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  clientPhone: e.target.value,
                                })
                              }
                              placeholder="+33 6 12 34 56 78"
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="serviceType">
                            Type de prestation{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={formData.serviceType}
                            onValueChange={(value) =>
                              setFormData({ ...formData, serviceType: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selectionnez un service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem
                                  key={service.id}
                                  value={service.title}
                                >
                                  {service.title}
                                </SelectItem>
                              ))}
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message (optionnel)</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          placeholder="Decrivez votre projet ou vos attentes..."
                          rows={4}
                        />
                      </div>

                      {/* Summary */}
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="mb-3 font-medium">Recapitulatif</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">
                              {selectedDateFormatted}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Horaire
                            </span>
                            <span className="font-medium">
                              {selectedSlot?.start} - {selectedSlot?.end}
                            </span>
                          </div>
                          {formData.serviceType && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Service
                              </span>
                              <span className="font-medium">
                                {formData.serviceType}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={!canProceed() || isSubmitting}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Confirmer le rendez-vous
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "confirmation" && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-2xl text-center"
              >
                <Card>
                  <CardContent className="py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
                    >
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </motion.div>

                    <h2 className="mb-2 font-serif text-2xl font-bold">
                      Demande envoyee avec succes !
                    </h2>
                    <p className="mb-8 text-muted-foreground">
                      Votre demande de rendez-vous a bien ete enregistree. Vous
                      recevrez un email de confirmation une fois votre
                      rendez-vous valide.
                    </p>

                    <div className="mx-auto mb-8 max-w-md rounded-lg bg-muted/50 p-6 text-left">
                      <h4 className="mb-4 font-medium">
                        Details du rendez-vous
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedDateFormatted}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {selectedSlot?.start} - {selectedSlot?.end}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.serviceType}</span>
                        </div>
                        {settings && (
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <span>{settings.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button asChild variant="outline">
                        <Link href="/">Retour a l'accueil</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/contact">Nous contacter</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
