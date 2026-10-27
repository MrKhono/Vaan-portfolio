"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImagePositionPickerProps {
  image:    string
  value:    string
  onChange: (position: string) => void
  label?:   string
}

const PRESETS = [
  { label: "Centre",    value: "50% 50%"  },
  { label: "Haut",      value: "50% 0%"   },
  { label: "Bas",       value: "50% 100%" },
  { label: "Gauche",    value: "0% 50%"   },
  { label: "Droite",    value: "100% 50%" },
]

function parsePosition(value: string): { x: number; y: number } {
  const parts = value.replace(/%/g, "").split(" ")
  return {
    x: parseFloat(parts[0]) || 50,
    y: parseFloat(parts[1]) || 50,
  }
}

export function ImagePositionPicker({
  image,
  value,
  onChange,
  label = "Position de l'image",
}: ImagePositionPickerProps) {
  const containerRef           = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { x, y }               = parsePosition(value)

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current
      if (!container) return

      const rect   = container.getBoundingClientRect()
      const xPos   = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width)  * 100))
      const yPos   = Math.max(0, Math.min(100, ((clientY - rect.top)  / rect.height) * 100))

      onChange(`${Math.round(xPos)}% ${Math.round(yPos)}%`)
    },
    [onChange]
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updatePosition(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    updatePosition(touch.clientX, touch.clientY)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX, e.clientY)
    const handleMouseUp   = () => setIsDragging(false)
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }
    const handleTouchEnd  = () => setIsDragging(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup",   handleMouseUp)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend",  handleTouchEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup",   handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend",  handleTouchEnd)
    }
  }, [isDragging, updatePosition])

  if (!image) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Ajoutez d&apos;abord une image de couverture
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <p className="font-mono text-xs text-muted-foreground">{value}</p>
      </div>

      {/* Zone interactive de positionnement */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={cn(
          "relative aspect-video w-full cursor-crosshair overflow-hidden rounded-lg border bg-muted select-none",
          isDragging && "ring-2 ring-primary"
        )}
      >
        <img
          src={image}
          alt="Aperçu"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* Grille de guidage */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-1/3  top-0 h-full w-px bg-white" />
          <div className="absolute left-2/3  top-0 h-full w-px bg-white" />
          <div className="absolute top-1/3   left-0 h-px w-full bg-white" />
          <div className="absolute top-2/3   left-0 h-px w-full bg-white" />
        </div>

        {/* Point focal (cible) */}
        <div
          className={cn(
            "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-transform",
            isDragging ? "scale-110" : "scale-100"
          )}
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm" />
            <div className="absolute inset-2 rounded-full border-2 border-white" />
            <Target className="relative h-4 w-4 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Presets rapides */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.value}
            type="button"
            variant={value === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Cliquez ou glissez sur l&apos;image pour choisir le point focal. L&apos;image s&apos;ajustera autour de ce point sur la page du projet.
      </p>
    </div>
  )
}