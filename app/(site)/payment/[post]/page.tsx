import { UnlockAssetForm } from "@/components/profile/feed/unlock-asset-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function PaymentPage({
  params,
}: {
  params: {
    post: string
  }
}) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id)
    .single()

  return (
    <div className="container mx-auto my-8 space-y-4 text-center">
      <h1 className="text-2xl font-bold">Confirm payment</h1>
      <p className="text-gray-500">
        Select preferred payment method to unlock content
      </p>
      <UnlockAssetForm post_id={params.post} username={profile?.username} />
    </div>
  )
}
