"use client"

import { useState } from "react"

import { Icons } from "../icons"
import { ShareButton } from "../share-button"
import { Button } from "../ui/button"
import { toggleFollow } from "./actions"

export const FollowActionForm = ({
  submiLabel = "Follow",
  following,
  follower_id,
  following_id,
}: any) => {
  const [loading, setLoading] = useState(false)

  const obSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    await toggleFollow({ following, follower_id, following_id })

    setLoading(false)
  }

  return (
    <form className="flex gap-1" onSubmit={obSubmit}>
      <Button size={"sm"} type="submit" disabled={loading}>
        {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {following ? "Unfollow" : submiLabel}
      </Button>
      <ShareButton />
    </form>
  )
}
