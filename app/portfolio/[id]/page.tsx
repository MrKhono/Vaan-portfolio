import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectDetailContent } from "@/components/portfolio/project-detail-content"
import { getProjectsAction } from "@/actions/project.actions"

export async function generateStaticParams() {
  const projects = await getProjectsAction()
  return projects.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params,}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id }   = await params
  const projects = await getProjectsAction()
  const project  = projects.find((p) => p.id === id)

  if (!project) return { title: "Projet introuvable" }

  return {
    title:       project.title,
    description: project.description || `Projet ${project.title} — ${project.domain.name}`,
  }
}

export const dynamic = "force-dynamic"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }   = await params
  const projects = await getProjectsAction()
  const index    = projects.findIndex((p) => p.id === id)

  if (index === -1) notFound()

  const project     = projects[index]
  const prevProject = index > 0 ? projects[index - 1] : null
  const nextProject = index < projects.length - 1 ? projects[index + 1] : null

  return (
    <ProjectDetailContent
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  )
}