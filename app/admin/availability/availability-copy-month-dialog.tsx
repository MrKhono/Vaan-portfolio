import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatMonth, parseDateLocal } from "@/lib/utils"

const DAYS_OF_WEEK_FULL = [
  "dimanches", "lundis", "mardis", "mercredis",
  "jeudis", "vendredis", "samedis",
]

interface AvailabilityCopyMonthDialogProps {
  open:         boolean
  isCopying:    boolean
  selectedDate: string | null
  onOpenChange: (open: boolean) => void
  onConfirm:    () => void
}

export function AvailabilityCopyMonthDialog({
  open,
  isCopying,
  selectedDate,
  onOpenChange,
  onConfirm,
}: AvailabilityCopyMonthDialogProps) {
  const parsedDate = selectedDate ? parseDateLocal(selectedDate) : null

  const dayName   = parsedDate ? DAYS_OF_WEEK_FULL[parsedDate.getDay()] : ""
  const monthName = parsedDate ? formatMonth(parsedDate)                : ""

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Appliquer à tout le mois</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action va appliquer les créneaux actuels à <strong>tous les {dayName}</strong> de <strong>{monthName}</strong> (dates futures uniquement). Les créneaux existants pour ces dates seront remplacés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isCopying}>
            {isCopying ? "Application en cours..." : "Confirmer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}