import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    // On prend le premier (et unique) hero
    let hero = await prisma.hero.findFirst();

    // S'il n'existe pas encore, on retourne des valeurs par défaut
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
  // Vérifier que l'utilisateur est connecté
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, description, backgroundImage } = body;

    // Validation simple
    if (!title || !description) {
      return NextResponse.json(
        { error: "title et description sont requis" },
        { status: 400 }
      );
    }

    const existingHero = await prisma.hero.findFirst();

    let hero;

    if (existingHero) {
      // Mise à jour si déjà existant
      hero = await prisma.hero.update({
        where: { id: existingHero.id },
        data: { title, description, backgroundImage },
      });
    } else {
      // Création si première fois
      hero = await prisma.hero.create({
        data: { title, description, backgroundImage },
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