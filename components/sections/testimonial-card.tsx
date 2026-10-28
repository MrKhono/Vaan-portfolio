"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Testimonial } from "@/actions/testimonial.actions"

const MAX_LENGTH = 180

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isLong        = testimonial.content.length > MAX_LENGTH
  const displayedText = isExpanded || !isLong
    ? testimonial.content
    : testimonial.content.slice(0, MAX_LENGTH).trimEnd() + "..."

  return (
    <div className="flex h-full flex-col rounded-xl bg-card p-8 shadow-sm">
      {/* 5 étoiles statiques */}
      <div className="mb-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-[#D6C6B8] text-[#D6C6B8]" />
        ))}
      </div>

      <div className="flex-1">
        <p
          className={cn(
            "text-base leading-relaxed text-muted-foreground italic transition-all duration-300",
            !isExpanded && isLong && "line-clamp-none"
          )}
        >
          {`"${displayedText}"`}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm font-medium text-accent transition-colors hover:text-foreground"
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <p className="font-medium text-foreground">{testimonial.name}</p>
        {testimonial.title && (
          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
        )}
      </div>
    </div>
  )
}