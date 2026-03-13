import type { Metadata } from "next"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { Camera, Heart, Eye, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "A propos",
  description:
    "Decouvrez Alexandre Dupont, photographe professionnel avec plus de 10 ans d'experience en mariage, portrait, mode et evenementiel.",
}

const timeline = [
  {
    year: "2014",
    title: "Premiers pas",
    description:
      "Debut de ma carriere en tant que photographe assistant dans un studio parisien renomme.",
  },
  {
    year: "2016",
    title: "Studio independant",
    description:
      "Ouverture de mon propre studio a Paris et lancement de mon activite de photographe professionnel.",
  },
  {
    year: "2018",
    title: "Reconnaissance",
    description:
      "Prix du meilleur photographe de mariage aux Wedding Awards. Debut des collaborations avec des maisons de mode.",
  },
  {
    year: "2020",
    title: "Expansion internationale",
    description:
      "Premiers projets a l'international : Londres, Milan, New York. Collaboration avec Vogue et Harper's Bazaar.",
  },
  {
    year: "2023",
    title: "Masterclass",
    description:
      "Lancement de formations et masterclass pour partager mon experience avec la nouvelle generation de photographes.",
  },
  {
    year: "2025",
    title: "Aujourd'hui",
    description:
      "Plus de 500 projets realises, un reseau de clients fideles et une passion toujours intacte pour la photographie.",
  },
]

const values = [
  {
    icon: Eye,
    title: "Vision",
    description:
      "Chaque projet commence par une vision claire. Je cherche a voir au-dela de l'evident pour capturer l'essence veritable d'un moment.",
  },
  {
    icon: Heart,
    title: "Emotion",
    description:
      "La photographie est avant tout une question d'emotion. Je m'efforce de creer des images qui touchent le coeur et racontent une histoire.",
  },
  {
    icon: Camera,
    title: "Excellence",
    description:
      "La maitrise technique est au service de la creativite. Je perfectionne constamment mon art pour offrir un travail d'exception.",
  },
  {
    icon: Award,
    title: "Authenticite",
    description:
      "Pas de poses forcees, pas d'artifices. Je privilegie le naturel et la spontaneite pour des images vraies et intemporelles.",
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-primary px-6 pb-16 pt-32 text-center lg:px-8 lg:pb-24 lg:pt-40">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            A propos
          </p>
          <h1 className="font-serif text-5xl font-semibold text-primary-foreground md:text-6xl">
            Alexandre Dupont
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/60">
            {"Photographe passionne, conteur d'histoires visuelles, eternel curieux."}
          </p>
        </FadeIn>
      </section>

      <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn direction="left" className="overflow-hidden rounded-xl">
            <img
              src="/images/photographer.jpg"
              alt="Alexandre Dupont dans son studio"
              className="aspect-[4/5] w-full object-cover"
            />
          </FadeIn>

          <FadeIn direction="right">
            <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
              {"L'art de capturer l'instant"}
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                {"Depuis mon enfance, j'ai toujours ete fascine par la lumiere et la facon dont elle transforme le monde qui nous entoure. C'est cette passion qui m'a naturellement conduit vers la photographie."}
              </p>
              <p>
                {"Apres une formation aux Beaux-Arts et plusieurs annees en tant qu'assistant dans les plus grands studios parisiens, j'ai lance mon propre studio en 2016. Depuis, j'ai eu le privilege de travailler avec des couples, des marques de mode prestigieuses et des entreprises du monde entier."}
              </p>
              <p>
                {"Mon approche est simple : ecouter, observer, puis capturer. Je crois profondement que les plus belles images naissent de la connexion authentique entre le photographe et son sujet."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-secondary/30 px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="mb-16 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
              Philosophie
            </p>
            <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Mes Valeurs
            </h2>
          </FadeIn>

          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="flex flex-col items-center rounded-xl bg-card p-8 text-center shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-6 font-serif text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <FadeIn className="mb-16 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
              Parcours
            </p>
            <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Mon Experience
            </h2>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />
            <StaggerContainer className="flex flex-col gap-12">
              {timeline.map((item, i) => (
                <StaggerItem key={item.year}>
                  <div
                    className={`relative flex flex-col gap-4 pl-12 md:flex-row md:gap-8 md:pl-0 ${
                      i % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="absolute left-2 top-1 h-5 w-5 rounded-full border-2 border-accent bg-background md:left-1/2 md:-translate-x-1/2" />
                    <div
                      className={`flex-1 ${
                        i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                      }`}
                    >
                      <span className="text-sm font-semibold text-accent">
                        {item.year}
                      </span>
                      <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <div className="hidden flex-1 md:block" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
              Ils me font confiance
            </p>
            <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
              Clients & Collaborations
            </h2>
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
              {["Vogue", "Harper's Bazaar", "Maison Elysee", "Fondation des Arts"].map(
                (client) => (
                  <div
                    key={client}
                    className="flex items-center justify-center rounded-xl bg-card px-6 py-8 shadow-sm"
                  >
                    <span className="font-serif text-lg font-semibold text-muted-foreground">
                      {client}
                    </span>
                  </div>
                )
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
