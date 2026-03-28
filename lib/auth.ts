import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { prisma } from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/argon2"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { getValidDomain, normalizeName } from "@/lib/utils"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "https://www.vaanphotography.fr",
    "https://vaanphotography.fr",
    "http://localhost:3000",
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email  = String(ctx.body.email)
        const domain = email.split("@")[1]

        const VALID_DOMAINS = getValidDomain()
        if (!VALID_DOMAINS.includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "Echec d'enregistrement, domaine invalide. Entrez un email valide !",
          })
        }

        const name = normalizeName(ctx.body.name)

        return {
          context: {
            ...ctx,
            body: { ...ctx.body, name },
          },
        }
      }
    }),
  },
  session: {
    expiresIn: 1 * 24 * 60 * 60,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [nextCookies()],
})

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN"