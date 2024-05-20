import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)

  try {
    const code = requestUrl.searchParams.get("code")
    const username = requestUrl.searchParams.get("username")

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      await supabase.auth.exchangeCodeForSession(code)
    }

    let url = `${requestUrl.origin}/onboarding`

    if (username) {
      url += `?username=${username}`
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(url)
  } catch (error: any) {
    return NextResponse.redirect(
      `${requestUrl.origin}/?error=${error.message}`,
      {
        status: 301,
      }
    )
  }
}
