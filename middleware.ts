// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const authPath = "/admin/login"

export async function middleware(req: NextRequest) {  // ← "proxy" → "middleware"
  const { nextUrl } = req
  const sessionCookie = getSessionCookie(req)

  const isOnAuthRoute      = nextUrl.pathname.startsWith(authPath)
  const isOnProtectedRoute = nextUrl.pathname.startsWith("/admin") && !isOnAuthRoute

  if (isOnProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL(authPath, req.url))
  }

  if (isOnProtectedRoute && sessionCookie) {
    try {
      const response = await fetch(new URL("/api/auth/get-session", req.url), {
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

  if (isOnAuthRoute && sessionCookie) {
    try {
      const response = await fetch(new URL("/api/auth/get-session", req.url), {
        headers: { cookie: req.headers.get("cookie") ?? "" },
      })
      const session = await response.json()

      if (session?.user) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    } catch {}
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}