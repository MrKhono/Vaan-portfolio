import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DomainDeleteDialogProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  onConfirm:    () => void
}

export function DomainDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: DomainDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce domaine ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le domaine sera définitivement supprimé.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}