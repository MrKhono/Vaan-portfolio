// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Vérification session
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 2️⃣ Récupérer les fichiers du FormData
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const isProd = process.env.NODE_ENV === "production";
    const urls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      if (isProd) {
        // --- Production Vercel Blob ---
        const blob = await put(`uploads/${filename}`, file, { access: "public" });
        urls.push(blob.url);
      } else {
        // --- Développement local ---
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const buffer = Buffer.from(await file.arrayBuffer());
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        urls.push(`/uploads/${filename}`);
      }
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "Aucun fichier image valide" }, { status: 400 });
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Erreur upload:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}