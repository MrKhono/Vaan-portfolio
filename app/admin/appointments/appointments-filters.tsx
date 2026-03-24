import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

interface AppointmentsFiltersProps {
  searchTerm:    string
  statusFilter:  string
  onSearchChange:  (value: string) => void
  onStatusChange:  (value: string) => void
}

export function AppointmentsFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: AppointmentsFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email ou service..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={onStatusChange}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmés</TabsTrigger>
            <TabsTrigger value="rejected">Refusés</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  )
}