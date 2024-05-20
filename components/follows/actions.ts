"use server"

import { revalidatePath } from "next/cache"

import { supabase } from "@/lib/supabase-admin"

type Props = {
  following: boolean
  follower_id: string
  following_id: string
}

export const toggleFollow = async ({
  following,
  follower_id,
  following_id,
}: Props) => {
  if (following) {
    revalidatePath(`/${following_id}`)
    return supabase
      .from("followers")
      .delete()
      .match({ follower_id, following_id })
  }

  await supabase.from("followers").insert({ follower_id, following_id })

  revalidatePath(`/${following_id}`)
}
