"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbox } from "@/components/lightbox"
import { FadeIn } from "@/components/motion"
import { projects, categories, type Category } from "@/lib/data"
import { cn } from "@/lib/utils"

export function PortfolioGrid() {
  const searchParams = useSearchParams()
  const initialCategory = (searchParams.get("category") as Category | "all") || "all"
  const [activeCategory, setActiveCategory] = useState<Category | "all">(initialCategory)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects
    return projects.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  const lightboxImages = filteredProjects.map((p) => ({
    src: p.coverImage,
    alt: p.title,
  }))

  return (
    <>
      <FadeIn className="mb-12 flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300",
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </FadeIn>

      <motion.div layout className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="mb-6 break-inside-avoid"
            >
              <div className="group relative overflow-hidden rounded-xl">
                <div
                  className={
                    i % 3 === 0
                      ? "aspect-[3/4]"
                      : i % 3 === 1
                        ? "aspect-square"
                        : "aspect-[4/3]"
                  }
                >
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F0F0F]/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <h3 className="font-serif text-2xl font-semibold text-[#F8F8F8]">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm capitalize text-[#D6C6B8]">
                    {project.category}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/portfolio/${project.id}`}
                      className="rounded-lg bg-[#F8F8F8] px-5 py-2 text-xs font-medium uppercase tracking-wider text-[#0F0F0F] transition-all hover:bg-[#D6C6B8]"
                    >
                      Voir le projet
                    </Link>
                    <button
                      onClick={() => {
                        setLightboxIndex(i)
                        setLightboxOpen(true)
                      }}
                      className="rounded-lg border border-[#F8F8F8]/30 px-5 py-2 text-xs font-medium uppercase tracking-wider text-[#F8F8F8] transition-all hover:bg-[#F8F8F8]/10"
                    >
                      Apercu
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

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
