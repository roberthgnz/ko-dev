"use client"

import { useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { Icons } from "@/components/icons"

export const PostEditionForm = ({ ...defaultState }: any) => {
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(false)

  const [caption, setCaption] = useState(defaultState.caption || "")
  const [price, setPrice] = useState(defaultState.price || "")
  const [_public, setPublic] = useState(false)

  const submitPost = async () => {
    setLoading(true)

    await supabase
      .from("posts")
      .update({
        caption,
        price: price ? parseFloat(price) : null,
        visibility: _public ? "public" : "private",
        updated_at: new Date().toISOString(),
      })
      .eq("id", defaultState.id)

    toast({
      title: "Publication updated",
      description: "Your publication has been successfully updated.",
      variant: "success",
    })

    setLoading(false)
  }

  return (
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
          <div className="space-y-2">
            <Label htmlFor="price">Set price (US dollar)</Label>
            <Input
              id="price"
              type="number"
              step={0.01}
              min={5}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              disabled={loading || !defaultState.payment}
            />
            {defaultState.payment ? (
              <p className="text-[0.8rem] text-muted-foreground">
                Puedes establecer un precio para tu publicación. Si no
                estableces un precio, tu publicación será visible para tus
                followers.
              </p>
            ) : (
              <p className="rounded-md border border-destructive p-4 text-[0.8rem]">
                Payments go directly to you, so you will need to connect a
                payment method to receive them. a payment method to receive
                them. Go to{" "}
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
              If you activate this option, your post will be visible to all
              visitors to your profile.
            </p>
          </div>
          <div className="mt-8 flex justify-end">
            <Button size={"lg"} onClick={submitPost} disabled={loading}>
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
