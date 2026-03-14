import { getDomainsAction } from "@/actions/domain.actions"
import Link from "next/link"
import { FadeIn, StaggerContainer, StaggerItem } from "../motion"

export async function CategoriesSection() {
  const domains = await getDomainsAction()

  // Ne rien afficher si aucun domaine en base
  if (domains.length === 0) return null

  return (
    <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Spécialités
          </p>
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Mes Domaines
          </h2>
        </FadeIn>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain) => (
            <StaggerItem key={domain.slug}>
              <Link
                href={`/portfolio?category=${domain.slug}`}
                className="group relative block aspect-3/4 overflow-hidden rounded-xl"
              >
                <img
                  src={domain.image}
                  alt={`Photographie ${domain.name}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0F0F0F]/80 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-2xl font-semibold text-[#F8F8F8]">
                    {domain.name}
                  </h3>
                  <p className="mt-1 translate-y-2 text-sm text-[#F8F8F8]/70 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Découvrir →
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}