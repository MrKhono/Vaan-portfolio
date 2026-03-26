import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const authPath = "/admin/login"

export async function proxy(req: NextRequest) {
  const { nextUrl } = req
  const sessionCookie = getSessionCookie(req)

  const isOnAuthRoute      = nextUrl.pathname.startsWith(authPath)
  const isOnProtectedRoute = nextUrl.pathname.startsWith("/admin") && !isOnAuthRoute

  // Pas de cookie → redirection immédiate sans appel réseau
  if (isOnProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL(authPath, req.url))
  }

  // Cookie présent → vérifier la validité réelle de la session
  if (isOnProtectedRoute && sessionCookie) {
    try {
      // Utilise req.url comme base — fonctionne en local ET en production
      const sessionUrl = new URL("/api/auth/get-session", req.url)

      const response = await fetch(sessionUrl.toString(), {
        headers: { cookie: req.headers.get("cookie") ?? "" },
      })

      const session = await response.json()

      if (!session?.user) {
        const redirectResponse = NextResponse.redirect(new URL(authPath, req.url))
        redirectResponse.cookies.delete("better-auth.session_token")
        return redirectResponse
      }
    } catch {
      return NextResponse.redirect(new URL(authPath, req.url))
    }
  }

  // Déjà connecté → rediriger vers le dashboard
  if (isOnAuthRoute && sessionCookie) {
    try {
      const sessionUrl = new URL("/api/auth/get-session", req.url)

      const response = await fetch(sessionUrl.toString(), {
        headers: { cookie: req.headers.get("cookie") ?? "" },
      })
      const session = await response.json()

      if (session?.user) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    } catch {
      // Session invalide → laisser passer vers login
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}