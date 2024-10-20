import { redirect } from "next/navigation"

import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function SeeProfilePage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, posts(count)")
    .eq("id", user?.id)
    .single()

  if (!profile) {
    return redirect("/")
  }

  if (profile) {
    return redirect(`/${profile.username}`)
  }

  return <>Cargando...</>
}
