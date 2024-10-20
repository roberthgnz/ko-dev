"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { UploadIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Icons } from "./icons"
import { Button } from "./ui/button"

const width = 1920
const height = 180

export function CoverForm({
  buttonLabel = "Upload cover photo",
  url,
  onUpload,
}: any) {
  const supabase = createClientComponentClient()

  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

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

  async function uploadCover(event: React.ChangeEvent<HTMLInputElement>) {
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
        .from("covers")
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
      {coverUrl ? (
        <div
          className="relative aspect-video w-full"
          style={{ maxHeight: height, maxWidth: width }}
        >
          <Image
            src={coverUrl}
            alt="Cover"
            className="w-full rounded-md object-cover"
            fill
          />
        </div>
      ) : (
        <div
          className="flex aspect-video w-full items-center justify-center rounded-md bg-gray-200 dark:bg-gray-800"
          style={{ maxHeight: height, maxWidth: width }}
        />
      )}
      <Button
        variant={"outline"}
        className="cursor-pointer"
        asChild
        disabled={uploading}
      >
        <label htmlFor="single-cover">
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
        id="single-cover"
        accept="image/*"
        onChange={uploadCover}
        disabled={uploading}
      />
    </div>
  )
}
