"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../icons"

type UserNavProps = {
  username: string
  email: string
  avatar_url?: string
}

export function UserNav({ username, email, avatar_url }: UserNavProps) {
  const supabase = createClientComponentClient()

  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const downloadAsset = async (path: string) => {
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

    if (avatar_url) downloadAsset(avatar_url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar_url])

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl!} alt={username} />
            <AvatarFallback>
              {username?.slice(0, 1).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/manage"}>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/manage/settings?tab=profile"}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            onClick={signOut}
            variant={"ghost"}
            className="w-full"
            disabled={loading}
          >
            {loading && <Icons.spinner className="mr-2 animate-spin" />}
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
