import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/?error=Could not authenticate user`,
      {
        status: 301,
      }
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/?message=Check email to continue sign in process`,
    {
      status: 301,
    }
  )
}
