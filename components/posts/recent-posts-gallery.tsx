import { FeedAssetLockedPlaceholder } from "../profile/feed/feed-asset-locked-placeholder"
import { PostAssetPreview } from "./post-asset-preview"

const renderAsset = ({
  url,
  type,
  options,
  post_id,
  user_id,
  profile_id,
}: any) => {
  if (options?.locked) {
    return (
      <FeedAssetLockedPlaceholder
        key={post_id}
        post_id={post_id}
        user_id={user_id}
        profile_id={profile_id}
        variant={"thumbnail"}
        {...options.props}
      />
    )
  }

  return (
    <PostAssetPreview
      url={url}
      type={type}
      width={100}
      height={112}
      variant={"thumbnail"}
      rounded
    />
  )
}

export const RecentPostsGallery = ({ assets }: any) => {
  return <div className="grid grid-cols-3 gap-2">{assets.map(renderAsset)}</div>
}
