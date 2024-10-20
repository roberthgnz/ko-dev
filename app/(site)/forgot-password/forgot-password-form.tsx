"use client"

import * as React from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

interface UserLoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ForgotPasswordForm({
  className,
  ...props
}: UserLoginFormProps) {
  const supabase = createClientComponentClient()

  const [message, setMessage] = React.useState("")
  const [isError, setIsError] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    const email = event.currentTarget.email.value

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/update-password`,
    })

    if (error) {
      setIsError(true)
      setMessage(error.message)
      return
    }

    setMessage("Verique su correo electrónico para continuar")

    setLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              E-mail
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="E-mail"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
            />
          </div>

          <Button disabled={loading}>
            {loading && <Icons.spinner className="mr-2 animate-spin" />}
            Reestablecer
          </Button>
        </div>
      </form>
      {message && (
        <Alert variant={isError ? "destructive" : "default"}>
          <AlertTitle>
            {isError ? "An error has occurred" : "Done!"}
          </AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
