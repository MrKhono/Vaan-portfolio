import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const dayName = selectedDate
    ? DAYS_OF_WEEK_FULL[new Date(selectedDate).getDay()]
    : ""

  const monthName = selectedDate
    ? new Date(selectedDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : ""

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