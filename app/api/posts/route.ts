import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const body = await request.json()

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 })
  }

  const { error, data } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      price: body.price || 0,
      caption: body.caption,
      visibility: body.public ? "public" : "private",
    })
    .select(`*`)
    .single()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ data })
}
