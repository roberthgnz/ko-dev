import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/sidebar-nav"

export const metadata = {
  title: "Ko-dev",
  description: "All you need to make money doing what you love",
}
const sidebarNavItems = [
  {
    title: "Profile",
    href: "/manage/settings?tab=profile",
  },
  {
    title: "Payment",
    href: "/manage/settings?tab=payment",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">Settings</h2>
      </div>
      <Separator className="my-6" />
      <div className="space-y-8">
        <SidebarNav items={sidebarNavItems} direction="horizontal" />
        {children}
      </div>
    </>
  )
}
