import { localeFormatDistance } from "@/utils/date"
import { getVisibilityOptions } from "@/utils/post"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PostAssetActions } from "@/components/posts/post-asset-actions"
import { PostAssetCarousel } from "@/components/posts/post-asset-carousel"
import { ProfileAvatar } from "@/components/profile-avatar"

type Asset = {
  id: string
  type: "text" | "image" | "video" | "audio"
  asset_id: string
  format: string
  public_id: string
  original_width: number
  original_height: number
}

type FeedContainerProps = {
  id: string
  price: number
  visibility: "public" | "private"
  caption: string
  post_assets: Asset[]
  created_at: string
  profile: {
    full_name: string
    username: string
    avatar_url: string
  }
  profile_id: string
  user_id: string
  owner: boolean
  following: boolean
}

export const FeedContainer = ({
  id,
  price,
  visibility,
  owner,
  following,
  caption,
  post_assets,
  profile,
  user_id,
  profile_id,
  created_at,
}: FeedContainerProps) => {
  const assets = (post_assets || []).map((asset: any) => {
    return {
      type: asset.type,
      url: asset.asset_url,
    }
  })

  const options = getVisibilityOptions({ price, owner, following, visibility })

  return (
    <Card className="mx-1 rounded-none border-x-[0] border-y-[0] border-b bg-white shadow-none last:border-b-0">
      <CardHeader className="p-3 md:p-6">
        <div className="flex justify-between">
          <div className="flex items-start gap-2 md:items-center md:gap-4">
            <ProfileAvatar url={profile.avatar_url} size={48} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{profile.full_name}</span>
              <span className="text-sm text-gray-400">@{profile.username}</span>
            </div>
          </div>
          <div className="flex flex-col-reverse items-end gap-2 md:flex-row md:items-center">
            <span className="text-xs">{localeFormatDistance(created_at)}</span>
            {owner && <PostAssetActions post_id={id} />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-0">
        <div className="space-y-2 p-6 pt-0">{caption}</div>
        <PostAssetCarousel
          post_id={id}
          user_id={user_id}
          profile_id={profile_id}
          assets={assets}
          options={options}
        />
      </CardContent>
    </Card>
  )
}
