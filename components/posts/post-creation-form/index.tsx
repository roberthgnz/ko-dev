"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ImageIcon, PaperPlaneIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { getFileType } from "@/utils/file"
import { useStorage } from "@/hooks/use-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { FilePreview } from "./file-preview"

export const PostCreationForm = ({
  username,
  payment,
}: {
  username: string
  payment: string | null
}) => {
  const router = useRouter()

  const storage = useStorage()

  const { toast } = useToast()

  const inputFileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)

  const [caption, setCaption] = useState("")
  const [price, setPrice] = useState("")
  const [_public, setPublic] = useState(false)

  const [files, setFiles] = useState<any[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    setFiles((prev) => [...prev, ...files])

    e.target.value = ""
  }

  const submitPost = async () => {
    setLoading(true)

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caption,
        price,
        public: _public,
      }),
    })

    const { data: post } = await response.json()

    await Promise.all(
      files.map((file) =>
        storage.uploadAsset({ file, post_id: post?.id!, username })
      )
    )

    toast({
      title: "Publication created",
      description: "Your publication has been successfully created.",
      variant: "success",
    })

    setFiles([])
    setPrice("")
    setPublic(false)
    setCaption("")
    setLoading(false)

    return router.push(`/${username}/posts/${post?.id}`)
  }

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file))
  }, [files])

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <Textarea
              value={caption}
              placeholder="Write a description..."
              className="h-32 resize-none"
              onChange={(e) => setCaption(e.target.value)}
              disabled={loading}
            />
            <div
              className={cn(
                "flex h-32 cursor-pointer items-center justify-center rounded-lg bg-gray-100",
                {
                  "cursor-not-allowed bg-gray-200": loading,
                }
              )}
              onClick={() => {
                if (loading) return
                inputFileRef.current?.click()
              }}
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Upload media file
              </div>
              <input
                ref={inputFileRef}
                type="file"
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={handleImageUpload}
              />
            </div>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <FilePreview
                    file={file}
                    type={getFileType(file)}
                    key={index}
                  />
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="price">
                Set price (US dollar)
              </Label>
              <Input
                id="price"
                type="number"
                step={0.01}
                min={5}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                disabled={loading || !payment}
              />
              {payment ? (
                <p className="text-[0.8rem] text-muted-foreground">
                  You can set a price for your publication. If you do not
                  set a price, your post will be visible to your followers.
                  followers.
                </p>
              ) : (
                <p className="rounded-md border border-destructive p-4 text-[0.8rem]">
                  Payments go directly to you, so you will need to connect a payment method to receive them.
                  a payment method to receive them. Go to{" "}
                  <Link
                    href={"/manage/settings?tab=payment"}
                    className="text-primary"
                  >
                    Payment settings
                  </Link>{" "}
                  to connect to PayPal.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  checked={_public}
                  onCheckedChange={setPublic}
                />
                <Label htmlFor="airplane-mode">Public display</Label>
              </div>
              <p className="text-[0.8rem] text-muted-foreground">
                If you activate this option, your post will be visible to all visitors to your profile.
              </p>
            </div>
            {storage.uploading && (
              <div className="mt-8 space-y-2">
                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Uploading files, please wait...
                </div>
                <Progress value={storage.progress} />
              </div>
            )}
            <div className="mt-8 flex justify-end">
              <Button size={"lg"} onClick={submitPost} disabled={loading}>
                {loading ? "Publishing" : "Publish"}
                {loading ? (
                  <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <PaperPlaneIcon className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
