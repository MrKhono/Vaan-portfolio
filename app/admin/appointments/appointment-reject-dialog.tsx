import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface AppointmentRejectDialogProps {
  open:         boolean
  rejectReason: string
  isActing:     boolean
  onOpenChange: (open: boolean) => void
  onReasonChange: (value: string) => void
  onConfirm:    () => void
}

export function AppointmentRejectDialog({
  open,
  rejectReason,
  isActing,
  onOpenChange,
  onReasonChange,
  onConfirm,
}: AppointmentRejectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refuser le rendez-vous</DialogTitle>
          <DialogDescription>
            Le client sera informé du refus de sa demande.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="rejectReason">Motif du refus (optionnel)</Label>
          <Textarea
            id="rejectReason"
            value={rejectReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Indiquez la raison du refus..."
            className="mt-2"
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isActing}>
            {isActing
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Refus en cours...</>
              : "Refuser le rendez-vous"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}