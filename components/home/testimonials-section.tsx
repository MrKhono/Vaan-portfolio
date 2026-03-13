"use client"

import { Star } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { testimonials } from "@/lib/data"

export function TestimonialsSection() {
  return (
    <section className="bg-secondary/30 px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Temoignages
          </p>
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Ce que disent mes clients
          </h2>
        </FadeIn>

        <StaggerContainer className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <div className="flex h-full flex-col rounded-xl bg-card p-8 shadow-sm">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#D6C6B8] text-[#D6C6B8]"
                    />
                  ))}
                </div>
                <p className="flex-1 text-base leading-relaxed text-muted-foreground italic">
                  {`"${t.content}"`}
                </p>
                <div className="mt-6 border-t border-border pt-6">
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
