import { memo } from "react"
import Image from "next/image"

export const FilePreview = memo(
  ({ file, type }: { file: File; type: string }) => {
    if (type === "image")
      return (
        <div className="relative flex h-32 w-32 items-center justify-center rounded-lg bg-gray-100">
          <Image
            src={URL.createObjectURL(file)}
            className="h-32 w-32 rounded-lg object-cover"
            alt="Post image"
            fill
          />
        </div>
      )

    if (type === "video")
      return (
        <div className="relative flex h-32 w-32 items-center justify-center rounded-lg bg-gray-100">
          <video
            className="h-32 w-32 rounded-lg object-cover"
            src={URL.createObjectURL(file)}
            controls
          />
        </div>
      )

    return null
  }
)

FilePreview.displayName = "FilePreview"
