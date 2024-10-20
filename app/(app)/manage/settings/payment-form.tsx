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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { Icons } from "@/components/icons"

type PaymentFormProps = {
  id: string
  payment: string
}

const banks = [
  // Colombia
  "Banco Davivienda",
  "Bancolombia",
  "Nequi",
  "BBVA Colombia",
  "Colpatria",
  "Banco de Bogotá",
  // Ecuador
  "Banco Pichincha",
  "Banco Guayaquil",
  "Cooperativa JEP",
  "Produbanco",
  "Cooperativa Jardín Azuayo",
  "Banco del Austro",
  // Chile,
  "Banco Santander",
  "Banco de Chile",
  "Banco Estado",
  "Banco Crédito Inversiones (Bci)",
  "Scotiabank",
  "Banco Falabella",
  // Mexico
  "Elektra /​ Banco Azteca",
  "Bancoppel",
  "OXXO",
  "Bodega Aurrera",
  "Walmart",
  "Walmart Express",
  "Farmacias Guadalajara",
  "Soriana /​ Mega Soriana",
  "Telecomm Telégrafos",
  "Alsuper",
  "Waldos y Tiendas Eleczion",
  "Libertad Servicios Financieros",
  "Circle K (Self service web-app)",
  "Tiendas Extra",
  "Sanborns",
  "Sears",
  "Dax",
]

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
          <Tabs defaultValue="paypal">
            <TabsList>
              <TabsTrigger value="paypal">
                <Icons.paypal className="h-4" />
              </TabsTrigger>
              <TabsTrigger value="bank">Bank deposit</TabsTrigger>
            </TabsList>
            <TabsContent value="paypal">
              <div className="space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  id="email"
                  placeholder="PayPal email"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Assign PayPal email to receive payments. Make sure your PayPal
                  account is set up to receive payments. receive payments.
                  <br />
                  The minimum withdrawal amount is $100 USD.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="bank">
              <div className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="text"
                  id="text"
                  placeholder="Bank account number"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Assign bank account number to receive payments. Make sure that
                  the data is correct to receive payments.
                  <br />
                  The minimum withdrawal amount is $100 USD.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading && <Icons.spinner className="mr-2 animate-spin" />}
            Define payment method
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
