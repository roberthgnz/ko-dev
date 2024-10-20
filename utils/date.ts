import { formatDistance } from "date-fns"

export const localeFormatDistance = (date: Date | string) => {
  try {
    const distance = formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    })

    return distance.split(" ").slice(-2).join(" ")
  } catch (_) {
    return null
  }
}
