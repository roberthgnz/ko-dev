import { Icons } from "@/components/icons"

export default function Loading() {
  return (
    <div className="my-32 flex w-full items-center justify-center">
      <Icons.spinner className="mx-auto h-12 w-12 animate-spin" />
    </div>
  )
}
