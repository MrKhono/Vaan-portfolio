import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Plus, Eye, Pencil, Trash2, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Project } from "@/actions/project.actions"
import { Domain } from "@/actions/domain.actions"

interface ProjectsTableProps {
  projects: Project[]
  domains:  Domain[]
  onEdit:   (project: Project) => void
  onDelete: (id: string) => void
}

export function ProjectsTable({ projects, onEdit, onDelete }: ProjectsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Domaine</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead className="text-center">Photos</TableHead>
              <TableHead className="w-32"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                    {project.coverImage ? (
                      <Image src={project.coverImage} alt={project.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{project.domain.name}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{project.date || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{project.location || "—"}</TableCell>
                <TableCell className="text-center">{project.images.length}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/portfolio/${project.id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun projet</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}