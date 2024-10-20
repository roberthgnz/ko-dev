import { LockIcon } from "lucide-react"

import { getVisibilityOptions } from "@/utils/post"
import { createServerSupabaseClient } from "@/app/supabase-server"

import { RecentPostsGallery } from "./recent-posts-gallery"

export const RecentPosts = async ({
  user_id,
  profile_id,
  authenticated,
  following,
}: {
  user_id: string
  profile_id: string
  authenticated: any
  following: any
}) => {
  const supabase = createServerSupabaseClient()

  const { data: posts } = await supabase
    .from("posts")
    .select("*,post_assets(*)")
    .eq("user_id", profile_id)
    .eq("post_assets.type", "image")
    .order("created_at", { ascending: false })
    .limit(6)

  const assets = (posts || []).map((post: any) => {
    const asset = post.post_assets[0]

    if (!asset) return

    const options = getVisibilityOptions({
      following,
      price: post.price,
      owner: post.user_id === user_id,
      visibility: post.visibility,
    })

    return {
      user_id,
      profile_id,
      post_id: post.id,
      url: asset.asset_url,
      type: asset.type,
      options,
    }
  })

  return authenticated ? (
    <RecentPostsGallery assets={assets.filter((asset) => asset)} />
  ) : (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          className="flex h-[110px] w-full items-center justify-center rounded bg-slate-50"
          key={`recent-post-${i}`}
        >
          <LockIcon className="h-8 w-8 text-gray-400" />
        </div>
      ))}
    </div>
  )
}
