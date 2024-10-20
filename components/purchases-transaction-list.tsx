import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createServerSupabaseClient } from "@/app/supabase-server"

export const PurchasesTransactionList = async ({ userId }: any) => {
  const supabase = createServerSupabaseClient()

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("buyer_id", userId)

  if (transactions && transactions.length === 0) {
    return (
      <div>
        <h3 className="text-base font-semibold tracking-tight">
          My recent purchases
        </h3>
        <p className="text-sm text-muted-foreground">
          No transactions yet
        </p>
      </div>
    )
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">My recent purchases</CardTitle>
        <CardDescription>
          Estas son tus compras recientes en el sitio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cantidad</TableHead>
              <TableHead>Comisión (PayPal)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(transactions || []).map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {getDetails(transaction.purchase_units).amount.value}
                  <span className="ml-2 text-slate-500">
                    {
                      getDetails(transaction.purchase_units).amount
                        .currency_code
                    }
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  {
                    getDetails(transaction.purchase_units)
                      .seller_receivable_breakdown.paypal_fee.value
                  }
                  <span className="ml-2 text-slate-500">
                    {
                      getDetails(transaction.purchase_units)
                        .seller_receivable_breakdown.paypal_fee.currency_code
                    }
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.status}</Badge>
                </TableCell>
                <TableCell>
                  {format(
                    new Date(
                      getDetails(transaction.purchase_units).create_time
                    ),
                    "PPP",
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {getTotal(transactions || [])} USD
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
