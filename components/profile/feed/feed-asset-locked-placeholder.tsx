import Link from "next/link"
import { LockIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FollowActionForm } from "@/components/follows/follow-action-form"

const getActionButton = ({
  price,
  post_id,
  must_follow,
  user_id,
  profile_id,
}: any) => {
  if (Boolean(price)) {
    return (
      <>
        <Button size={"sm"} asChild>
          <Link href={`/payment/${post_id}`}>Unblock by ${price}</Link>
        </Button>
        {!user_id && (
          <span className="text-sm text-gray-500">
            You need to log in to unlock
          </span>
        )}
      </>
    )
  }

  if (must_follow && !user_id) {
    return (
      <>
        <Button size={"sm"} asChild>
          <Link href={"/login"}>Continue to see</Link>
        </Button>
        <span className="text-sm text-gray-500">
          You need to log in to unlock
        </span>
      </>
    )
  }

  if (must_follow) {
    return (
      <FollowActionForm
        submiLabel="Continue to see"
        following={false}
        follower_id={user_id}
        following_id={profile_id}
      />
    )
  }
}

export const FeedAssetLockedPlaceholder = ({ variant, ...props }: any) => {
  return (
    <div
      className={cn(
        "flex h-96 w-full items-center justify-center rounded-md bg-gray-200",
        {
          "h-28": variant === "thumbnail",
        }
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <LockIcon
          className={cn("h-16 w-16 text-gray-400", {
            "h-8 w-8": variant === "thumbnail",
          })}
        />
        {variant !== "thumbnail" && getActionButton(props)}
      </div>
    </div>
  )
}
