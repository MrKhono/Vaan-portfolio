import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { blogPosts } from "@/lib/data"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conseils, techniques et coulisses de la photographie professionnelle par Alexandre Dupont.",
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <>
      <section className="bg-primary px-6 pb-16 pt-32 text-center lg:px-8 lg:pb-24 lg:pt-40">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Blog
          </p>
          <h1 className="font-serif text-5xl font-semibold text-primary-foreground md:text-6xl">
            Journal
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/60">
            {"Reflexions, conseils et coulisses de mon quotidien de photographe."}
          </p>
        </FadeIn>
      </section>

      <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <Link
              href={`/blog/${featured.id}`}
              className="group grid overflow-hidden rounded-xl bg-card shadow-sm md:grid-cols-2"
            >
              <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <span className="text-xs font-medium uppercase tracking-wider text-accent">
                  {featured.category}
                </span>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-foreground lg:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime}
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                  Lire la suite
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </FadeIn>

          <StaggerContainer className="mt-12 grid gap-8 md:grid-cols-2">
            {rest.map((post) => (
              <StaggerItem key={post.id}>
                <Link
                  href={`/blog/${post.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-sm"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-medium uppercase tracking-wider text-accent">
                      {post.category}
                    </span>
                    <h3 className="mt-2 font-serif text-xl font-semibold text-foreground">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  )
}
