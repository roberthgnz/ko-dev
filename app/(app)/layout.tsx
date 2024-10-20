import "@/app/globals.css"

import Link from "next/link"
import { Analytics } from "@vercel/analytics/react"
import { PlusSquare } from "lucide-react"
import { Toaster } from "sonner"

import { getIsMobile } from "@/utils/is-mobile"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { createServerSupabaseClient } from "@/app/supabase-server"

export const metadata = {
  title: "Ko-dev",
  description: "All you need to make money doing what you love",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = getIsMobile()
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  return (
    <html lang="en">
      <body
        style={{
          // @ts-ignore
          "--bottom-nav-height": user && isMobile ? "55.95px" : "0px",
        }}
      >
        <div className="border-b">
          <div className="container mx-auto flex h-16 items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              <Link href={"/"} className="flex items-center">
                <span>Ko-dev</span>
              </Link>
            </h1>
            <div className="ml-auto flex items-center space-x-4">
              <Link
                href={"/manage/posts/create"}
                className="flex cursor-pointer items-center space-x-2 rounded-md px-4 py-2 text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
              >
                <PlusSquare className="size-4" />
                <span className="ml-2 hidden md:block">New post</span>
              </Link>
              <UserNav email={user!.email} {...profile} />
            </div>
          </div>
        </div>
        <main className="container mx-auto my-8 mb-[calc(2rem_+_var(--bottom-nav-height))]">
          {children}
        </main>
        {user && isMobile && <MobileBottomNav user={user} {...profile} />}
        <Toaster richColors />
        <Analytics />
      </body>
    </html>
  )
}
