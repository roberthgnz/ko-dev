import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useStateMachine } from "little-state-machine"
// @ts-ignore
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AvatarForm } from "@/components/avatar-form"

import updateAction from "./updateAction"

const formSchema = z.object({
  full_name: z.string().min(3, { message: "You must enter a valid name" }),
  username: z.string().refine(
    (value: string) => {
      return value && /^[a-zA-Z0-9_]*$/.test(value)
    },
    () => ({
      message: `You must enter a valid username. Spaces and special characters are not allowed.`,
    })
  ),
})

export const Step1 = ({ setStep, avatar_url, full_name }: any) => {
  const { actions, state } = useStateMachine({ updateAction })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: state.onboarding.full_name || full_name || "",
      username: state.onboarding.username,
    },
  })

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    // @ts-ignore
    state.onboarding.avatar_url || avatar_url
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    actions.updateAction(values)
    setStep(2)
  }

  const onUpload = async (path: string) => {
    setAvatarUrl(path)
    actions.updateAction({ avatar_url: path })
    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar_url: path }),
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto sm:w-[450px]"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>
              Let&apos;s start with some basic information to set up your
              account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarForm url={avatarUrl} onUpload={onUpload} />
            <FormField
              control={form.control}
              name="full_name"
              // @ts-ignore
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              // @ts-ignore
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-end">
              <Button type="submit">Continue</Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
