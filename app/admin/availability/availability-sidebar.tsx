import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Availability } from "@/actions/availability.actions"

interface AvailabilitySidebarProps {
  availabilities: Availability[]
}

export function AvailabilitySidebar({ availabilities }: AvailabilitySidebarProps) {
  const totalSlots = availabilities.reduce((acc, a) => acc + a.slots.length, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Légende</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border-2 border-primary" />
            <span className="text-sm text-muted-foreground">Aujourd'hui</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border border-primary/50 bg-primary/10" />
            <span className="text-sm text-muted-foreground">Créneaux disponibles</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded bg-muted/50 opacity-50" />
            <span className="text-sm text-muted-foreground">Date passée</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Statistiques</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Jours disponibles</span>
            <span className="font-medium">{availabilities.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total créneaux</span>
            <span className="font-medium">{totalSlots}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}