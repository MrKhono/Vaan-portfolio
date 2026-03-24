import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Trash2 } from "lucide-react"
import type { AdminUser } from "@/actions/user.actions"

interface AdminUserCardProps {
  user:          AdminUser
  isCurrentUser: boolean
  onDelete:      (id: string) => void
}

export function AdminUserCard({ user, isCurrentUser, onDelete }: AdminUserCardProps) {
  return (
    <Card className={isCurrentUser ? "ring-2 ring-primary" : ""}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{user.name}</h3>
              {isCurrentUser && (
                <Badge variant="outline" className="text-xs">Vous</Badge>
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex items-center gap-1">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-1 border-t border-border pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            disabled={isCurrentUser}
            onClick={() => onDelete(user.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}