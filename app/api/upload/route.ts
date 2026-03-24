import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN manquant" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const files    = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 })
    }

    const urls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue

      const blob = await put(file.name, file, {
        access:          "public",
        addRandomSuffix: true,
        token:           process.env.BLOB_READ_WRITE_TOKEN,
      })

      urls.push(blob.url)
    }

    if (!urls.length) {
      return NextResponse.json({ error: "Aucune image valide" }, { status: 400 })
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    )
  }
}