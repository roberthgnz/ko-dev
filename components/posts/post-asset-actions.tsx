"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../icons"
import { deletePost } from "./post-actions"

export function PostAssetActions({ post_id }: { post_id: string }) {
  const pathname = usePathname()

  const [loading, setLoading] = useState(false)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const onDeletePost = async (post_id: string) => {
    setLoading(true)

    await deletePost(post_id, pathname)

    setLoading(false)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"}>
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/manage/posts/edit/${post_id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
            disabled={loading}
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove
              your publication from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => onDeletePost(post_id)}
              disabled={loading}
            >
              {loading && <Icons.spinner className="mr-2 animate-spin" />}
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
