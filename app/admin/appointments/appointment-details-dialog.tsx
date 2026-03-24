import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Calendar, Clock, CalendarCheck,
  Mail, Phone, User, Check, X, Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { STATUS_CONFIG } from "@/lib/status-config"
import type { Appointment } from "@/actions/appointment.actions"



interface AppointmentDetailsDialogProps {
  appointment: Appointment | null
  open:        boolean
  isActing:    boolean
  onClose:     () => void
  onConfirm:   (appointment: Appointment) => void
  onReject:    () => void
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  isActing,
  onClose,
  onConfirm,
  onReject,
}: AppointmentDetailsDialogProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    })

  if (!appointment) return null

  const status     = STATUS_CONFIG[appointment.status as keyof typeof STATUS_CONFIG]
  const StatusIcon = status.icon

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
          <DialogDescription>
            Demande reçue le {formatDate(appointment.createdAt.toString())}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Statut */}
          <div className={cn("rounded-lg p-4", status.bg)}>
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("h-5 w-5", status.color)} />
              <span className={cn("font-medium", status.color)}>{status.label}</span>
            </div>
            {appointment.adminNotes && (
              <p className="mt-2 text-sm text-muted-foreground">
                Note : {appointment.adminNotes}
              </p>
            )}
          </div>

          {/* Infos client */}
          <div className="space-y-3">
            <h4 className="font-medium">Informations client</h4>
            {[
              { icon: User,  value: appointment.clientName },
              { icon: Mail,  value: appointment.clientEmail, href: `mailto:${appointment.clientEmail}` },
              { icon: Phone, value: appointment.clientPhone, href: `tel:${appointment.clientPhone}` },
            ].map(({ icon: Icon, value, href }) => (
              <div key={value} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {href
                  ? <a href={href} className="text-primary hover:underline">{value}</a>
                  : <span>{value}</span>
                }
              </div>
            ))}
          </div>

          {/* Détails RDV */}
          <div className="space-y-3">
            <h4 className="font-medium">Détails du rendez-vous</h4>
            {[
              { icon: Calendar,      value: formatDate(appointment.date) },
              { icon: Clock,         value: `${appointment.slotStart} - ${appointment.slotEnd}` },
              { icon: CalendarCheck, value: appointment.serviceType },
            ].map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{value}</span>
              </div>
            ))}
          </div>

          {/* Message */}
          {appointment.message && (
            <div>
              <h4 className="mb-2 font-medium">Message</h4>
              <p className="rounded-lg bg-muted p-3 text-sm">{appointment.message}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {appointment.status === "pending" ? (
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1 text-red-600 hover:bg-red-50"
                onClick={onReject}
                disabled={isActing}
              >
                <X className="mr-2 h-4 w-4" />Refuser
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => onConfirm(appointment)}
                disabled={isActing}
              >
                {isActing
                  ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  : <Check className="mr-2 h-4 w-4" />
                }
                Confirmer
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={onClose}>Fermer</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}