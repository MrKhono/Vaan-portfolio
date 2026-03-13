"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CalendarCheck,
  Clock,
  Mail,
  Phone,
  User,
  Check,
  X,
  MoreHorizontal,
  Eye,
  Trash2,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react"
import {
  getAppointments,
  confirmAppointment,
  rejectAppointment,
  cancelAppointment,
  deleteAppointment,
  type Appointment,
} from "@/lib/admin-store"
import { cn } from "@/lib/utils"

const STATUS_CONFIG = {
  pending: {
    label: "En attente",
    icon: AlertCircle,
    variant: "outline" as const,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  confirmed: {
    label: "Confirme",
    icon: CheckCircle2,
    variant: "default" as const,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  rejected: {
    label: "Refuse",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  cancelled: {
    label: "Annule",
    icon: X,
    variant: "secondary" as const,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = () => {
    const data = getAppointments()
    // Sort by date descending, then by status (pending first)
    data.sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1
      if (b.status === "pending" && a.status !== "pending") return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    setAppointments(data)
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleConfirm = (appointment: Appointment) => {
    confirmAppointment(appointment.id)
    loadAppointments()
    setDetailsOpen(false)
  }

  const handleReject = () => {
    if (selectedAppointment) {
      rejectAppointment(selectedAppointment.id, rejectReason)
      loadAppointments()
      setRejectDialogOpen(false)
      setDetailsOpen(false)
      setRejectReason("")
    }
  }

  const handleCancel = (appointment: Appointment) => {
    cancelAppointment(appointment.id)
    loadAppointments()
  }

  const handleDelete = () => {
    if (selectedAppointment) {
      deleteAppointment(selectedAppointment.id)
      loadAppointments()
      setDeleteDialogOpen(false)
      setSelectedAppointment(null)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pendingCount = appointments.filter((a) => a.status === "pending").length
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length
  const todayAppointments = appointments.filter(
    (a) => a.date === new Date().toISOString().split("T")[0] && a.status === "confirmed"
  ).length

  return (
    <AdminShell
      title="Rendez-vous"
      description="Gerez les demandes de rendez-vous de vos clients"
    >
      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{confirmedCount}</p>
              <p className="text-sm text-muted-foreground">Confirmes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayAppointments}</p>
              <p className="text-sm text-muted-foreground">{"Aujourd'hui"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CalendarCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{appointments.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmes</TabsTrigger>
              <TabsTrigger value="rejected">Refuses</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarCheck className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">Aucun rendez-vous</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Aucun rendez-vous ne correspond a vos criteres"
                  : "Vous n'avez pas encore de demandes de rendez-vous"}
              </p>
            </div>
          ) : (
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
                  {filteredAppointments.map((appointment) => {
                    const status = STATUS_CONFIG[appointment.status]
                    const StatusIcon = status.icon
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{appointment.clientName}</span>
                            <span className="text-sm text-muted-foreground">{appointment.clientEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{formatDate(appointment.date)}</span>
                            <span className="text-sm text-muted-foreground">
                              {appointment.timeSlot.start} - {appointment.timeSlot.end}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.serviceType}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className={cn("gap-1", status.variant === "outline" && status.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(appointment.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setDetailsOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les details
                              </DropdownMenuItem>
                              {appointment.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleConfirm(appointment)}
                                    className="text-emerald-600"
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Confirmer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setRejectDialogOpen(true)
                                    }}
                                    className="text-red-600"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Refuser
                                  </DropdownMenuItem>
                                </>
                              )}
                              {appointment.status === "confirmed" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleCancel(appointment)}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Annuler
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setDeleteDialogOpen(true)
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
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
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Details du rendez-vous</DialogTitle>
                <DialogDescription>
                  Demande recue le {formatDateTime(selectedAppointment.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Status */}
                <div className={cn("rounded-lg p-4", STATUS_CONFIG[selectedAppointment.status].bg)}>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const StatusIcon = STATUS_CONFIG[selectedAppointment.status].icon
                      return <StatusIcon className={cn("h-5 w-5", STATUS_CONFIG[selectedAppointment.status].color)} />
                    })()}
                    <span className={cn("font-medium", STATUS_CONFIG[selectedAppointment.status].color)}>
                      {STATUS_CONFIG[selectedAppointment.status].label}
                    </span>
                  </div>
                  {selectedAppointment.adminNotes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Note: {selectedAppointment.adminNotes}
                    </p>
                  )}
                </div>

                {/* Client info */}
                <div className="space-y-3">
                  <h4 className="font-medium">Informations client</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAppointment.clientName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${selectedAppointment.clientEmail}`} className="text-primary hover:underline">
                        {selectedAppointment.clientEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedAppointment.clientPhone}`} className="text-primary hover:underline">
                        {selectedAppointment.clientPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Appointment info */}
                <div className="space-y-3">
                  <h4 className="font-medium">Details du rendez-vous</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(selectedAppointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAppointment.timeSlot.start} - {selectedAppointment.timeSlot.end}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAppointment.serviceType}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {selectedAppointment.message && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Message du client</h4>
                    <p className="rounded-lg bg-muted p-3 text-sm">
                      {selectedAppointment.message}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                {selectedAppointment.status === "pending" && (
                  <div className="flex w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setRejectDialogOpen(true)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Refuser
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleConfirm(selectedAppointment)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Confirmer
                    </Button>
                  </div>
                )}
                {selectedAppointment.status !== "pending" && (
                  <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                    Fermer
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser le rendez-vous</DialogTitle>
            <DialogDescription>
              Le client sera notifie par email du refus de sa demande.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectReason">Motif du refus (optionnel)</Label>
            <Textarea
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Indiquez la raison du refus..."
              className="mt-2"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Refuser le rendez-vous
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le rendez-vous</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible. Le rendez-vous sera definitivement supprime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
