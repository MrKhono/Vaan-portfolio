import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Availability } from "@/actions/availability.actions"

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
const MONTHS       = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]

interface AvailabilityCalendarProps {
  currentMonth:   Date
  availabilities: Availability[]
  today:          string
  onDateClick:    (date: Date) => void
  onPrevMonth:    () => void
  onNextMonth:    () => void
}

export function AvailabilityCalendar({
  currentMonth,
  availabilities,
  today,
  onDateClick,
  onPrevMonth,
  onNextMonth,
}: AvailabilityCalendarProps) {
  const calendarDays = getCalendarDays(currentMonth)

  function getAvailabilityForDate(date: string) {
    return availabilities.find((a) => a.date === date)
  }

  function formatDate(d: Date) {
    return d.toISOString().split("T")[0]
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendrier
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-32 text-center font-medium">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button variant="outline" size="icon" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* En-têtes jours */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="py-2 text-center text-sm font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, i) => {
            const dateStr        = formatDate(date)
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
            const isToday        = dateStr === today
            const isPast         = dateStr < today
            const availability   = getAvailabilityForDate(dateStr)
            const hasSlots       = availability && availability.slots.length > 0

            return (
              <button
                key={i}
                onClick={() => !isPast && onDateClick(date)}
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
                <span className={cn("text-sm font-medium", !isCurrentMonth && "text-muted-foreground")}>
                  {date.getDate()}
                </span>
                {hasSlots && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {availability.slots.length} créneau{availability.slots.length > 1 ? "x" : ""}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function getCalendarDays(currentMonth: Date): Date[] {
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
}