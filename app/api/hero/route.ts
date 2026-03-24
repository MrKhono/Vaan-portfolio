import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const runtime = "nodejs"; 

export async function GET() {
  try {
    let hero = await prisma.hero.findFirst();

    if (!hero) {
      return NextResponse.json({
        title: "Bienvenue sur notre site",
        description: "Modifiez ce contenu depuis le back-office.",
        backgroundImage: "",
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // 🔒 Vérification session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, backgroundImage } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "title et description sont requis" },
        { status: 400 }
      );
    }

    const existingHero = await prisma.hero.findFirst();
    let hero;

    if (existingHero) {
      hero = await prisma.hero.update({
        where: { id: existingHero.id },
        data: { title, description, backgroundImage },
      });
    } else {
      hero = await prisma.hero.create({
        data: { title, description, backgroundImage },
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Erreur hero PUT:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}