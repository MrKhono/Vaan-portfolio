import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CalendarCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/actions/appointment.actions"

interface AppointmentsStatsProps {
  appointments: Appointment[]
}

export function AppointmentsStats({ appointments }: AppointmentsStatsProps) {
  const pendingCount   = appointments.filter((a) => a.status === "pending").length
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length
  const todayCount     = appointments.filter(
    (a) => a.date === new Date().toISOString().split("T")[0] && a.status === "confirmed"
  ).length

  const stats = [
    { count: pendingCount,        label: "En attente",  icon: AlertCircle,   bg: "bg-amber-100",   color: "text-amber-600"        },
    { count: confirmedCount,      label: "Confirmés",   icon: CheckCircle2,  bg: "bg-emerald-100", color: "text-emerald-600"       },
    { count: todayCount,          label: "Aujourd'hui", icon: Calendar,      bg: "bg-primary/10",  color: "text-primary"           },
    { count: appointments.length, label: "Total",       icon: CalendarCheck, bg: "bg-muted",       color: "text-muted-foreground"  },
  ]

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-4">
      {stats.map(({ count, label, icon: Icon, bg, color }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", bg)}>
              <Icon className={cn("h-6 w-6", color)} />
            </div>
            <div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}