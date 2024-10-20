import { NextResponse, userAgent, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { device } = userAgent(req)
  res.headers.set("x-is-mobile", device.type === "mobile" ? "true" : "false")

  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl).href, {
      headers: res.headers,
    })
  }

  return res
}

export const config = { matcher: ["/manage/:path*"] }
