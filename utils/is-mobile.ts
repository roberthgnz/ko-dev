import { headers } from "next/headers"
import { userAgent } from "next/server"

export const getIsMobile = () => {
  const headersList = headers()
  const { device } = userAgent({ headers: headersList })

  return device.type === "mobile"
}
