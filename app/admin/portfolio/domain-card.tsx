import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import type { Domain } from "@/actions/domain.actions"

interface DomainCardProps {
  domain:   Domain
  onEdit:   (domain: Domain) => void
  onDelete: (id: string) => void
}

export function DomainCard({ domain, onEdit, onDelete }: DomainCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-4/3">
        {domain.image ? (
          <Image
            src={domain.image}
            alt={domain.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-lg font-semibold text-white">
            {domain.name}
          </h3>
          <p className="line-clamp-1 text-sm text-white/80">
            {domain.description}
          </p>
        </div>
      </div>
      <CardContent className="flex items-center justify-between p-3">
        <span className="font-mono text-xs text-muted-foreground">
          {domain.slug}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            onClick={() => onEdit(domain)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost" size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(domain.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}