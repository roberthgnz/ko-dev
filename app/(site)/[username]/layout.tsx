import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PlusIcon } from "@radix-ui/react-icons"
import { CircleDollarSign } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { RecentPosts } from "@/components/posts/recent-posts"
import { RecentPostsSkeleton } from "@/components/posts/recent-posts-skeleton"
import { ProfileBio } from "@/components/profile/profile-bio"
import { ProfileHeader } from "@/components/profile/profile-header"
import { createServerSupabaseClient } from "@/app/supabase-server"

import { ProfileContextProvider } from "./profile-context"

type Props = {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: profile } = await createServerSupabaseClient()
    .from("profiles")
    .select("full_name, username")
    .eq("username", params.username)
    .single()

  return {
    title: `Ko-dev - ${profile?.full_name || profile?.username}`,
  }
}

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    username: string
  }
}) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, posts(count)")
    .eq("username", params.username)
    .single()

  if (!profile) {
    return redirect("/")
  }

  const { data: followers } = await supabase
    .from("followers")
    .select("*")
    .eq("following_id", profile.id)

  const following = followers?.some(
    (follower: any) => follower.follower_id === user?.id
  )

  const owner = Boolean(user) && user!.id === profile.id

  return (
    <div className="container my-8 space-y-16">
      <ProfileHeader
        owner={owner}
        following={following}
        user_id={user?.id}
        profile_id={profile.id}
        followers={followers?.length ?? 0}
        {...profile}
      />
      {owner && !profile.payment && (
        <Alert className="mx-auto space-y-4">
          <AlertTitle className="text-xl font-bold">
            💡 Connect payment method
          </AlertTitle>
          <AlertDescription>
            The payments go directly to you, so you will need to connect a
            payment method to receive them. Go to{" "}
            <Link
              href={"/manage/settings?tab=payment"}
              className="text-primary"
            >
              Payment settings
            </Link>{" "}
            to connect to PayPal.
          </AlertDescription>
          <Button asChild>
            <Link
              href="/manage/settings?tab=payment"
              className="flex items-center"
            >
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Connect a payment method
            </Link>
          </Button>
        </Alert>
      )}
      <div className="grid gap-4 md:grid-cols-[25%_auto_25%]">
        <div className="flex flex-col gap-4">
          {owner && (
            <Button asChild>
              <Link href={"/manage/posts/create"}>
                <PlusIcon className="mr-2 h-4 w-4" />
                New post
              </Link>
            </Button>
          )}
          {profile.bio && (
            <ProfileBio bio={profile.bio} social_links={profile.social_links} />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <ProfileContextProvider
            {...{
              username: params.username,
              profile,
              user,
              owner,
              following: following ?? false,
              followers: followers ?? [],
              posts: [],
            }}
          >
            {children}
          </ProfileContextProvider>
          {!user && (
            <Card className="col-start-2 border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">
                  ¡Únete a la comunidad!
                </CardTitle>
                <CardDescription>
                  Gana dinero haciendo lo que amas.
                </CardDescription>
                <CardContent className="pb-0 pt-6">
                  <div className="space-y-8">
                    <Icons.community className="h-32 w-full" />
                    <Button size={"lg"} asChild>
                      <Link href={"/login"}>Unirme ahora</Link>
                    </Button>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          )}
        </div>
        <Card className="h-fit w-full md:sticky md:top-4">
          <CardHeader>
            <CardTitle className="text-base uppercase">
              Latest publications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<RecentPostsSkeleton />}>
              <RecentPosts
                profile_id={profile.id}
                user_id={user?.id!}
                authenticated={!!user}
                following={following}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
