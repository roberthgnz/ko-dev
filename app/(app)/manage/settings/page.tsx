import { createServerSupabaseClient } from "@/app/supabase-server"

import { PaymentForm } from "./payment-form"
import { ProfileForm } from "./profile-form"

export default async function SettingsProfilePage({
  searchParams,
}: {
  searchParams: {
    tab: string
  }
}) {
  const { tab } = searchParams

  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  const showProfile = !tab || tab === "profile"

  return (
    <>
      {showProfile && <ProfileForm email={user?.email} {...profile} />}

      {tab === "payment" && <PaymentForm email={user?.email} {...profile} />}
    </>
  )
}
