"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
// import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Icons } from "../icons"

interface UserLoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserLoginForm({ className, ...props }: UserLoginFormProps) {
  const router = useRouter()

  const supabase = createClientComponentClient()

  const [message, setMessage] = React.useState("")
  const [isError, setIsError] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    const email = event.currentTarget.email.value
    const password = event.currentTarget.password.value

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setIsError(true)
      setLoading(false)
      setMessage(error.message)
      return
    }

    setIsError(false)
    setMessage("")
    setLoading(false)

    return router.push("/onboarding")
  }

  const signUpWith = async (provider: any) => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
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
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              required
            />
          </div>
          {/* <div className="flex justify-end">
            <Link href="/forgot-password" className="text-primary">
              ¿Password olvidada?
            </Link>
          </div> */}
          <Button disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Log In
          </Button>
          <p className="my-2 text-center">Or continue with</p>
          <Button
            type="button"
            variant={"outline"}
            title="Registro con Google"
            onClick={() => signUpWith("google")}
            disabled={loading}
          >
            {loading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Image
                src="/assets/google-icon.webp"
                width={16}
                height={16}
                alt="Google Icon"
                className="mr-2"
              />
            )}
            <span>Google</span>
          </Button>
          <p className="text-center">
            Don`&apos;t have an account?{" "}
            <Link href="/register" className="text-primary">
              Create account
            </Link>
          </p>
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
