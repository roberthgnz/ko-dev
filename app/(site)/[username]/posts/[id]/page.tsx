import { Card, CardContent } from "@/components/ui/card"
import { FeedPostDetail } from "@/components/profile/feed/feed-post-detail"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function PostPage({
  params,
}: {
  params: {
    id: string
    username: string
  }
}) {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("posts")
    .select("*, profiles(username), post_assets(*), transactions(*)")
    .eq("id", params.id)
    .single()

  if (!data || data.profiles.username !== params.username) {
    return <div className="text-center">Post not found</div>
  }

  const post = {
    ...data,
    visibility:
      data.transactions.length && data.transactions[0].status === "COMPLETED"
        ? "public"
        : data.visibility,
  }

  return (
    <Card>
      <CardContent className="px-0">
        <FeedPostDetail post={post} />
      </CardContent>
    </Card>
  )
}
