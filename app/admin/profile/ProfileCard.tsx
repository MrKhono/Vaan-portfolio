import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

interface ProfileCardProps {
  user: {
    name:      string
    email:     string
    image:     string | null
    createdAt: Date | string
  }
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          <div className="mt-3">
            <Badge className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              Administrateur
            </Badge>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Membre depuis{" "}
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}