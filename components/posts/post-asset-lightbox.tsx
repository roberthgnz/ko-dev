"use client"

import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Zoom from "yet-another-react-lightbox/plugins/zoom"

import "yet-another-react-lightbox/styles.css"

import { useEffect, useState } from "react"

import { downloadAsset } from "@/lib/storage"
import { cn } from "@/lib/utils"

import { FeedAssetPlaceholder } from "../profile/feed/feed-asset-placeholder"

type PostAssetLightboxProps = {
  src: string
  width: number
  height: number
  variant?: string
  rounded?: boolean
}

export const PostAssetLightbox = ({
  src,
  width,
  height,
  variant,
  rounded,
}: PostAssetLightboxProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState(src)

  useEffect(() => {
    if (!src) return
    ;(async () => {
      setLoading(true)
      const _url = await downloadAsset(src)
      _url && setUrl(_url)
      setLoading(false)
    })()
  }, [src])

  return loading ? (
    <FeedAssetPlaceholder variant={variant} />
  ) : (
    <>
      <div
        className="relative flex cursor-pointer items-center justify-center"
        style={{
          minHeight: 112,
          overflow: "hidden",
          textAlign: "center",
        }}
        onClick={() => setOpen(true)}
      >
        <div
          className={cn(
            "relative flex h-full items-center overflow-hidden bg-black",
            {
              "rounded-md": rounded,
            }
          )}
        >
          <Image
            src={url}
            alt={"Image"}
            className="aboslute inset-0 inline-flex h-full w-full object-contain"
            width={width}
            height={height}
            unoptimized
          />
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Zoom, Captions]}
        slides={[{ src: url }]}
        carousel={{ finite: true }}
        render={{
          iconPrev: () => null,
          iconNext: () => null,
        }}
      />
    </>
  )
}
