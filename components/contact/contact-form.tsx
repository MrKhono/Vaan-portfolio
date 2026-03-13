"use client"

import { useState } from "react"
import { FadeIn } from "@/components/motion"
import { Send, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const projectTypes = [
  "Mariage",
  "Portrait",
  "Mode",
  "Evenementiel",
  "Corporate",
  "Autre",
]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <FadeIn className="flex flex-col items-center justify-center rounded-xl bg-card p-12 text-center shadow-sm">
        <CheckCircle2 className="h-12 w-12 text-accent" />
        <h3 className="mt-6 font-serif text-2xl font-semibold text-foreground">
          Message envoye !
        </h3>
        <p className="mt-3 text-muted-foreground">
          {"Merci pour votre message. Je vous repondrai dans les plus brefs delais."}
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setFormData({ name: "", email: "", projectType: "", message: "" })
          }}
          className="mt-6 text-sm font-medium text-accent hover:underline"
        >
          Envoyer un autre message
        </button>
      </FadeIn>
    )
  }

  return (
    <FadeIn>
      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-card p-8 shadow-sm lg:p-10"
      >
        <div className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Type de projet
            </label>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, projectType: type })
                  }
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-all duration-200",
                    formData.projectType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Parlez-moi de votre projet..."
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:opacity-90"
          >
            <Send className="h-4 w-4" />
            Envoyer le message
          </button>
        </div>
      </form>
    </FadeIn>
  )
}
