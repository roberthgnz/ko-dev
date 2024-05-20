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

const createOrder = async (
  post_id: string,
  seller_id: string,
  price: number
) => {
  const accessToken = await generateAccessToken()
  const url = `${BASE_URL}/v2/checkout/orders`
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        custom_id: seller_id,
        reference_id: post_id,
        amount: {
          currency_code: "USD",
          value: price,
        },
      },
    ],
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

export async function POST(request: Request) {
  const { post_id } = await request.json()

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 })
  }

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", post_id)
    .single()

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  try {
    const { jsonResponse, httpStatusCode } = await createOrder(
      post_id,
      post.user_id,
      post.price
    )
    return NextResponse.json(jsonResponse, { status: httpStatusCode })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    )
  }
}
