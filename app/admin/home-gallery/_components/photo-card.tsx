import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, GripVertical } from "lucide-react"
import type { HomeGalleryPhoto } from "@/actions/home-gallery.actions"

interface PhotoCardProps {
  photo:    HomeGalleryPhoto
  index:    number
  onEdit:   (photo: HomeGalleryPhoto) => void
  onDelete: (id: string) => void
}

export function PhotoCard({ photo, index, onEdit, onDelete }: PhotoCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-4/3">
        <img
          src={photo.image}
          alt={photo.title || `Photo ${index + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {index + 1}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onEdit(photo)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(photo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-3">
        {photo.title && (
          <p className="truncate text-sm font-medium">{photo.title}</p>
        )}
        {photo.category && (
          <p className="truncate text-xs text-muted-foreground">{photo.category}</p>
        )}
      </CardContent>
    </Card>
  )
}