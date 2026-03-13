import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { FadeIn } from "@/components/motion"
import { blogPosts } from "@/lib/data"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = blogPosts.find((p) => p.id === id)
  if (!post) return { title: "Article introuvable" }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = blogPosts.find((p) => p.id === id)
  if (!post) notFound()

  return (
    <>
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/80 via-[#0F0F0F]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <FadeIn>
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-sm text-[#F8F8F8]/70 transition-colors hover:text-[#F8F8F8]"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au blog
              </Link>
              <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-[#D6C6B8]">
                {post.category}
              </span>
              <h1 className="font-serif text-4xl font-semibold text-[#F8F8F8] md:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-4 text-sm text-[#F8F8F8]/60">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime} de lecture
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl font-medium leading-relaxed text-foreground">
                {post.excerpt}
              </p>
              <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-muted-foreground">
                <p>{post.content}</p>
                <p>
                  {"La photographie est un art qui demande patience et dedica. Chaque seance est une opportunite de creer quelque chose d'unique, de capturer un moment qui ne se reproduira jamais exactement de la meme maniere. C'est cette ephemerite qui rend notre metier si passionnant."}
                </p>
                <p>
                  {"Au fil des annees, j'ai developpe une methode de travail qui me permet de combiner technique et creativite. La cle reside dans la preparation : connaitre son sujet, anticiper la lumiere, et etre pret a saisir l'inattendu."}
                </p>
                <p>
                  {"N'hesitez pas a me contacter si vous souhaitez en savoir plus sur mes techniques ou si vous avez des questions. Je suis toujours ravi de partager ma passion avec d'autres passionnes de photographie."}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-16 border-t border-border pt-8">
              <div className="flex items-center gap-4">
                <img
                  src="/images/photographer.jpg"
                  alt="Alexandre Dupont"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-serif text-lg font-semibold text-foreground">
                    Alexandre Dupont
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Photographe professionnel
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
