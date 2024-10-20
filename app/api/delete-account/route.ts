import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { supabase as supabaseAdmin } from "@/lib/supabase-admin"

const deleteProfile = async (supabase: any, user: any) => {
  const { error } = await supabase.from("profiles").delete().eq("id", user.id)
  if (error) {
    throw new Error(error.message)
  }
}

const deleteAccount = async (supabase: any, user: any) => {
  const { error } = await supabase.auth.admin.deleteUser(user.id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 404 })
    }

    await deleteProfile(supabaseAdmin, user)
    await deleteAccount(supabaseAdmin, user)

    return NextResponse.json({ success: true, error: null })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
