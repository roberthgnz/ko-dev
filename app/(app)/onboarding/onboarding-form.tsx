"use client"

import { useState } from "react"
import { createStore, StateMachineProvider } from "little-state-machine"

import { Step1 } from "./step-1"
import { Step2 } from "./step-2"

type OnboardingFormProps = {
  avatar_url: string
  full_name: string
}

declare module "little-state-machine" {
  interface GlobalState {
    onboarding: {
      avatar_url: string
      username: string
      full_name: string
      social_links: {
        type: string
        name: string
        placeholder: string
        value: string
      }[]
    }
  }
}

createStore({
  onboarding: {
    avatar_url: "",
    full_name: "",
    username: "",
    social_links: [
      {
        type: "website",
        name: "Website",
        placeholder: "https://website-web.com",
        value: "",
      },
      {
        type: "instagram",
        name: "Instagram",
        placeholder: "https://instagram.com/username",
        value: "",
      },
      {
        type: "facebook",
        name: "Facebook",
        placeholder: "https://facebook.com/username",
        value: "",
      },
      {
        type: "twitter",
        name: "Twitter",
        placeholder: "https://twitter.com/username",
        value: "",
      },
      {
        type: "youtube",
        name: "Youtube",
        placeholder: "https://youtube.com/username",
        value: "",
      },
    ],
  },
})

export default function OnboardingForm({
  avatar_url,
  full_name,
}: OnboardingFormProps) {
  const [step, setStep] = useState(1)

  return (
    <StateMachineProvider>
      {step === 1 && (
        <Step1
          setStep={setStep}
          avatar_url={avatar_url}
          full_name={full_name}
        />
      )}
      {step === 2 && <Step2 setStep={setStep} />}
    </StateMachineProvider>
  )
}
