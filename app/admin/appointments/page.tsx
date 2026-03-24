"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getAppointmentsAction,
  confirmAppointmentAction,
  rejectAppointmentAction,
  cancelAppointmentAction,
  deleteAppointmentAction,
  type Appointment,
} from "@/actions/appointment.actions"
import { AppointmentDeleteDialog } from "./appointment-delete-dialog"
import { AppointmentDetailsDialog } from "./appointment-details-dialog"
import { AppointmentRejectDialog } from "./appointment-reject-dialog"
import { AppointmentsFilters } from "./appointments-filters"
import { AppointmentsStats } from "./appointments-stats"
import { AppointmentsTable } from "./appointments-table"

export default function AppointmentsPage() {
  const [appointments, setAppointments]               = useState<Appointment[]>([])
  const [isLoading, setIsLoading]                     = useState(true)
  const [searchTerm, setSearchTerm]                   = useState("")
  const [statusFilter, setStatusFilter]               = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen]                 = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen]       = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen]       = useState(false)
  const [rejectReason, setRejectReason]               = useState("")
  const [isActing, setIsActing]                       = useState(false)
  const { toast } = useToast()

  async function loadAppointments() {
    try {
      const data = await getAppointmentsAction()
      data.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1
        if (b.status === "pending" && a.status !== "pending") return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      setAppointments(data)
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les rendez-vous.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadAppointments() }, [])

  const filtered = appointments.filter((a) => {
    const matchSearch = [a.clientName, a.clientEmail, a.serviceType]
      .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchStatus = statusFilter === "all" || a.status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleConfirm(appointment: Appointment) {
    setIsActing(true)
    const result = await confirmAppointmentAction(appointment.id)
    if (result.success) {
      toast({ title: "Rendez-vous confirmé", description: "Le client a été notifié." })
      await loadAppointments()
      setDetailsOpen(false)
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" })
    }
    setIsActing(false)
  }

  async function handleReject() {
    if (!selectedAppointment) return
    setIsActing(true)
    const result = await rejectAppointmentAction(selectedAppointment.id, rejectReason)
    if (result.success) {
      toast({ title: "Rendez-vous refusé" })
      await loadAppointments()
      setRejectDialogOpen(false)
      setDetailsOpen(false)
      setRejectReason("")
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" })
    }
    setIsActing(false)
  }

  async function handleCancel(appointment: Appointment) {
    const result = await cancelAppointmentAction(appointment.id)
    if (result.success) {
      toast({ title: "Rendez-vous annulé" })
      await loadAppointments()
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" })
    }
  }

  async function handleDelete() {
    if (!selectedAppointment) return
    setIsActing(true)
    const result = await deleteAppointmentAction(selectedAppointment.id)
    if (result.success) {
      toast({ title: "Rendez-vous supprimé" })
      await loadAppointments()
      setDeleteDialogOpen(false)
      setSelectedAppointment(null)
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" })
    }
    setIsActing(false)
  }

  if (isLoading) {
    return (
      <AdminShell title="Rendez-vous" description="Gérez les demandes de rendez-vous de vos clients">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Rendez-vous" description="Gérez les demandes de rendez-vous de vos clients">

      <AppointmentsStats appointments={appointments} />

      <AppointmentsFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      <AppointmentsTable
        appointments={filtered}
        onViewDetails={(a) => { setSelectedAppointment(a); setDetailsOpen(true) }}
        onConfirm={handleConfirm}
        onReject={(a) => { setSelectedAppointment(a); setRejectDialogOpen(true) }}
        onCancel={handleCancel}
        onDelete={(a) => { setSelectedAppointment(a); setDeleteDialogOpen(true) }}
      />

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={detailsOpen}
        isActing={isActing}
        onClose={() => setDetailsOpen(false)}
        onConfirm={handleConfirm}
        onReject={() => setRejectDialogOpen(true)}
      />

      <AppointmentRejectDialog
        open={rejectDialogOpen}
        rejectReason={rejectReason}
        isActing={isActing}
        onOpenChange={setRejectDialogOpen}
        onReasonChange={setRejectReason}
        onConfirm={handleReject}
      />

      <AppointmentDeleteDialog
        open={deleteDialogOpen}
        isActing={isActing}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />

    </AdminShell>
  )
}