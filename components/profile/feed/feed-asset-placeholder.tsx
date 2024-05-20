import { ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export const FeedAssetPlaceholder = ({ variant }: any) => {
  return (
    <div
      className={cn(
        "flex h-96 w-full animate-pulse items-center justify-center rounded-md bg-gray-200",
        {
          "h-28": variant === "thumbnail",
        }
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <ImageIcon
          className={cn("h-16 w-16 text-gray-400", {
            "h-8 w-8": variant === "thumbnail",
          })}
        />
      </div>
    </div>
  )
}
