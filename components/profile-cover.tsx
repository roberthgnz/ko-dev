"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const width = 1920
const height = 180

export function ProfileCover({ url }: any) {
  const supabase = createClientComponentClient()

  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  useEffect(() => {
    if (url) downloadAsset(url)
  }, [url])

  async function downloadAsset(path: string) {
    try {
      if (path.startsWith("http")) {
        setCoverUrl(path)
        return path
      }

      const { data, error } = await supabase.storage
        .from("covers")
        .download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setCoverUrl(url)
    } catch (error: any) {
      console.log("Error downloading image: ", error.message)
    }
  }

  return coverUrl ? (
    <Image
      width={width}
      height={height}
      src={coverUrl}
      alt="Cover"
      className="w-screen -translate-x-8 rounded-b-md object-cover md:w-full md:translate-x-0"
      style={{ maxHeight: height, maxWidth: width }}
    />
  ) : (
    <div
      className="sig-zag-pattern flex aspect-video h-full w-screen -translate-x-8 items-center justify-center rounded-b-md bg-gray-200 dark:bg-gray-800 md:w-full md:translate-x-0"
      style={{ maxHeight: height, maxWidth: width }}
    />
  )
}
