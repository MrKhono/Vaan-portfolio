import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 })
    }

    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const urls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue

      const ext      = file.name.split(".").pop() ?? "jpg"
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filepath = join(uploadDir, filename)

      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filepath, buffer)

      urls.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ urls })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}