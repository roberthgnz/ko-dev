import { Suspense } from "react"
import Link from "next/link"
import { CircleDollarSign } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProfileHeader } from "@/components/profile/profile-header"
import { PurchasesTransactionList } from "@/components/purchases-transaction-list"
import { SalesTransactionList } from "@/components/sales-transaction-list"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function ManagePage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, posts(count)")
    .eq("id", user!.id)
    .single()

  const { data: followers } = await supabase
    .from("followers")
    .select("*")
    .eq("following_id", user!.id)

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Separator />
      <ProfileHeader
        owner={user && user?.id === profile.id}
        followers={followers?.length ?? 0}
        {...profile}
      />
      {!profile.payment && (
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
              <CircleDollarSign className="mr-2 size-4" />
              Connect a payment method
            </Link>
          </Button>
        </Alert>
      )}
      <div className="flex flex-col gap-4">
        <Suspense fallback={<div>Loading sales...</div>}>
          <SalesTransactionList userId={user!.id} />
        </Suspense>
        <Suspense fallback={<div>Loading purchases...</div>}>
          <PurchasesTransactionList userId={user!.id} />
        </Suspense>
      </div>
    </div>
  )
}
