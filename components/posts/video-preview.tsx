"use client"

import { useEffect, useState } from "react"

import { downloadAsset } from "@/lib/storage"

type VideoPreviewProps = {
  src: string
  width?: number
  height?: number
}

export const VideoPreview = ({ src, width, height }: VideoPreviewProps) => {
  const [url, setUrl] = useState(src)

  useEffect(() => {
    if (!src) return
    ;(async () => {
      const _url = await downloadAsset(src)
      _url && setUrl(_url)
    })()
  }, [src])

  return (
    <video
      src={url}
      controls
      className={"w-full object-contain"}
      controlsList="nodownload"
      width={width}
      height={height}
    />
  )
}
