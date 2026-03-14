"use client"

import Link from "next/link"
import { FadeIn } from "@/components/motion"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
      <div className="absolute inset-0">
        <img
          src="/images/fashion-2.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0F0F0F]/80" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#D6C6B8]">
            Votre projet
          </p>
          <h2 className="font-serif text-4xl font-semibold text-[#F8F8F8] md:text-5xl">
            {"Donnons vie a votre vision"}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#F8F8F8]/70">
            {"Chaque projet est unique. Discutons ensemble de vos envies et creons quelque chose d'exceptionnel."}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/rendez-vous"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F8F8F8] px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-[#0F0F0F] transition-all duration-300 hover:bg-[#D6C6B8]"
            >
              Prendre rendez-vous
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-[#F8F8F8]/30 px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-[#F8F8F8] transition-all duration-300 hover:border-[#F8F8F8]/60 hover:bg-[#F8F8F8]/10"
            >
              Voir les tarifs
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
