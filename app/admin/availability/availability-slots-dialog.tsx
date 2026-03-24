import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Clock, Copy, Loader2, Plus, Trash2 } from "lucide-react"
import type { TimeSlot } from "@/actions/availability.actions"

const TIME_OPTIONS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00",
]

interface AvailabilitySlotsDialogProps {
  open:         boolean
  selectedDate: string | null
  slots:        TimeSlot[]
  newSlot:      TimeSlot
  isSaving:     boolean
  onOpenChange: (open: boolean) => void
  onNewSlotChange: (slot: TimeSlot) => void
  onAddSlot:    () => void
  onRemoveSlot: (index: number) => void
  onSave:       () => void
  onCopyWeek:   () => void
}

export function AvailabilitySlotsDialog({
  open,
  selectedDate,
  slots,
  newSlot,
  isSaving,
  onOpenChange,
  onNewSlotChange,
  onAddSlot,
  onRemoveSlot,
  onSave,
  onCopyWeek,
}: AvailabilitySlotsDialogProps) {
  const dateLabel = selectedDate
    ? new Date(selectedDate).toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{dateLabel}</DialogTitle>
          <DialogDescription>Définissez vos créneaux disponibles pour cette journée</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Ajout créneau */}
          <div className="space-y-3">
            <span className="text-sm font-medium">Ajouter un créneau</span>
            <div className="flex items-center gap-2">
              <Select value={newSlot.start} onValueChange={(v) => onNewSlotChange({ ...newSlot, start: v })}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">à</span>
              <Select value={newSlot.end} onValueChange={(v) => onNewSlotChange({ ...newSlot, end: v })}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={onAddSlot} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Liste créneaux */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Créneaux configurés</span>
            {slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun créneau configuré</p>
            ) : (
              <div className="space-y-2">
                {slots.map((slot, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{slot.start} - {slot.end}</span>
                    </div>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveSlot(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {slots.length > 0 && (
            <Button variant="outline" onClick={onCopyWeek} className="w-full sm:w-auto">
              <Copy className="mr-2 h-4 w-4" />
              Copier sur la semaine
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
                : "Enregistrer"
              }
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}