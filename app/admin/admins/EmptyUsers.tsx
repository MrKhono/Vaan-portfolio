"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function EmptyUsers() {

  return (
    <Card className="col-span-full">

      <CardContent className="flex flex-col items-center justify-center py-12">

        <Users className="h-12 w-12 text-muted-foreground mb-4" />

        <h3 className="font-medium">
          Aucun administrateur
        </h3>

        <p className="text-sm text-muted-foreground mt-1">
          Ajoutez des administrateurs pour gérer le site
        </p>

      </CardContent>

    </Card>
  )
}