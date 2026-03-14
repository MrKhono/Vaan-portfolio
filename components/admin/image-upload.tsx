"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, Loader2, Link as LinkIcon, Plus } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// — ImageUpload (inchangé) —————————————————————————————————————————

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  description?: string
  aspectRatio?: "square" | "video" | "portrait" | "wide"
  className?: string
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  label,
  description,
  aspectRatio = "video",
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging]   = useState(false)
  const [useUrl, setUseUrl]           = useState(false)
  const [urlInput, setUrlInput]       = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectRatioClasses = {
    square:   "aspect-square",
    video:    "aspect-video",
    portrait: "aspect-[3/4]",
    wide:     "aspect-[21/9]",
  }

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return
    setIsUploading(true)

    try {
      const form = new FormData()
      form.append("files", file)

      const res  = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()

      if (data.urls?.[0]) onChange(data.urls[0])
    } catch {
      // silencieux
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
      setUseUrl(false)
    }
  }

  const handleRemove = () => {
    onChange("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      {value ? (
        <div className={cn("relative overflow-hidden rounded-lg border border-border bg-muted", aspectRatioClasses[aspectRatio])}>
          <Image src={value} alt="Uploaded image" fill className="object-cover" />
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity hover:opacity-100">
              <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />Changer
              </Button>
              <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
                <X className="mr-2 h-4 w-4" />Supprimer
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            aspectRatioClasses[aspectRatio],
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
            disabled && "pointer-events-none opacity-50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
          ) : useUrl ? (
            <div className="flex w-full max-w-xs flex-col gap-2 p-4">
              <Input
                type="url"
                placeholder="https://exemple.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              />
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={handleUrlSubmit} disabled={!urlInput.trim()} className="flex-1">
                  Valider
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setUseUrl(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 p-4 text-center">
              <div className="rounded-full bg-muted p-3">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Glissez une image ici ou</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP jusqu&apos;à 10MB</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />Parcourir
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setUseUrl(true)}>
                  <LinkIcon className="mr-2 h-4 w-4" />URL
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" disabled={disabled} />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

// — MultiImageUpload ——————————————————————————————————————————————

interface MultiImageUploadProps {
  values:      string[]
  onChange:    (values: string[]) => void
  label?:      string
  description?: string
  maxImages?:  number
  className?:  string
}

export function MultiImageUpload({
  values,
  onChange,
  label,
  description,
  maxImages = 20,
  className,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging]   = useState(false)
  const [urlInput, setUrlInput]       = useState("")
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const remaining = maxImages - values.length

  const handleFilesUpload = useCallback(async (files: FileList) => {
    const imageFiles = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .slice(0, remaining) // respecte la limite

    if (!imageFiles.length) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const form = new FormData()
      imageFiles.forEach(f => form.append("files", f))

      const res  = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()

      if (data.urls?.length) {
        onChange([...values, ...data.urls])
      }
    } catch {
      // silencieux
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (inputRef.current) inputRef.current.value = ""
    }
  }, [values, onChange, remaining])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) handleFilesUpload(e.dataTransfer.files)
  }, [handleFilesUpload])

  const handleDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFilesUpload(e.target.files)
  }

  const handleUrlAdd = () => {
    const url = urlInput.trim()
    if (!url || values.length >= maxImages) return
    onChange([...values, url])
    setUrlInput("")
    setShowUrlInput(false)
  }

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const canAddMore = values.length < maxImages

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <span className="text-xs text-muted-foreground">
            {values.length} / {maxImages} images
          </span>
        </div>
      )}

      {/* Grille des images uploadées */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {values.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              {/* Numéro */}
              <div className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                {index + 1}
              </div>
              {/* Bouton suppression */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Cellule d'ajout rapide dans la grille */}
          {canAddMore && !isUploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/50 hover:text-primary"
            >
              <Plus className="h-6 w-6" />
            </button>
          )}
        </div>
      )}

      {/* Zone de drop principale — affichée seulement si aucune image ou zone vide */}
      {canAddMore && (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload en cours...</p>
            </div>
          ) : showUrlInput ? (
            <div className="flex w-full max-w-sm flex-col gap-2">
              <Input
                type="url"
                placeholder="https://exemple.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUrlAdd}
                  disabled={!urlInput.trim()}
                  className="flex-1"
                >
                  Ajouter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowUrlInput(false); setUrlInput("") }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-full bg-muted p-3">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Glissez des images ici
                </p>
                <p className="text-xs text-muted-foreground">
                  Sélection multiple — PNG, JPG, WEBP • encore {remaining} image{remaining > 1 ? "s" : ""} possible{remaining > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Parcourir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUrlInput(true)}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  URL
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Message limite atteinte */}
      {!canAddMore && (
        <p className="text-center text-xs text-muted-foreground">
          Limite de {maxImages} images atteinte
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}