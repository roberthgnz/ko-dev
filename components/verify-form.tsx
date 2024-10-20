"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/toast"

import { CountrySelect } from "./country-select"
import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"

export const VerifyForm = ({
  userId,
  isCreator,
  isComplete,
}: {
  userId: string
  isCreator: boolean
  isComplete: boolean
}) => {
  const supabase = createClientComponentClient()

  const [formState, setFormState] = useState({
    country: "",
    first_name: "",
    last_name: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    terms: false,
  })

  const [loading, setLoading] = useState(false)

  if (isCreator && isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Account verification</CardTitle>
          <CardDescription>
            Your account has been verified. No further action is required.
            further action.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const updteFormState = (key: string, value: any) => {
    setFormState((prevState: any) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setLoading(true)

      const { terms, ...data } = formState

      const { error } = await supabase
        .from("creators")
        .insert({ ...data, user_id: userId })

      if (error) {
        setLoading(false)
        return toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }

      toast({
        title: "Verification process completed",
        description:
          "Your account has been placed in the verification process.",
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
        <CardHeader>
          <CardTitle className="text-md">Account verification</CardTitle>
          <CardDescription>
            Make sure your country of legal residence is correct. Please note
            Please note that you will not be able to change it later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <CountrySelect
              value={formState.country}
              setValue={(value) => updteFormState("country", value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="first_name"
              value={formState.first_name}
              onChange={(e) => updteFormState("first_name", e.target.value)}
              name="first_name"
              id="first_name"
              placeholder="First name"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="last_name"
              value={formState.last_name}
              onChange={(e) => updteFormState("last_name", e.target.value)}
              name="last_name"
              id="last_name"
              placeholder="Last name"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="date"
              value={formState.dob}
              onChange={(e) => updteFormState("dob", e.target.value)}
              name="dob"
              id="dob"
              placeholder="Date of birth"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="address"
              value={formState.address}
              onChange={(e) => updteFormState("address", e.target.value)}
              name="address"
              id="address"
              placeholder="Address"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="city"
              value={formState.city}
              onChange={(e) => updteFormState("city", e.target.value)}
              name="city"
              id="city"
              placeholder="City"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="state"
              value={formState.state}
              onChange={(e) => updteFormState("state", e.target.value)}
              name="state"
              id="state"
              placeholder="State"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="zip"
              value={formState.zip}
              onChange={(e) => updteFormState("zip", e.target.value)}
              name="zip"
              id="zip"
              placeholder="ZIP"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formState.terms}
              onCheckedChange={(checked) => updteFormState("terms", checked)}
            />
            <label
              htmlFor="terms"
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Check here to confirm that you are at least 18 years of age, the
              age of majority in your place of residence. of age in your place
              of residence
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!formState.terms || loading}>
            {loading && <Icons.spinner className="mr-2 animate-spin" />}
            Complete verification process
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
