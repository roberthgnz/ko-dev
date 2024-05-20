"use client"

import { useContext } from "react"

import { ProfileContext } from "@/app/(site)/[username]/profile-context"

import { FeedContainer } from "./feed-container"

export const FeedList = ({ posts }: { posts: any[] }) => {
  const { user, profile, owner, following } = useContext(ProfileContext)

  if (!posts.length)
    return (
      <div className="flex flex-col space-y-1.5 p-6">
        No posts yet
      </div>
    )

  return (
    <div className="space-y-4">
      {posts.map((post) => (
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
      ))}
    </div>
  )
}
