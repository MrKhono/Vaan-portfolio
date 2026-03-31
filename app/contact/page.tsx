import type { Metadata } from "next";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { FadeIn } from "@/components/motion";
import { ContactForm } from "@/components/contact/contact-form";
import { getSettingsAction } from "@/actions/settings.actions";
import { getServicesAction } from "@/actions/service.actions";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Vaan Charles pour votre projet photographique. Devis gratuit et réponse sous 24h.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [settings, services] = await Promise.all([
    getSettingsAction(),
    getServicesAction(),
  ]);

  const socialLinks = settings?.socialLinks || {};
  const servicesTitles = services.map((s) => s.title);

  return (
    <>
      <section className="bg-primary px-6 pb-16 pt-32 text-center lg:px-8 lg:pb-24 lg:pt-40">
        <FadeIn>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Contact
          </p>
          <h1 className="font-serif text-5xl font-semibold text-primary-foreground md:text-6xl">
            Parlons de votre projet
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/60">
            Vous avez un projet en tête ? N'hésitez pas à me contacter. Je vous
            répondrai dans les 24 heures.
          </p>
        </FadeIn>
      </section>

      <section className="bg-background px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Formulaire */}
          <div className="lg:col-span-3">
            <ContactForm serviceTypes={servicesTitles} />
          </div>

          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Coordonnées */}
            <FadeIn delay={0.1}>
              <div className="rounded-xl bg-card p-8 shadow-sm">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Coordonnées
                </h3>
                <ul className="mt-6 flex flex-col gap-5">
                  {settings?.contactEmail && (
                    <li className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                        <Mail className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Email
                        </p>
                        <a
                          href={`mailto:${settings.contactEmail}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {settings.contactEmail}
                        </a>
                      </div>
                    </li>
                  )}

                  {settings?.contactPhone && (
                    <li className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                        <Phone className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Téléphone
                        </p>
                        <a
                          href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {settings.contactPhone}
                        </a>
                      </div>
                    </li>
                  )}

                  {settings?.address && (
                    <li className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                        <MapPin className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Studio
                        </p>
                        <p className="whitespace-pre-line text-sm text-muted-foreground">
                          {settings.address}
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </FadeIn>

            {/* Réseaux sociaux */}
            {Object.values(socialLinks).some(Boolean) && (
              <FadeIn delay={0.2}>
                <div className="rounded-xl bg-card p-8 shadow-sm">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    Réseaux sociaux
                  </h3>
                  <div className="mt-6 flex gap-4">
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}

                    {socialLinks.facebook && (
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}

                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Google Maps */}
            <FadeIn delay={0.3}>
              <div className="overflow-hidden rounded-xl shadow-sm">
                <iframe
                  title="Localisation du studio"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.569953658636!2d2.5247886123173053!3d48.86641040002225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e612136c5e24eb%3A0x76377bc5d4fcd985!2s3%20Rue%20Louis%20Vannini%2C%2093330%20Neuilly-sur-Marne%2C%20France!5e0!3m2!1sen!2ssn!4v1774926101947!5m2!1sen!2ssn"
                  className="h-[250px] w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
