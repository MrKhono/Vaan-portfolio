import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import * as LucideIcons from "lucide-react";
import { Camera, Heart, Eye, Award, type LucideIcon } from "lucide-react";
import { getAboutAction } from "@/actions/about.actions";
import { getExperiencesAction } from "@/actions/experience.actions";
import { getPartnersAction } from "@/actions/partner.actions";
import Image from "next/image";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez Charles Ouedraogo Sontong-Noma, photographe professionnel avec plus de 10 ans d'expérience en mariage, portrait, mode et événementiel.",
};

const fallbackValues = [
  {
    icon: Eye,
    title: "Vision",
    description:
      "Chaque projet commence par une vision claire. Je cherche à voir au-delà de l'évident pour capturer l'essence véritable d'un moment.",
  },
  {
    icon: Heart,
    title: "Émotion",
    description:
      "La photographie est avant tout une question d'émotion. Je m'efforce de créer des images qui touchent le cœur et racontent une histoire.",
  },
  {
    icon: Camera,
    title: "Excellence",
    description:
      "La maîtrise technique est au service de la créativité. Je perfectionne constamment mon art pour offrir un travail d'exception.",
  },
  {
    icon: Award,
    title: "Authenticité",
    description:
      "Pas de poses forcées, pas d'artifices. Je privilégie le naturel et la spontanéité pour des images vraies et intemporelles.",
  },
];

function resolveIcon(name: string): LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[name];
  return (typeof icon === "function" ? icon : Camera) as LucideIcon;
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [about, experiences, partners] = await Promise.all([
    getAboutAction(),
    getExperiencesAction(),
    getPartnersAction(),
  ]);

  const image = about.image || "/images/photographer.jpg";
  const title = about.title || "Ouedraogo Sontong-Noma Charles";
  const description =
    about.description ||
    "Photographe passionné, conteur d'histoires visuelles, éternel curieux.";

  const values =
    about.values.length > 0
      ? about.values.map((v) => ({ ...v, icon: resolveIcon(v.icon) }))
      : fallbackValues;

  const timeline = [...experiences].sort(
    (a, b) => parseInt(b.year) - parseInt(a.year),
  );

  return (
    <>
      <section className="bg-primary px-6 pb-16 pt-32 text-center lg:px-8 lg:pb-24 lg:pt-40">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            À propos
          </p>
          <h1 className="font-serif text-5xl font-semibold text-primary-foreground md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/60">
            Photographe passionné, conteur d&apos;histoires visuelles, éternel
            curieux.
          </p>
        </FadeIn>
      </section>

      <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn direction="left" className="overflow-hidden rounded-xl">
            <img
              src={image}
              alt={`${title} dans son studio`}
              className="aspect-[4/5] w-full object-cover"
            />
          </FadeIn>

          <FadeIn direction="right">
            <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
              {"L'art de capturer l'instant"}
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                {
                  "Depuis mon enfance, j'ai toujours été fasciné par la lumière et la façon dont elle transforme le monde qui nous entoure. C'est cette passion qui m'a naturellement conduit vers la photographie."
                }
              </p>
              <p>
                {
                  "Après une formation aux Beaux-Arts et plusieurs années en tant qu'assistant dans les plus grands studios parisiens, j'ai lancé mon propre studio en 2016. Depuis, j'ai eu le privilège de travailler avec des couples, des marques de mode prestigieuses et des entreprises du monde entier."
                }
              </p>
              <p>
                {
                  "Mon approche est simple : écouter, observer, puis capturer. Je crois profondément que les plus belles images naissent de la connexion authentique entre le photographe et son sujet."
                }
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Valeurs dynamiques */}
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

      {/* Timeline dynamique */}
      {timeline.length > 0 && (
        <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <FadeIn className="mb-16 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                Parcours
              </p>
              <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
                Mon Expérience
              </h2>
            </FadeIn>

            <div className="relative">
              <div className="absolute bottom-0 left-4 top-0 w-px bg-border md:left-1/2 md:-translate-x-px" />
              <StaggerContainer className="flex flex-col gap-12">
                {timeline.map((item, i) => (
                  <StaggerItem key={item.id}>
                    <div
                      className={`relative flex flex-col gap-4 pl-12 md:flex-row md:gap-8 md:pl-0 ${
                        i % 2 === 0 ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="absolute left-2 top-1 h-5 w-5 rounded-full border-2 border-accent bg-background md:left-1/2 md:-translate-x-1/2" />
                      <div
                        className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}
                      >
                        <span className="text-sm font-semibold text-accent">
                          {item.year}
                        </span>
                        <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="hidden flex-1 md:block" />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>
      )}

      {/* Partenaires dynamiques */}
      {partners.length > 0 && (
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
                {partners.map((partner) => (
                  <div key={partner.id}>
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-3 rounded-xl bg-card px-6 py-8 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <PartnerLogo partner={partner} />
                      </a>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-card px-6 py-8 shadow-sm">
                        <PartnerLogo partner={partner} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </>
  );
}

function PartnerLogo({
  partner,
}: {
  partner: { name: string; logo?: string | null; website?: string | null };
}) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            {partner.name.charAt(0)}
          </div>
        )}
      </div>

      <span className="text-sm font-medium text-foreground text-center">
        {partner.name}
      </span>
    </div>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}
