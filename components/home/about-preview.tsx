import Link from "next/link"
import { FadeIn } from "@/components/motion"
import { getAboutAction } from "@/actions/about.actions"

const defaultAbout = {
  title:       "Vaan Charles",
  description: "Depuis plus de 10 ans, je parcours le monde avec mon objectif, à la recherche de l'émotion pure et de la beauté dans chaque instant. Mon approche allie technique maîtrisée et sensibilité artistique pour créer des images qui racontent une histoire.",
  image:       "/images/photographer.jpg",
  stats:       [
    { value: "10+", label: "Années d'expérience" },
    { value: "500+", label: "Projets réalisés" },
    { value: "150+", label: "Mariages" },
  ],
}

export async function AboutPreview() {
  const about = await getAboutAction()

  const title       = about.title       || defaultAbout.title
  const description = about.description || defaultAbout.description
  const image       = about.image       || defaultAbout.image
  const stats       = about.stats.length > 0 ? about.stats : defaultAbout.stats

  return (
    <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <FadeIn direction="left" className="overflow-hidden rounded-xl">
          <img
            src={image}
            alt={`${title}, photographe professionnel`}
            className="aspect-4/5 w-full object-cover"
          />
        </FadeIn>

        <FadeIn direction="right">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            À propos
          </p>
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>

          {/* Statistiques */}
          {stats.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-12">
              {stats.map((stat, index) => (
                <div key={index}>
                  <p className="font-serif text-4xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

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