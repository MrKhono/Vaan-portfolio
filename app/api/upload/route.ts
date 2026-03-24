import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

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

    const isProd = process.env.NODE_ENV === "production"
    const urls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue

      const ext      = file.name.split(".").pop() ?? "jpg"
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      // --- MODE PRODUCTION -> VERCEL BLOB ---
      if (isProd) {
        const blob = await put(`uploads/${filename}`, file, {
          access: "public",
        })
        urls.push(blob.url)
        continue
      }

      // --- MODE DEVELOPPEMENT -> LOCAL ---
      const uploadDir = join(process.cwd(), "public", "uploads")
      await mkdir(uploadDir, { recursive: true })

      const buffer = Buffer.from(await file.arrayBuffer())
      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)

      urls.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ urls })
  } catch (err) {
    console.error("Erreur upload:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}