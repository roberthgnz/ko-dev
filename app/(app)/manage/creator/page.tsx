import { VerifyForm } from "@/components/verify-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function CreatorPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, creators(complete)")
    .eq("id", user?.id)
    .single()

  return (
    <div className="space-y-6">
      <VerifyForm
        userId={user?.id}
        isCreator={profile.creator}
        isComplete={profile?.creators?.complete}
      />
    </div>
  )
}
