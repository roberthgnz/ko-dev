"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
// @ts-ignore
import { loadScript } from "@paypal/paypal-js"

import { toast } from "@/components/ui/toast"

export const UnlockAssetForm = ({
  username,
  post_id,
}: {
  username?: string
  post_id: string
}) => {
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      loadScript({
        currency: "USD",
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
      })
        .then((paypal: any) => {
          paypal
            .Buttons({
              async createOrder() {
                try {
                  const response = await fetch("/orders", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ post_id }),
                  })

                  const orderData = await response.json()

                  if (orderData.id) {
                    return orderData.id
                  } else {
                    const errorDetail = orderData?.details?.[0]
                    const errorMessage = errorDetail
                      ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                      : JSON.stringify(orderData)

                    throw new Error(errorMessage)
                  }
                } catch (error) {
                  console.error(error)
                  toast({
                    title: "Error",
                    description: "Payment could not be initiated.",
                    variant: "destructive",
                  })
                }
              },
              async onApprove(data: any, actions: any) {
                try {
                  const response = await fetch(
                    `/orders/${data.orderID}/capture`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )

                  const orderData = await response.json()
                  // Three cases to handle:
                  //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                  //   (2) Other non-recoverable errors -> Show a failure message
                  //   (3) Successful transaction -> Show confirmation or thank you message
                  const errorDetail = orderData?.details?.[0]

                  if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                    // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                    // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                    return actions.restart()
                  } else if (errorDetail) {
                    // (2) Other non-recoverable errors -> Show a failure message
                    throw new Error(
                      `${errorDetail.description} (${orderData.debug_id})`
                    )
                  } else if (!orderData.purchase_units) {
                    throw new Error(JSON.stringify(orderData))
                  } else {
                    // (3) Successful transaction
                    return router.push(`/${username}/posts/${post_id}`)
                  }
                } catch (error) {
                  console.error(error)
                  toast({
                    title: "Error",
                    description: "There was an error processing your payment.",
                    variant: "destructive",
                  })
                }
              },
            })
            .render(`#paypal-button-container-${post_id}`)
        })
        .catch((error: any) => {
          console.error("failed to load the PayPal JS SDK script", error)
        })
    }

    username && init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {!username && (
        <span className="text-sm text-gray-500">
          You need to log in to unlock
        </span>
      )}
      <div id={`paypal-button-container-${post_id}`} className="w-full"></div>
    </div>
  )
}
