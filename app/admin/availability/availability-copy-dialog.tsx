import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AvailabilityCopyDialogProps {
  open:         boolean
  isCopying:    boolean
  onOpenChange: (open: boolean) => void
  onConfirm:    () => void
}

export function AvailabilityCopyDialog({
  open,
  isCopying,
  onOpenChange,
  onConfirm,
}: AvailabilityCopyDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Copier les créneaux</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action va copier les créneaux actuels sur tous les jours de la semaine
            (lundi à vendredi). Les créneaux existants seront remplacés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isCopying}>
            {isCopying ? "Copie en cours..." : "Confirmer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}