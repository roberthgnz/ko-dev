"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Upload } from "tus-js-client"

import { getFileType } from "@/utils/file"

const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!

export const useStorage = () => {
  const supabase = createClientComponentClient()

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (
    bucketName: string,
    fileName: string,
    file: File
  ) => {
    const { data } = await supabase.auth.getSession()

    setProgress(0)

    return new Promise((resolve, reject) => {
      // @ts-ignore
      const upload = new Upload(file, {
        endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${data.session!.access_token}`,
          "x-upsert": "true", // optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
        metadata: {
          bucketName: bucketName,
          objectName: fileName,
          contentType: file.type,
          cacheControl: "3600",
        },
        chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
        onError: (error) => {
          console.log("Failed because: " + error)
          reject(error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
          setProgress(Number(percentage))
        },
        onSuccess: () => resolve(upload),
      })

      // Check if there are any previous uploads to continue.
      return upload.findPreviousUploads().then((previousUploads: any) => {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }

        // Start the upload
        upload.start()
      })
    })
  }

  const downloadAsset = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("assets")
        .download(path)
      if (error) {
        throw error
      }
      return URL.createObjectURL(data)
    } catch (error: any) {
      console.log("Error downloading image: ", error.message)
      return null
    }
  }

  const uploadAsset = async ({
    file,
    post_id,
    username,
  }: {
    file: File
    post_id: string
    username?: string
  }) => {
    try {
      setUploading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      const fileExt = file.name.split(".").pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${username || user!.id}/${fileName}`

      await uploadFile("assets", filePath, file)

      const { data } = await supabase.from("post_assets").insert({
        post_id,
        type: getFileType(file),
        format: fileExt,
        asset_url: filePath,
      })

      return data
    } catch (error: any) {
      console.error(error.message)

      return null
    } finally {
      setUploading(false)
    }
  }

  return {
    uploadAsset,
    downloadAsset,
    uploading,
    progress,
  }
}
