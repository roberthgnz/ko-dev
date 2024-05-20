"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type PaymentFormProps = {
  id: string
  payment: string
}

export function PaymentForm({ id, payment }: PaymentFormProps) {
  const supabase = createClientComponentClient()

  const [email, setEmail] = useState(payment)

  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setLoading(true)

      const { error } = await supabase
        .from("profiles")
        .update({ payment: email, updated_at: new Date().toISOString() })
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
        title: "Updated payment method",
        description: "Your payment method has been successfully updated.",
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

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardContent>
          <CardHeader className="space-y-4 px-0">
            <CardTitle>
              <Icons.paypal className="h-6" />
            </CardTitle>
            <CardDescription>
              Add payment methods to receive payments from your followers.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              required
            />
            <p className="text-sm text-muted-foreground">
              Assign PayPal email to receive payments. Make sure
              that your PayPal account is set up to receive payments.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading && <Icons.spinner className="mr-2 animate-spin" />}
            Set payment method
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
