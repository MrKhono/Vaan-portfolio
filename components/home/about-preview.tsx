"use client"

import Link from "next/link"
import { FadeIn } from "@/components/motion"

export function AboutPreview() {
  return (
    <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <FadeIn direction="left" className="overflow-hidden rounded-xl">
          <img
            src="/images/photographer.jpg"
            alt="Alexandre Dupont, photographe professionnel"
            className="aspect-[4/5] w-full object-cover"
          />
        </FadeIn>

        <FadeIn direction="right">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            A propos
          </p>
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Alexandre Dupont
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {"Depuis plus de 10 ans, je parcours le monde avec mon objectif, a la recherche de l'emotion pure et de la beaute dans chaque instant. Mon approche allie technique maitrisee et sensibilite artistique pour creer des images qui racontent une histoire."}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {"Base a Paris, je suis disponible partout en France et a l'international pour vos projets les plus ambitieux."}
          </p>
          <div className="mt-8 flex gap-12">
            <div>
              <p className="font-serif text-4xl font-semibold text-foreground">10+</p>
              <p className="mt-1 text-sm text-muted-foreground">{"Annees d'experience"}</p>
            </div>
            <div>
              <p className="font-serif text-4xl font-semibold text-foreground">500+</p>
              <p className="mt-1 text-sm text-muted-foreground">Projets realises</p>
            </div>
            <div>
              <p className="font-serif text-4xl font-semibold text-foreground">150+</p>
              <p className="mt-1 text-sm text-muted-foreground">Mariages</p>
            </div>
          </div>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-foreground transition-all duration-300 hover:bg-secondary"
          >
            En savoir plus
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
