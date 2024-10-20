import { Separator } from "@/components/ui/separator"
import { PostCreationForm } from "@/components/posts/post-creation-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function CreatePostPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, payment")
    .eq("id", user!.id)
    .single()

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">New post</h2>
      </div>
      <Separator />
      <PostCreationForm {...profile!} />
    </div>
  )
}
