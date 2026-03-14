import Link from "next/link"
import { ArrowDown } from "lucide-react"
import {
  HeroImageWrapper,
  HeroTagline,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  HeroScrollIndicator,
} from "./hero-animations"
import { getHeroAction } from "@/actions/hero.actions"

const defaultHero = {
  title: "Capturer l'essence\nde chaque instant",
  subtitle: "L'art de raconter votre histoire à travers une photographie authentique, élégante et intemporelle.",
  image: "/images/hero.jpg",
}

export async function Hero() {
  const data = await getHeroAction()

  const hero = {
    title: data.title || defaultHero.title,
    subtitle: data.subtitle || defaultHero.subtitle,
    image: data.image || defaultHero.image,
  }

  const titleLines = hero.title.split("\n")

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <HeroImageWrapper>
          <img
            src={hero.image}
            alt="Photographie artistique"
            className="h-full w-full object-cover"
          />
        </HeroImageWrapper>
        <div className="absolute inset-0 bg-linear-to-b from-[#0F0F0F]/60 via-[#0F0F0F]/40 to-[#0F0F0F]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <HeroTagline>
          Photographe Professionnel
        </HeroTagline>

        <HeroTitle>
          {titleLines.map((line, i) => (
            <span key={i} className="text-balance block">
              {line}
            </span>
          ))}
        </HeroTitle>

        <HeroSubtitle>
          {hero.subtitle}
        </HeroSubtitle>

        <HeroButtons>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#F8F8F8] px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-[#0F0F0F] transition-all duration-300 hover:bg-[#D6C6B8]"
          >
            Voir le portfolio
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-[#F8F8F8]/30 px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-[#F8F8F8] transition-all duration-300 hover:border-[#F8F8F8]/60 hover:bg-[#F8F8F8]/10"
          >
            Me contacter
          </Link>
        </HeroButtons>
      </div>

      <HeroScrollIndicator>
        <ArrowDown className="h-5 w-5 text-[#F8F8F8]/50" />
      </HeroScrollIndicator>
    </section>
  )
}