import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserRegisterForm } from "@/components/authentication/user-register-form"

export const metadata = {
  title: "Ko-dev",
  description: "All you need to make money doing what you love",
}

export default function AuthenticationPage() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          background: "rgb(240,63,251)",
          backgroundImage:
            "radial-gradient(circle, rgba(240,63,251,1) 0%, rgba(168,70,252,1) 100%)",
        }}
      ></div>
      <div className="container h-screen w-full">
        <div className="relative z-10 mx-auto flex flex-col justify-center gap-16 sm:mx-auto sm:w-full sm:max-w-md">
          <Link
            href={"/"}
            className="mx-auto flex w-fit flex-col justify-center invert"
          >
            <span className="text-4xl font-black">Ko-dev</span>
          </Link>
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Create account</CardTitle>
              <CardDescription>
                Join 1M+ creators getting donations, memberships and sales from fans!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 ">
              <UserRegisterForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking Create account, you agree to our <br />
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of service.
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
