import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getValidDomain () {
  const domains = ["gmail.com", "yahoo.com", "outlook.com"]

  if(process.env.NODE_ENV === "development"){
    domains.push("example.com");
  }

  return domains;
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