import { createClient } from "@supabase/supabase-js"

import { getFileType } from "@/utils/file"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const downloadAsset = async (path: string) => {
  try {
    const { data, error } = await supabase.storage.from("assets").download(path)
    if (error) {
      throw error
    }
    return URL.createObjectURL(data)
  } catch (error: any) {
    console.log("Error downloading image: ", error.message)
    return null
  }
}

export const uploadAsset = async ({
  file,
  post_id,
}: {
  file: File
  post_id: string
}) => {
  try {
    // https://supabase.com/docs/guides/storage/uploads/resumable-uploads
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    await supabase.storage.from("assets").upload(filePath, file)

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
  }
}
