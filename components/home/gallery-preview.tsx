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

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <StaggerItem key={photo.id}>
              <Link
                href="/portfolio"
                className="group relative block overflow-hidden rounded-xl"
              >
                <div className="aspect-square">
                  <img
                    src={photo.image}
                    alt={photo.title || `Photo ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {(photo.title || photo.category) && (
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-[#0F0F0F]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="p-6">
                      {photo.category && (
                        <p className="text-xs font-medium uppercase tracking-wider text-[#D6C6B8]">
                          {photo.category}
                        </p>
                      )}
                      {photo.title && (
                        <h3 className="mt-1 font-serif text-xl font-semibold text-[#F8F8F8]">
                          {photo.title}
                        </h3>
                      )}
                    </div>
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