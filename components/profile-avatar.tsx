"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type ProfileAvatarProps = {
  url: string
  size?: number
}

export function ProfileAvatar({ url, size = 64 }: ProfileAvatarProps) {
  const supabase = createClientComponentClient()

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (url) downloadAsset(url)
  }, [url])

  async function downloadAsset(path: string) {
    try {
      if (path.startsWith("http")) {
        setAvatarUrl(path)
        return path
      }

      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error: any) {
      console.log("Error downloading image: ", error.message)
    }
  }

  return avatarUrl ? (
    <Image
      width={size}
      height={size}
      src={avatarUrl}
      alt="Avatar"
      className="rounded-full bg-gray-200 object-cover dark:bg-gray-800"
      style={{ height: size, width: size }}
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
      style={{ height: size, width: size }}
    />
  )
}
