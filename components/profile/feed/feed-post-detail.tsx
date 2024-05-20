"use client"

import { useContext } from "react"

import { ProfileContext } from "@/app/(site)/[username]/profile-context"

import { FeedContainer } from "./feed-container"

export const FeedPostDetail = ({ post }: { post: any }) => {
  const { user, profile, owner, following } = useContext(ProfileContext)

  return (
    <FeedContainer
      key={post.id}
      owner={owner}
      // @ts-ignore
      profile_id={profile?.id}
      following={following}
      profile={profile}
      {...post}
      // @ts-ignore
      user_id={user?.id}
    />
  )
}
