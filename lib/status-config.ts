import { AlertCircle, CheckCircle2, XCircle, X } from "lucide-react"

export const STATUS_CONFIG = {
  pending: {
    label: "En attente", icon: AlertCircle,
    variant: "outline" as const, color: "text-amber-600", bg: "bg-amber-50",
  },
  confirmed: {
    label: "Confirmé", icon: CheckCircle2,
    variant: "default" as const, color: "text-emerald-600", bg: "bg-emerald-50",
  },
  rejected: {
    label: "Refusé", icon: XCircle,
    variant: "destructive" as const, color: "text-red-600", bg: "bg-red-50",
  },
  cancelled: {
    label: "Annulé", icon: X,
    variant: "secondary" as const, color: "text-muted-foreground", bg: "bg-muted",
  },
}