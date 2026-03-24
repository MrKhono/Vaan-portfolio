import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CalendarCheck, Check, X, MoreHorizontal,
  Eye, Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { STATUS_CONFIG } from "@/lib/status-config"
import type { Appointment } from "@/actions/appointment.actions"



interface AppointmentsTableProps {
  appointments:    Appointment[]
  onViewDetails:   (appointment: Appointment) => void
  onConfirm:       (appointment: Appointment) => void
  onReject:        (appointment: Appointment) => void
  onCancel:        (appointment: Appointment) => void
  onDelete:        (appointment: Appointment) => void
}

export function AppointmentsTable({
  appointments,
  onViewDetails,
  onConfirm,
  onReject,
  onCancel,
  onDelete,
}: AppointmentsTableProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    })

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarCheck className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Aucun rendez-vous</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Demande</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => {
                const status     = STATUS_CONFIG[appointment.status as keyof typeof STATUS_CONFIG]
                const StatusIcon = status.icon
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <p className="font-medium">{appointment.clientName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.clientEmail}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatDate(appointment.date)}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.slotStart} - {appointment.slotEnd}
                      </p>
                    </TableCell>
                    <TableCell>{appointment.serviceType}</TableCell>
                    <TableCell>
                      <Badge
                        variant={status.variant}
                        className={cn("gap-1", status.variant === "outline" && status.color)}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(appointment.createdAt.toString())}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(appointment)}>
                            <Eye className="mr-2 h-4 w-4" />Voir les détails
                          </DropdownMenuItem>
                          {appointment.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onConfirm(appointment)} className="text-emerald-600">
                                <Check className="mr-2 h-4 w-4" />Confirmer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onReject(appointment)} className="text-red-600">
                                <X className="mr-2 h-4 w-4" />Refuser
                              </DropdownMenuItem>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onCancel(appointment)}>
                                <X className="mr-2 h-4 w-4" />Annuler
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(appointment)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}