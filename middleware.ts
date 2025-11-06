import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Protected routes that require authentication
const protectedRoutes = ["/admin", "/donor", "/project-manager"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get("auth_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      const supabase = await createServerSupabaseClient()

      // If we have a refresh token, try to refresh the session
      if (refreshToken) {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        })

        if (error || !data.session) {
          // Refresh failed, redirect to login
          const response = NextResponse.redirect(new URL("/", request.url))
          response.cookies.delete("auth_token")
          response.cookies.delete("refresh_token")
          return response
        }

        // Token refreshed successfully, update cookies
        const response = NextResponse.next()
        response.cookies.set("auth_token", data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60, // 1 hour
        })

        if (data.session.refresh_token) {
          response.cookies.set("refresh_token", data.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          })
        }

        return response
      } else {
        // No refresh token, verify the current token is valid
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
          // Token is invalid, redirect to login
          const response = NextResponse.redirect(new URL("/", request.url))
          response.cookies.delete("auth_token")
          response.cookies.delete("refresh_token")
          return response
        }

        // Token is valid, allow access
        return NextResponse.next()
      }
    } catch (error) {
      console.error("Authentication error:", error)
      // If verification fails, redirect to login
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("auth_token")
      response.cookies.delete("refresh_token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/donor/:path*", "/project-manager/:path*"],
}
