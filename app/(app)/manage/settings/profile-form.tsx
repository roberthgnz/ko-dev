"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// @ts-ignore
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { AvatarForm } from "@/components/avatar-form"
import { CoverForm } from "@/components/cover-form"
import { Icons } from "@/components/icons"

const profileFormSchema = z.object({
  full_name: z.string().max(30).min(2),
  username: z
    .string()
    .min(2, {
      message: "The username must be at least 4 characters long.",
    })
    .max(30, {
      message: "The username must be no longer than 30 characters.",
    }),
  bio: z.string().max(160).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

type SocialLink = {
  name: string
  placeholder: string
  type: string
  value: string
}

type ProfileFormProps = {
  id: string
  full_name: string
  avatar_url: string
  cover_url: string
  username: string
  email: string
  bio: string
  social_links: SocialLink[]
}

export function ProfileForm({
  id,
  full_name,
  avatar_url,
  cover_url,
  username,
  email,
  bio,
  social_links,
}: ProfileFormProps) {
  const supabase = createClientComponentClient()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name,
      username,
      bio: bio || "",
      // @ts-ignore
      social_links,
    },
    mode: "onChange",
  })

  const [coverUrl, setCoverUrl] = useState<string | null>(cover_url)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(avatar_url)

  const { fields } = useFieldArray({
    // @ts-ignore
    name: "social_links",
    control: form.control,
  })

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(social_links)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [loading, setLoading] = useState(false)

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setLoading(true)

      values = {
        ...values,
        social_links: socialLinks,
        updated_at: new Date().toISOString(),
      } as any

      if (values.username !== username) {
        // @ts-ignore
        values.updated_username_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from("profiles")
        .update(values)
        .eq("id", id)

      if (error) {
        setLoading(false)
        return toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      setLoading(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onAvatarUpload = async (path: string) => {
    setAvatarUrl(path)
    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar_url: path }),
    })
  }

  const onCoverUpload = async (path: string) => {
    setCoverUrl(path)
    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cover_url: path }),
    })
  }

  const onDeleteAccount = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      await response.json()
      return window.location.replace("/login")
    } catch (_) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is how others on the site will see you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <AvatarForm
              url={avatarUrl}
              onUpload={onAvatarUpload}
              buttonLabel="Upload profile picture"
            />
            <CoverForm
              url={coverUrl}
              onUpload={onCoverUpload}
              buttonLabel="Upload cover photo"
            />
            <FormField
              control={form.control}
              name="full_name"
              // @ts-ignore
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              // @ts-ignore
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your name for Public display. It can be your real
                    name or a pseudonym. You can only change this once every 30
                    days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input defaultValue={email} name="email" id="email" disabled />
              <FormDescription>
                You can manage verified email addresses in your email settings.
              </FormDescription>
            </div>
            <FormField
              control={form.control}
              name="bio"
              // @ts-ignore
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell your followers a little about yourself!"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              {/* @ts-ignore */}
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  // @ts-ignore
                  name={`social_links.${index}.value`}
                  // @ts-ignore
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {index === 0 ? "My links" : social_links[index].name}
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Add links to your website, blog or social media
                        profiles. profiles.
                      </FormDescription>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            const newValue = {
                              ...social_links[index],
                              value: e.target.value,
                            }
                            setSocialLinks((prev) => {
                              const copy = [...prev]
                              copy[index] = newValue
                              return copy
                            })
                          }}
                          data-value={JSON.stringify(field.value)}
                          value={field.value}
                          placeholder={social_links[index].placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button
              type="button"
              variant={"link"}
              disabled={loading}
              onClick={() => setShowDeleteDialog(true)}
            >
              {loading && <Icons.spinner className="mr-2 animate-spin" />}
              Delete account
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Icons.spinner className="mr-2 animate-spin" />}
              Update
            </Button>
          </CardFooter>
        </form>
      </Form>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => onDeleteAccount()}
              disabled={loading}
            >
              {loading && <Icons.spinner className="mr-2 animate-spin" />}
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
