import "@/app/globals.css"

import { Nunito } from "next/font/google"
import Link from "next/link"
import { Analytics } from "@vercel/analytics/react"
import { PlusSquare } from "lucide-react"

import { getIsMobile } from "@/utils/is-mobile"
import { UserNav } from "@/components/dashboard/user-nav"
import { GuestNav } from "@/components/guest-nav"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { createServerSupabaseClient } from "@/app/supabase-server"

const nunito = Nunito({ subsets: ["latin"] })

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
        className={`h-screen ${nunito.className}`}
        style={{
          // @ts-ignore
          "--bottom-nav-height": user && isMobile ? "55.95px" : "0px",
        }}
      >
        <header className="border-b">
          <nav className="container mx-auto flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              <Link href={"/"} className="flex items-center">
                <span>Ko-dev</span>
              </Link>
            </h1>
            {!user ? (
              <GuestNav />
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href={"/manage/posts/create"}
                  className="flex cursor-pointer items-center space-x-2 rounded-md px-4 py-2 text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
                >
                  <PlusSquare className="h-4 w-4" />
                  <span className="ml-2 hidden md:block">
                    New post
                  </span>
                </Link>
                <UserNav email={user.email} {...profile} />
              </div>
            )}
          </nav>
        </header>
        <main className="flex h-[calc(100vh_-_130px)] w-full flex-1 flex-col items-center justify-center">
          {children}
        </main>
        <footer className="border-t">
          <div className="container mx-auto flex h-16 items-center justify-between">
            <p>© 2023-2024 Ko-dev, Inc. All rights reserved.</p>
            <p>Created by <Link href={'https://x.com/roberthgnz'} target="_blank">Roberth González</Link></p>
          </div>
        </footer>
        {user && isMobile && <MobileBottomNav user={user} {...profile} />}
        <Analytics />
      </body>
    </html>
  )
}
