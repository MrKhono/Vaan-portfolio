import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getValidDomain() {
  const domains = ["gmail.com", "yahoo.com", "outlook.com"]

  if (process.env.NODE_ENV === "development") {
    domains.push("example.com")
  }

  return domains
}

/**
 * Formate une Date en chaîne "YYYY-MM-DD" à partir des composants **locaux**.
 * Évite le décalage d'un jour causé par `toISOString()` (qui convertit en UTC)
 * pour les fuseaux à décalage positif comme la France (UTC+1/+2).
 */
export function formatDateLocal(d: Date): string {
  const year  = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day   = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Parse une chaîne "YYYY-MM-DD" en Date locale à minuit (sans conversion UTC).
 */
export function parseDateLocal(s: string): Date {
  const [year, month, day] = s.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function normalizeName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/* ============================================================
 * Helpers de formatage de dates — Fuseau Europe/Paris
 * ============================================================
 * Toutes les fonctions ci-dessous forcent l'affichage en heure
 * française, peu importe le fuseau du serveur (Vercel US, etc.).
 * ============================================================ */

const PARIS_TZ = "Europe/Paris"
const LOCALE   = "fr-FR"

/**
 * Formate une date complète : "lundi 28 octobre 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(LOCALE, {
    timeZone: PARIS_TZ,
    weekday:  "long",
    day:      "numeric",
    month:    "long",
    year:     "numeric",
  })
}

/**
 * Formate une date courte : "28/10/2026"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(LOCALE, {
    timeZone: PARIS_TZ,
    day:      "2-digit",
    month:    "2-digit",
    year:     "numeric",
  })
}

/**
 * Formate une date avec l'heure : "28 oct. 2026 à 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString(LOCALE, {
    timeZone: PARIS_TZ,
    day:      "numeric",
    month:    "short",
    year:     "numeric",
    hour:     "2-digit",
    minute:   "2-digit",
  })
}

/**
 * Formate uniquement l'heure : "14:30"
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString(LOCALE, {
    timeZone: PARIS_TZ,
    hour:     "2-digit",
    minute:   "2-digit",
  })
}

/**
 * Formate "il y a X" (ex: "il y a 2 heures", "à l'instant")
 */
export function formatRelative(date: Date | string): string {
  const d       = typeof date === "string" ? new Date(date) : date
  const now     = new Date()
  const diffMs  = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr  = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1)  return "à l'instant"
  if (diffMin < 60) return `il y a ${diffMin} min`
  if (diffHr  < 24) return `il y a ${diffHr} h`
  if (diffDay < 7)  return `il y a ${diffDay} j`

  return formatDateShort(d)
}

/**
 * Retourne la date du jour en France au format "YYYY-MM-DD".
 * Utile pour comparer avec des dates stockées en string (dispos, créneaux).
 */
export function toParisDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TZ,
    year:     "numeric",
    month:    "2-digit",
    day:      "2-digit",
  }).format(date)
}

/**
 * Formate un mois : "octobre 2026"
 */
export function formatMonth(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(LOCALE, {
    timeZone: PARIS_TZ,
    month:    "long",
    year:     "numeric",
  })
}

/**
 * Formate un jour court : "lun. 28 oct."
 */
export function formatDayShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString(LOCALE, {
    timeZone: PARIS_TZ,
    weekday:  "short",
    day:      "numeric",
    month:    "short",
  })
}