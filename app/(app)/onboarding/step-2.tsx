import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStateMachine } from "little-state-machine"

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
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

import updateAction from "./updateAction"

export const Step2 = ({ setStep }: any) => {
  const router = useRouter()

  const { actions, state } = useStateMachine({ updateAction })

  // @ts-ignore
  const [form, setForm] = useState(state.onboarding.social_links)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    actions.updateAction({ social_links: form })

    setLoading(true)

    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // @ts-ignore
      body: JSON.stringify({ ...state.onboarding, onboarding: false }),
    })

    setLoading(false)

    return router.push("/manage", { scroll: false })
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto sm:w-[450px]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Social media</CardTitle>
          <CardDescription>
            Assign your social networks so that your followers can follow you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* @ts-ignore */}
          {form.map((item, index) => (
            <div className="flex flex-col space-y-1.5" key={index}>
              <Label htmlFor={item.type}>{item.name}</Label>
              <Input
                id={item.type}
                name={item.type}
                placeholder={item.placeholder}
                value={item.value}
                onChange={(event) => {
                  const newForm = [...form]
                  newForm[index].value = event.target.value
                  setForm(newForm)
                }}
                type="url"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between gap-2">
            <Button
              onClick={() => setStep(1)}
              variant={"secondary"}
              disabled={loading}
            >
              Back
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Icons.spinner className="mr-2 animate-spin" />}
              Continue
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
