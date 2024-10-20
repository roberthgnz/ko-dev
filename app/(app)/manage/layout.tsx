import {
  LayoutDashboard,
  PlusSquare,
  Settings,
  StarIcon,
  UserRound,
  Wallet2Icon,
} from "lucide-react"

import { SidebarNav } from "@/components/sidebar-nav"

export const metadata = {
  title: "Ko-dev",
  description: "All you need to make money doing what you love",
}

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/manage",
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    title: "New post",
    href: "/manage/posts/create",
    icon: <PlusSquare className="size-4" />,
  },
  {
    title: "Be a creator",
    href: "/manage/creator",
    icon: <StarIcon className="size-4" />,
  },
  {
    title: "Balance and payments",
    href: "/manage/balance",
    icon: <Wallet2Icon className="size-4" />,
  },
  {
    title: "Profile",
    href: "/see-profile",
    icon: <UserRound className="size-4" />,
  },
  {
    title: "Settings",
    href: "/manage/settings",
    icon: <Settings className="size-4" />,
  },
]

interface ManageLayoutProps {
  children: React.ReactNode
}

export default function ManageLayout({ children }: ManageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
