"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Icons } from "../icons"
import useSessionStorage from "@/hooks/use-session-storage"

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserRegisterForm({
  className,
  ...props
}: UserRegisterFormProps) {
  const router = useRouter()
  const params = useSearchParams()

  const supabase = createClientComponentClient()

  const [message, setMessage] = React.useState("")
  const [isError, setIsError] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    const email = event.currentTarget.email.value
    const password = event.currentTarget.password.value

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      }
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

  const [_, setStoredUsername] = useSessionStorage<string | null>('username')


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

  React.useEffect(() => {
    const username = params.get("username")
    if (username) {
      setStoredUsername(username)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

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
          <Button disabled={loading}>
            {loading && <Icons.spinner className="mr-2 animate-spin" />}
            Create account
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
            Already have an account? {" "}
            <Link href="/login" className="text-primary">
              Log In
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
