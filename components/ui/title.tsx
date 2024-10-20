import { cn } from "@/lib/utils"

export const Title = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h1
      className={cn("scroll-m-20 text-2xl font-bold tracking-tight", className)}
      {...props}
    >
      {children}
    </h1>
  )
}
