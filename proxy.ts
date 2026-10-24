import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const authPaths = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"]

export async function proxy(req: NextRequest) {
  const { nextUrl }   = req
  const sessionCookie = getSessionCookie(req)

  const isOnAuthRoute      = authPaths.some((path) => nextUrl.pathname.startsWith(path))
  const isOnProtectedRoute = nextUrl.pathname.startsWith("/admin") && !isOnAuthRoute

  // Pas de cookie → redirection immédiate sans appel réseau
  if (isOnProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  // Cookie présent → vérifier la validité réelle de la session
  if (isOnProtectedRoute && sessionCookie) {
    try {
      const sessionUrl = new URL("/api/auth/get-session", req.url)

      const response = await fetch(sessionUrl.toString(), {
        headers: { cookie: req.headers.get("cookie") ?? "" },
        cache:   "no-store",
      })

      const session = await response.json()

      if (!session?.user) {
        const redirectResponse = NextResponse.redirect(new URL("/admin/login", req.url))
        redirectResponse.cookies.delete("better-auth.session_token")
        redirectResponse.cookies.delete("__Secure-better-auth.session_token")
        return redirectResponse
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  // Déjà connecté → rediriger vers le dashboard
  // Exception : /admin/reset-password reste accessible même connecté (ex: token reçu alors que l'utilisateur est connecté)
  if (isOnAuthRoute && sessionCookie && !nextUrl.pathname.startsWith("/admin/reset-password")) {
    try {
      const sessionUrl = new URL("/api/auth/get-session", req.url)

      const response = await fetch(sessionUrl.toString(), {
        headers: { cookie: req.headers.get("cookie") ?? "" },
        cache:   "no-store",
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