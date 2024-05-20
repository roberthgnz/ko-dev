import Link from "next/link"
import { BadgeDollarSign, HomeIcon, PlusIcon, SearchIcon } from "lucide-react"

import { ProfileAvatar } from "./profile-avatar"

export const MobileBottomNav = ({ username, avatar_url }: any) => {
  return (
    <div className="fixed bottom-0 left-0 w-full border-t bg-white">
      <div className="flex items-center justify-between gap-8 px-4 py-2">
        <Link href={"/"} className="p-2">
          <HomeIcon className="h-6 w-6" />
        </Link>
        <Link href={"/search"} className="p-2">
          <SearchIcon className="h-6 w-6" />
        </Link>
        <Link href={"/manage/posts/create"} className="p-2">
          <PlusIcon className="h-6 w-6" />
        </Link>
        <Link href={"/manage"} className="p-2">
          <BadgeDollarSign className="h-6 w-6" />
        </Link>
        <Link href={`/${username}`} className="p-2">
          <ProfileAvatar url={avatar_url} size={24} />
        </Link>
      </div>
    </div>
  )
}
