import Link from "next/link"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { getHomeGalleryPhotosAction } from "@/actions/home-gallery.actions"

export async function GalleryPreview() {
  const photos = await getHomeGalleryPhotosAction()

  if (photos.length === 0) return null

  return (
    <section className="bg-secondary/30 px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Portfolio
          </p>
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Travaux Récents
          </h2>
        </FadeIn>

        {/* Masonry CSS columns — chaque photo garde son ratio naturel */}
        <StaggerContainer className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 lg:gap-6">
          {photos.map((photo, i) => (
            <StaggerItem key={photo.id} className="mb-4 break-inside-avoid sm:mb-5 lg:mb-6">
              <Link
                href="/portfolio"
                className="group relative block overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={photo.image}
                  alt={photo.title || `Photo ${i + 1}`}
                  loading="lazy"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay dégradé — toujours légèrement visible, intensifié au hover */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0F0F0F]/40 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                {(photo.title || photo.category) && (
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:p-6">
                    {photo.category && (
                      <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#D6C6B8]">
                        {photo.category}
                      </p>
                    )}
                    {photo.title && (
                      <h3 className="font-serif text-lg font-semibold leading-tight text-[#F8F8F8] md:text-xl">
                        {photo.title}
                      </h3>
                    )}
                  </div>
                )}
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3} className="mt-12 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:opacity-90"
          >
            Voir tout le portfolio
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}