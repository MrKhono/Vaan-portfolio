import type { Metadata } from "next"
import { Suspense } from "react"
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid"
import { FadeIn } from "@/components/motion"
import { getProjectsAction } from "@/actions/project.actions"
import { getDomainsAction } from "@/actions/domain.actions"

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez le portfolio de Vaan Charles : mariage, portrait, mode et événementiel. Des photographies qui racontent une histoire.",
}

export default async function PortfolioPage() {
  const [projects, domains] = await Promise.all([
    getProjectsAction(),
    getDomainsAction(),
  ])

  return (
    <>
      <section className="bg-primary px-6 pb-16 pt-32 text-center lg:px-8 lg:pb-24 lg:pt-40">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Portfolio
          </p>
          <h1 className="font-serif text-5xl font-semibold text-primary-foreground md:text-6xl">
            Mes Réalisations
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/60">
            {"Chaque image est une histoire. Découvrez une sélection de mes travaux à travers différentes disciplines photographiques."}
          </p>
        </FadeIn>
      </section>

      <section className="bg-background px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Suspense>
            <PortfolioGrid projects={projects} domains={domains} />
          </Suspense>
        </div>
      </section>
    </>
  )
}