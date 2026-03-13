"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, ShieldCheck } from "lucide-react";
import { type Admin } from "@/lib/admin-store";
import { useSession } from "@/lib/auth-client";

interface ProfileCardProps {
  user: Admin;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const { data: session, isPending } = useSession();
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {session?.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h2 className="mt-4 text-xl font-semibold">{session?.user.name}</h2>
          <p className="text-sm text-muted-foreground">{session?.user.email}</p>

          <div className="mt-3">
            <Badge className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              Administrateur
            </Badge>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Membre depuis{" "}
            {session?.user?.createdAt &&
              new Date(session.user.createdAt).toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
