import { Separator } from "@/components/ui/separator"
import { PostEditionForm } from "@/components/posts/post-edition-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function EditPostPage({ params }: any) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("payment, payment_method")
    .eq("id", user!.id)
    .single()

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user!.id)
    .eq("id", params.id)
    .single()

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Edit post</h2>
      </div>
      <Separator />
      <PostEditionForm {...profile!} {...post!} />
    </div>
  )
}
