import { SidebarNav } from "../sidebar-nav"

export const ManageSidebar = () => {
  return (
    <SidebarNav
      items={[
        {
          title: "Dashboard",
          href: "/manage",
        },
        {
          title: "Perfil",
          href: "/manage/profile",
        },
        {
          title: "Edit profile",
          href: "/manage/profile/edit",
        },
        {
          title: "Settings",
          href: "/manage/settings",
        },
      ]}
    />
  )
}
