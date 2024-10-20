import { toast as sonner } from "sonner"

export const toast = ({
  title,
  description,
  variant = "success",
}: {
  title: string
  description?: string
  variant?: "success" | "destructive"
}) => {
  switch (variant) {
    case "success":
      return sonner.success(title, { description })
    case "destructive":
      return sonner.error(title, { description })

    default:
      return sonner.message(title, { description })
  }
}
