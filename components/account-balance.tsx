import { DollarSign } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const AccountBalance = ({
  transactions,
}: {
  transactions: any[] | null
}) => {
  const getDetails = (units: any) => {
    const unit = units[0]
    const capture = unit.payments.captures[0]
    return capture
  }

  const getTotal = (transactions: any) => {
    const total = transactions.reduce((acc: any, transaction: any) => {
      const details = getDetails(transaction.purchase_units)
      return acc + parseFloat(details.amount.value)
    }, 0)

    const totalFee = transactions.reduce((acc: any, transaction: any) => {
      const details = getDetails(transaction.purchase_units)
      return (
        acc + parseFloat(details.seller_receivable_breakdown.paypal_fee.value)
      )
    }, 0)

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total - totalFee)
  }

  const balance = getTotal(transactions)

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-2">
        <CardTitle className="text-lg font-medium">Balance</CardTitle>
        <DollarSign className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-4xl font-bold tracking-tight">{balance}</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Balance available for withdrawal
        </p>
        <div className="mt-6 border-t pt-4 text-right">
          <p className="text-xs text-muted-foreground">
            * The minimum withdrawal amount is $100 USD.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
