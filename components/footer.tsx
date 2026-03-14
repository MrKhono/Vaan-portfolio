import Link from "next/link"
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { SiteSettings } from "@/actions/settings.actions"

interface FooterProps {
  settings: SiteSettings
}

export function Footer({ settings }: FooterProps) {
  const socialLinks = settings?.socialLinks || {}

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo + description */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-2xl font-semibold tracking-wide text-foreground"
            >
              {settings?.siteName || "Alexandre Dupont"}
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {settings?.siteDescription ||
                "Photographe professionnel captant les moments précieux avec élégance et émotion depuis plus de 10 ans."}
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-6 flex gap-4">

              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}

              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}

              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}

            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Navigation
            </h3>

            <ul className="mt-4 flex flex-col gap-3">
              {[
                { href: "/", label: "Accueil" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/about", label: "À propos" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Services
            </h3>

            <ul className="mt-4 flex flex-col gap-3">
              {[
                "Mariage",
                "Portrait",
                "Mode",
                "Événementiel",
                "Corporate",
                "Lifestyle",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Contact
            </h3>

            <ul className="mt-4 flex flex-col gap-4">

              {settings?.contactEmail && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    {settings.contactEmail}
                  </span>
                </li>
              )}

              {settings?.contactPhone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    {settings.contactPhone}
                  </span>
                </li>
              )}

              {settings?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm text-muted-foreground whitespace-pre-line">
                    {settings.address}
                  </span>
                </li>
              )}

            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            {settings?.siteName || "Alexandre Dupont Photographie"}.
            Tous droits réservés.
          </p>

          <div className="flex gap-6">
            <Link
              href="https://www.linkedin.com/in/armand-khono1/"
              target="_blank"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Développé par <strong>Next In</strong>
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}