import { AccountBalance } from "@/components/account-balance"
import { SalesTransactionList } from "@/components/sales-transaction-list"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function BalancePage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("seller_id", user?.id)

  return (
    <div className="space-y-6">
      <AccountBalance transactions={transactions} />
      <SalesTransactionList userId={user?.id} />
    </div>
  )
}
