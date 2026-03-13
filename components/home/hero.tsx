"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="h-full w-full"
        >
          <img
            src="/images/hero.jpg"
            alt="Photographie artistique par Alexandre Dupont"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/60 via-[#0F0F0F]/40 to-[#0F0F0F]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-[#D6C6B8]"
        >
          Photographe Professionnel
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif text-5xl font-semibold leading-tight tracking-tight text-[#F8F8F8] md:text-7xl lg:text-8xl"
        >
          <span className="text-balance">{"Capturer l'essence"}</span>
          <br />
          <span className="text-balance">de chaque instant</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[#F8F8F8]/70"
        >
          {"L'art de raconter votre histoire a travers une photographie authentique, elegante et intemporelle."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#F8F8F8] px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-[#0F0F0F] transition-all duration-300 hover:bg-[#D6C6B8]"
          >
            Voir le portfolio
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-[#F8F8F8]/30 px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-[#F8F8F8] transition-all duration-300 hover:border-[#F8F8F8]/60 hover:bg-[#F8F8F8]/10"
          >
            Me contacter
          </Link>
        </motion.div>
      </div>

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
          <ArrowDown className="h-5 w-5 text-[#F8F8F8]/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
