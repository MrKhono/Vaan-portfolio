"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface LightboxProps {
  images: { src: string; alt: string }[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape")    onClose()
      if (e.key === "ArrowLeft")  onPrev()
      if (e.key === "ArrowRight") onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && images[currentIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-[#0F0F0F]/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Bouton fermer — z-50 pour rester au-dessus */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-full bg-[#F8F8F8]/10 p-3 text-[#F8F8F8] transition-colors hover:bg-[#F8F8F8]/20 md:right-6 md:top-6"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              {/* Flèche précédente — z-50 + positionnement vertical centré */}
              <button
                onClick={(e) => { e.stopPropagation(); onPrev() }}
                className="absolute left-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-[#F8F8F8]/20 p-3 text-[#F8F8F8] backdrop-blur-sm transition-colors hover:bg-[#F8F8F8]/30 md:left-8"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Flèche suivante */}
              <button
                onClick={(e) => { e.stopPropagation(); onNext() }}
                className="absolute right-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-[#F8F8F8]/20 p-3 text-[#F8F8F8] backdrop-blur-sm transition-colors hover:bg-[#F8F8F8]/30 md:right-8"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </>
          )}

          {/* Image — z-10, sous les boutons */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
          </motion.div>

          {/* Compteur — z-50 */}
          <div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2">
            <p className="text-sm text-[#F8F8F8]/70">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}