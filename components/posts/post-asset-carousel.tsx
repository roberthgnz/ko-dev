"use client"

import * as React from "react"

import "react-responsive-carousel/lib/styles/carousel.min.css"

// @ts-ignore
import { Carousel } from "react-responsive-carousel"

import { FeedAssetLockedPlaceholder } from "../profile/feed/feed-asset-locked-placeholder"
import { PostAssetPreview } from "./post-asset-preview"

type PostAssetCarouselProps = {
  post_id: string
  profile_id: string
  user_id: string
  assets: {
    type: "text" | "image" | "video" | "audio"
    url: string
  }[]
  options: {
    locked: boolean
    props: any
  }
}

const MAX_ASSET_WIDTH = 720
const MAX_ASSET_HEIGHT = 480

export const PostAssetCarousel = ({
  post_id,
  user_id,
  profile_id,
  assets,
  options,
}: PostAssetCarouselProps) => {
  if (assets.length && options?.locked) {
    return (
      <FeedAssetLockedPlaceholder
        post_id={post_id}
        user_id={user_id}
        profile_id={profile_id}
        {...options.props}
      />
    )
  }

  if (assets.length === 1) {
    return (
      <PostAssetPreview
        url={assets[0].url}
        type={assets[0].type}
        width={MAX_ASSET_WIDTH}
        height={MAX_ASSET_HEIGHT}
      />
    )
  }

  return (
    <Carousel showThumbs={false} showIndicators={false}>
      {assets.map((asset: any) => (
        <PostAssetPreview
          key={asset.url}
          url={asset.url}
          type={asset.type}
          width={MAX_ASSET_WIDTH}
          height={MAX_ASSET_HEIGHT}
        />
      ))}
    </Carousel>
  )
}
