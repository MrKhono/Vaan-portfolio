"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, MapPin, Camera, Aperture } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { Lightbox } from "@/components/lightbox"
import type { Project } from "@/lib/data"

interface ProjectDetailContentProps {
  project: Project
  prevProject: Project | null
  nextProject: Project | null
}

export function ProjectDetailContent({
  project,
  prevProject,
  nextProject,
}: ProjectDetailContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const lightboxImages = project.images.map((img) => ({
    src: img,
    alt: project.title,
  }))

  return (
    <>
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/80 via-[#0F0F0F]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <Link
                href="/portfolio"
                className="mb-6 inline-flex items-center gap-2 text-sm text-[#F8F8F8]/70 transition-colors hover:text-[#F8F8F8]"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au portfolio
              </Link>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#D6C6B8]">
                {project.category}
              </p>
              <h1 className="font-serif text-5xl font-semibold text-[#F8F8F8] md:text-6xl">
                {project.title}
              </h1>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-3">
            <FadeIn className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                A propos du projet
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="rounded-xl bg-card p-8 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Details
                </h3>
                <ul className="mt-6 flex flex-col gap-4">
                  <li className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium text-foreground">{project.date}</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Lieu</p>
                      <p className="text-sm font-medium text-foreground">{project.location}</p>
                    </div>
                  </li>
                  {project.camera && (
                    <li className="flex items-center gap-3">
                      <Camera className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Boitier</p>
                        <p className="text-sm font-medium text-foreground">{project.camera}</p>
                      </div>
                    </li>
                  )}
                  {project.lens && (
                    <li className="flex items-center gap-3">
                      <Aperture className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Objectif</p>
                        <p className="text-sm font-medium text-foreground">{project.lens}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </FadeIn>
          </div>

          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {project.images.map((img, i) => (
              <StaggerItem key={i}>
                <button
                  onClick={() => {
                    setLightboxIndex(i)
                    setLightboxOpen(true)
                  }}
                  className="group relative block w-full overflow-hidden rounded-xl"
                >
                  <div className="aspect-[4/3]">
                    <img
                      src={img}
                      alt={`${project.title} - Photo ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0F0F0F]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-sm font-medium text-[#F8F8F8]">Agrandir</span>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-t border-border bg-card px-6 py-12 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {prevProject ? (
            <Link
              href={`/portfolio/${prevProject.id}`}
              className="group flex items-center gap-3"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
              <div>
                <p className="text-xs text-muted-foreground">Projet precedent</p>
                <p className="font-serif text-lg font-medium text-foreground">
                  {prevProject.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link
              href={`/portfolio/${nextProject.id}`}
              className="group flex items-center gap-3 text-right"
            >
              <div>
                <p className="text-xs text-muted-foreground">Projet suivant</p>
                <p className="font-serif text-lg font-medium text-foreground">
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setLightboxIndex((prev) =>
            prev === 0 ? lightboxImages.length - 1 : prev - 1
          )
        }
        onNext={() =>
          setLightboxIndex((prev) =>
            prev === lightboxImages.length - 1 ? 0 : prev + 1
          )
        }
      />
    </>
  )
}
