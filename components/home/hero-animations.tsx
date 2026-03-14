"use client"

import { motion } from "framer-motion"

export function HeroImageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 1.15 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  )
}

export function HeroTagline({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-[#D6C6B8]"
    >
      {children}
    </motion.p>
  )
}

export function HeroTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="font-serif text-5xl font-semibold leading-tight tracking-tight text-[#F8F8F8] md:text-7xl lg:text-8xl"
    >
      {children}
    </motion.h1>
  )
}

export function HeroSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[#F8F8F8]/70"
    >
      {children}
    </motion.p>
  )
}

export function HeroButtons({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
    >
      {children}
    </motion.div>
  )
}

export function HeroScrollIndicator({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}