import { cn } from "@/lib/utils"

import { PostAssetLightbox } from "./post-asset-lightbox"
import { VideoPreview } from "./video-preview"

type PostAssetPreviewProps = {
  type: string
  url: string
  width?: number
  height?: number
  rounded?: boolean
  variant?: string
}

const MAX_ASSET_WIDTH = 720
const MAX_ASSET_HEIGHT = 480

export const PostAssetPreview = ({
  type,
  url,
  width = MAX_ASSET_WIDTH,
  height = MAX_ASSET_HEIGHT,
  rounded,
  variant,
}: PostAssetPreviewProps) => {
  if (type === "image") {
    return (
      <PostAssetLightbox
        src={url}
        width={width}
        height={height}
        variant={variant}
        rounded
      />
    )
  }

  if (type === "video") {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{
          minHeight: 112,
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          className={cn(
            "relative flex h-full items-center overflow-hidden bg-black",
            {
              "rounded-md": rounded,
            }
          )}
        >
          <VideoPreview
            src={url}
            width={MAX_ASSET_WIDTH}
            height={MAX_ASSET_HEIGHT}
          />
        </div>
      </div>
    )
  }

  return null
}
