import Link from "next/link"
import { UserPlus } from "lucide-react"

import { FollowActionForm } from "../follows/follow-action-form"
import { ProfileAvatar } from "../profile-avatar"
import { ProfileCover } from "../profile-cover"
import { ShareButton } from "../share-button"
import { Button } from "../ui/button"

type ProfileHeaderProps = {
  owner: boolean
  cover_url: string
  avatar_url: string
  full_name: string
  username: string
  [key: string]: any
}

const followCountRules = new Intl.PluralRules("en-EN")

const getFollowsLabel = (count: number) => {
  const rule = followCountRules.select(count)
  switch (rule) {
    case "one":
      return "follower"
    case "other":
      return "followers"
    default:
      return "followers"
  }
}

const getPostsLabel = (count: number) => {
  const rule = followCountRules.select(count)
  switch (rule) {
    case "one":
      return "post"
    case "other":
      return "posts"
    default:
      return "posts"
  }
}

export const ProfileHeader = ({
  owner,
  following,
  user_id, // Authenticated user
  profile_id, // Profile owner
  cover_url,
  avatar_url,
  full_name,
  username,
  followers,
  posts,
}: ProfileHeaderProps) => {
  return (
    <div className="text-card-foreground">
      <div className="-mt-8">
        <ProfileCover url={cover_url} />
        <div className="relative left-0 min-h-[98px] min-w-[98px] -translate-y-1/2 md:left-2">
          <ProfileAvatar url={avatar_url} size={98} />
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{full_name}</span>
            <span className="text-sm text-gray-400">@{username}</span>
          </div>
          <div className="flex gap-8">
            <div className="text-xs md:text-base">
              <span className="font-bold">{posts[0].count}</span>{" "}
              {getPostsLabel(posts[0].count)}
            </div>
            <div className="text-xs md:text-base">
              <span className="font-bold">{followers}</span>{" "}
              {getFollowsLabel(followers)}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {owner && (
            <>
              <Button variant={"outline"} size={"sm"} asChild>
                <Link href="/manage/settings?tab=profile">Edit profile</Link>
              </Button>
              <Button variant={"outline"} size={"sm"} asChild>
                <Link href="/manage/settings?tab=payment">
                  Payment settings
                </Link>
              </Button>
            </>
          )}
          {!owner && user_id && (
            <FollowActionForm
              following={following}
              follower_id={user_id}
              following_id={profile_id}
            />
          )}

          {!owner && !user_id && (
            <div className="flex gap-1">
              <Button size={"sm"} asChild>
                <Link href={"/login"}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Follow
                </Link>
              </Button>
              <ShareButton />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
