"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ImageUpload, MultiImageUpload } from "@/components/admin/image-upload"
import Link from "next/link"
import { ProjectData } from "@/actions/project.actions"
import { Domain } from "@/actions/domain.actions"

interface ProjectFormProps {
  formData: ProjectData
  onChange: (data: ProjectData) => void
  domains:  Domain[]
}

export function ProjectForm({ formData, onChange, domains }: ProjectFormProps) {
  function set<K extends keyof ProjectData>(key: K, value: ProjectData[K]) {
    onChange({ ...formData, [key]: value })
  }

  function handleImagesChange(newImages: string[]) {
    const coverImage =
      formData.coverImage && newImages.includes(formData.coverImage)
        ? formData.coverImage
        : newImages[0] ?? ""
    onChange({ ...formData, images: newImages, coverImage })
  }

  return (
    <div className="space-y-6 py-4">

      {/* Titre + Domaine */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titre du projet *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Sophie & Thomas"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="domain">Domaine *</Label>
          {domains.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun domaine.{" "}
              <Link href="/admin/domaines" className="underline">
                Créer un domaine
              </Link>
            </p>
          ) : (
            <Select value={formData.domainId} onValueChange={(v) => set("domainId", v)}>
              <SelectTrigger id="domain">
                <SelectValue placeholder="Choisir un domaine" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Décrivez ce projet..."
          rows={4}
        />
      </div>

      {/* Date + Lieu */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            value={formData.date}
            onChange={(e) => set("date", e.target.value)}
            placeholder="Juin 2025"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Lieu</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Paris, France"
          />
        </div>
      </div>

      {/* Client + Appareil + Objectif */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => set("client", e.target.value)}
            placeholder="Nom du client"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="camera">Appareil photo</Label>
          <Input
            id="camera"
            value={formData.camera}
            onChange={(e) => set("camera", e.target.value)}
            placeholder="Canon EOS R5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lens">Objectif</Label>
          <Input
            id="lens"
            value={formData.lens}
            onChange={(e) => set("lens", e.target.value)}
            placeholder="RF 28-70mm f/2L"
          />
        </div>
      </div>

      {/* Image de couverture */}
      <ImageUpload
        label="Image de couverture"
        value={formData.coverImage}
        onChange={(value) => set("coverImage", value)}
        aspectRatio="video"
        description="L'image principale qui représente le projet"
      />

      {/* Photos du projet */}
      <MultiImageUpload
        label="Photos du projet"
        values={formData.images}
        onChange={handleImagesChange}
        maxImages={30}
        description="Ajoutez toutes les photos de ce projet (max 30)"
      />
    </div>
  )
}