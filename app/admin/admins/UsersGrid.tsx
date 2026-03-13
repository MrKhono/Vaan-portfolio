"use client"

import { User } from "@prisma/client"
import EmptyUsers from "./EmptyUsers"
import UserCard from "./UserCard"

interface UsersGridProps {
  admins: User[]
  currentUserId?: string
}

export default function UsersGrid({ admins, currentUserId }: UsersGridProps) {

  if (admins.length === 0) {
    return <EmptyUsers />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {admins.map((admin) => (
        <UserCard
          key={admin.id}
          admin={admin}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}