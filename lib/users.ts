import { prisma } from "@/lib/prisma"

export async function getAdmins() {
  const admins = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return admins
}