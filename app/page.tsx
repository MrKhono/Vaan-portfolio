import { Hero } from "@/components/home/hero"
import { CategoriesSection } from "@/components/home/categories-section"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { AboutPreview } from "@/components/home/about-preview"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <GalleryPreview />
      <AboutPreview />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
