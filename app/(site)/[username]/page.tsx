import { Suspense } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileFeed } from "@/components/profile/profile-feed"
import { ProfileFeedSkeleton } from "@/components/profile/profile-feed-skeleton"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function ProfilePage({
  params,
}: {
  params: {
    username: string
  }
}) {
  const supabase = createServerSupabaseClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, posts(*, post_assets(*), transactions(*))")
    .order("created_at", { foreignTable: "posts", ascending: false })
    .eq("username", params.username)
    .single()

  const posts = (profile?.posts || []).map((post: any) => {
    return {
      ...post,
      visibility:
        post.transactions.length && post.transactions[0].status === "COMPLETED"
          ? "public"
          : post.visibility,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base uppercase">Posts</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Suspense fallback={<ProfileFeedSkeleton />}>
          <ProfileFeed posts={posts} />
        </Suspense>
      </CardContent>
    </Card>
  )
}
