import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { getServicesAction } from "@/actions/service.actions"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Découvrez les prestations photographiques de Vaan Charles : mariage, portrait, mode et événementiel. Tarifs et formules adaptées à vos besoins.",
}

export default async function ServicesPage() {
  const services = await getServicesAction()

  return (
    <>
      <section className="bg-primary px-6 pb-16 pt-32 text-center lg:px-8 lg:pb-24 lg:pt-40">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Prestations
          </p>
          <h1 className="font-serif text-5xl font-semibold text-primary-foreground md:text-6xl">
            Mes Services
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/60">
            {"Des formules adaptées à chaque besoin, avec un engagement constant pour la qualité et l'excellence."}
          </p>
        </FadeIn>
      </section>

      <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          {services.length > 0 ? (
            <StaggerContainer className="grid gap-8 md:grid-cols-2">
              {services.map((service) => (
                <StaggerItem key={service.id}>
                  <div className="group overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={service.image}
                        alt={`Photographie ${service.title}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 object-center"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0F0F0F]/50 to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <h3 className="font-serif text-2xl font-semibold text-[#F8F8F8]">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-8">
                      {service.description && (
                        <p className="text-base leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                      )}

                      {service.features.length > 0 && (
                        <ul className="mt-6 flex flex-col gap-3">
                          {service.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-3 text-sm text-foreground"
                            >
                              <Check className="h-4 w-4 shrink-0 text-accent" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Tarif</p>
                          <p className="font-serif text-2xl font-semibold text-foreground">
                            À partir de {service.price}
                            <span className="text-base font-normal text-muted-foreground">
                              {" "}€
                            </span>
                          </p>
                        </div>
                        <Link
                          href="/contact"
                          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
                        >
                          Réserver
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <FadeIn className="text-center">
              <p className="text-muted-foreground">Aucun service disponible pour le moment.</p>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="bg-secondary/30 px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Un projet sur mesure ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {"Chaque projet est unique. Contactez-moi pour discuter de vos besoins spécifiques et recevoir un devis personnalisé."}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:opacity-90"
            >
              Demander un devis
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}