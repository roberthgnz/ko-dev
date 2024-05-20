"use client"

import { usePathname } from "next/navigation"
import { Share } from "lucide-react"

import { Button } from "./ui/button"

export const ShareButton = () => {
  const pathname = usePathname()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Ko-dev",
        url: pathname,
      })
    }
  }

  return (
    <Button
      type="button"
      size={"sm"}
      variant={"secondary"}
      className="w-fit"
      onClick={handleShare}
    >
      <Share className="mr-2 h-4 w-4" />
      Share
    </Button>
  )
}
