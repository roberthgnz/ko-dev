import { redirect } from "next/navigation"

import { createServerSupabaseClient } from "@/app/supabase-server"

import OnboardingForm from "./onboarding-form"

export default async function OnboardingPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!data.onboarding) {
      return redirect("/manage")
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, posts(count)")
    .eq("id", user!.id)
    .single()

  return <OnboardingForm {...profile} />
}
