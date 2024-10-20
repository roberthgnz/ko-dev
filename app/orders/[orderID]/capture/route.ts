import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

const PROD_URL = "https://api-m.paypal.com"
const DEV_URL = "https://api-m.sandbox.paypal.com"
const BASE_URL = process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS")
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64")
    const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Failed to generate Access Token:", error)
  }
}

const handleResponse = async (response: Response) => {
  try {
    const jsonResponse = await response.json()
    return {
      jsonResponse,
      httpStatusCode: response.status,
    }
  } catch (err) {
    const errorMessage = await response.text()
    throw new Error(errorMessage)
  }
}

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID: string) => {
  const accessToken = await generateAccessToken()
  const url = `${BASE_URL}/v2/checkout/orders/${orderID}/capture`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  })

  return handleResponse(response)
}

export async function POST(
  _: any,
  { params }: { params: { orderID: string } }
) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 })
  }

  try {
    const { orderID } = params

    const { jsonResponse, httpStatusCode } = await captureOrder(orderID)

    await supabase.from("transactions").insert({
      buyer_id: user.id,
      seller_id: jsonResponse.purchase_units[0].payments.captures[0].custom_id,
      post_id: jsonResponse.purchase_units[0].reference_id,
      status: jsonResponse.status,
      payment_source: jsonResponse.payment_source,
      purchase_units: jsonResponse.purchase_units,
      payer: jsonResponse.payer,
    })

    return NextResponse.json(jsonResponse, { status: httpStatusCode })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { error: "Failed to capture order." },
      { status: 500 }
    )
  }
}
