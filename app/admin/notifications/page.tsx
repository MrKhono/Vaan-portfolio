"use client"

import { useState, useEffect } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Bell,
  Mail,
  MailOpen,
  Check,
  CheckCheck,
  Trash2,
  CalendarPlus,
  CalendarCheck,
  CalendarX,
  Clock,
} from "lucide-react"
import {
  getEmailNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type EmailNotification,
} from "@/lib/admin-store"
import { cn } from "@/lib/utils"

const NOTIFICATION_TYPES = {
  new_appointment: {
    label: "Nouvelle demande",
    icon: CalendarPlus,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  appointment_confirmed: {
    label: "Rendez-vous confirme",
    icon: CalendarCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  appointment_rejected: {
    label: "Rendez-vous refuse",
    icon: CalendarX,
    color: "text-red-600",
    bg: "bg-red-50",
  },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<EmailNotification[]>([])
  const [selectedNotification, setSelectedNotification] = useState<EmailNotification | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [clearAllOpen, setClearAllOpen] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    setNotifications(getEmailNotifications())
  }

  const handleView = (notification: EmailNotification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id)
      loadNotifications()
    }
    setSelectedNotification(notification)
    setDetailsOpen(true)
  }

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead()
    loadNotifications()
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
    loadNotifications()
    setDeleteId(null)
  }

  const handleClearAll = () => {
    notifications.forEach((n) => deleteNotification(n.id))
    loadNotifications()
    setClearAllOpen(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return "Il y a quelques minutes"
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`
    if (days < 7) return `Il y a ${days} jour${days > 1 ? "s" : ""}`
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AdminShell
      title="Notifications"
      description="Historique des emails envoyes (simulation)"
      action={
        notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Tout marquer comme lu
              </Button>
            )}
            <Button variant="outline" onClick={() => setClearAllOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Tout supprimer
            </Button>
          </div>
        )
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notifications list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Emails envoyes
                </CardTitle>
                {unreadCount > 0 && (
                  <Badge>{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</Badge>
                )}
              </div>
              <CardDescription>
                Les emails sont simules et affiches dans la console du navigateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Mail className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-semibold">Aucune notification</h3>
                  <p className="text-sm text-muted-foreground">
                    Les notifications d'emails apparaitront ici
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {notifications.map((notification) => {
                      const typeConfig = NOTIFICATION_TYPES[notification.type]
                      const TypeIcon = typeConfig.icon

                      return (
                        <div
                          key={notification.id}
                          onClick={() => handleView(notification)}
                          className={cn(
                            "group flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50",
                            !notification.read && "border-primary/30 bg-primary/5"
                          )}
                        >
                          <div className={cn("rounded-full p-2", typeConfig.bg)}>
                            <TypeIcon className={cn("h-4 w-4", typeConfig.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-sm font-medium truncate",
                                  !notification.read && "font-semibold"
                                )}>
                                  {notification.subject}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  A: {notification.to}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteId(notification.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(notification.sentAt)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mode simulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Les emails ne sont pas reellement envoyes. Ils sont affiches dans la console du navigateur pour les tests.
              </p>
              <p>
                Pour activer l'envoi reel d'emails, connectez un service comme Resend ou SendGrid.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total emails</span>
                  <span className="font-medium">{notifications.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Non lus</span>
                  <span className="font-medium">{unreadCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nouvelles demandes</span>
                  <span className="font-medium">
                    {notifications.filter((n) => n.type === "new_appointment").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confirmations</span>
                  <span className="font-medium">
                    {notifications.filter((n) => n.type === "appointment_confirmed").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Refus</span>
                  <span className="font-medium">
                    {notifications.filter((n) => n.type === "appointment_rejected").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Types de notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(NOTIFICATION_TYPES).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className={cn("rounded-full p-1.5", config.bg)}>
                      <Icon className={cn("h-3 w-3", config.color)} />
                    </div>
                    <span className="text-sm">{config.label}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedNotification.read ? (
                    <MailOpen className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Mail className="h-5 w-5 text-primary" />
                  )}
                  Email simule
                </DialogTitle>
                <DialogDescription>
                  Envoye le{" "}
                  {new Date(selectedNotification.sentAt).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="w-16 font-medium text-muted-foreground">A:</span>
                      <span>{selectedNotification.to}</span>
                    </div>
                    <div className="flex">
                      <span className="w-16 font-medium text-muted-foreground">Sujet:</span>
                      <span className="font-medium">{selectedNotification.subject}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {selectedNotification.body}
                  </pre>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la notification</AlertDialogTitle>
            <AlertDialogDescription>
              Cette notification sera definitivement supprimee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear all confirmation */}
      <AlertDialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer toutes les notifications</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes les notifications seront definitivement supprimees. Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Tout supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
