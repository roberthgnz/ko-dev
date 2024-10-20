"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { UploadIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Icons } from "./icons"
import { Button } from "./ui/button"

export function AvatarForm({
  buttonLabel = "Upload profile picture",
  url,
  size = 128,
  onUpload,
}: any) {
  const supabase = createClientComponentClient()

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

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

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full object-cover"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
          style={{ height: size, width: size }}
        />
      )}
      <Button
        variant={"outline"}
        className="cursor-pointer"
        asChild
        disabled={uploading}
      >
        <label htmlFor="single-avatar">
          {uploading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadIcon className="mr-2 h-4 w-4" />
          )}

          {uploading ? "Subiendo..." : buttonLabel}
        </label>
      </Button>
      <input
        style={{
          visibility: "hidden",
          position: "absolute",
        }}
        type="file"
        id="single-avatar"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  )
}
