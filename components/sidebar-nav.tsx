"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon?: React.ReactNode
  }[]
  direction?: "horizontal" | "vertical"
}

export function SidebarNav({
  className,
  items,
  direction = "vertical",
  ...props
}: SidebarNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = (href: string) => {
    const tab = searchParams.get("tab")

    if (tab && href.includes("?tab=")) {
      const url = `${pathname}?tab=${tab}`
      return url.endsWith(href)
    }

    if (
      pathname === "/manage/settings" &&
      href === "/manage/settings?tab=profile"
    ) {
      return true
    }

    return pathname === href
  }

  return (
    <nav
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col space-y-1" : "flex-row space-x-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors",
            buttonVariants({ variant: "ghost" }),
            isActive(item.href)
              ? "bg-primary-foreground"
              : "hover:bg-primary-foreground",
            "justify-start"
          )}
        >
          {item.icon && (
            <span className="mr-2 flex h-6 w-6 items-center justify-center">
              {item.icon}
            </span>
          )}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
