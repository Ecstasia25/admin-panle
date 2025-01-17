"use client"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import { Breadcrumbs } from "../ui/breadcrumbs"
import SearchInput from "../ui/search-input"
import { UserNav } from "./user-nav"
import ThemeToggle from "./ThemeToggle/theme-toggle"
import { useUser } from "@/hooks/users/use-user"

export default function Header() {
  const { user } = useUser()
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 px-4">

      {(user?.role === "SUPERADMIN" || user?.role === "ADMIN") && (
          <div className="hidden md:flex">
          <SearchInput />
        </div>
      )}

        <UserNav />
        <ThemeToggle />
      </div>
    </header>
  )
}
