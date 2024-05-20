"use server"

import { revalidatePath } from "next/cache"

import { supabase } from "@/lib/supabase-admin"

export const deletePost = async (post_id: string, path: string) => {
  await supabase.from("posts").delete().eq("id", post_id)

  revalidatePath(path)
}
