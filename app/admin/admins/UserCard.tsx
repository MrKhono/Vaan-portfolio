"use client"

import { User } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Pencil, Trash2 } from "lucide-react"

interface UserCardProps {
  admin: User
  currentUserId?: string
}

export default function UserCard({ admin, currentUserId }: UserCardProps) {

  const initials =
    (admin.name ?? "U")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  return (
    <Card className={admin.id === currentUserId ? "ring-2 ring-primary" : ""}>
      <CardContent className="p-6">

        <div className="flex items-start gap-4">

          <Avatar className="h-12 w-12">
            <AvatarImage src={admin.image ?? ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">
                {admin.name ?? "Utilisateur"}
              </h3>

              {admin.id === currentUserId && (
                <Badge variant="outline" className="text-xs">
                  Vous
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground truncate">
              {admin.email}
            </p>

            <div className="mt-2 flex items-center gap-1">
              <Badge className="gap-1">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </Badge>
            </div>

          </div>

        </div>

        <div className="mt-4 flex justify-end gap-1 border-t pt-4">

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

        </div>

      </CardContent>
    </Card>
  )
}