"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { navItems } from "@/constants/data"
import {
  ChevronRight,
  ChevronsUpDown,
  Component,
  LogOut,
  UserCog,
} from "lucide-react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"
import { Icons } from "../ui/icons"
import { useClerk } from "@clerk/nextjs"
import { useUser } from "@/hooks/users/use-user"
import { Skeleton } from "../ui/skeleton"

export const company = {
  name: "Ecstasia",
  logo: Component,
}

export default function AppSidebar() {
  const pathname = usePathname()
  const { user, isLoading } = useUser()
  const { signOut } = useClerk()

  const router = useRouter()

  const ReapNavItems = navItems.filter((item) => {
    if (user && user.role === "REAP") {
      return (
        item.title !== "DASHBOARD" &&
        item.title !== "ADMINS" &&
        item.title !== "USERS" &&
        item.title !== "COORDINATORS" &&
        item.title !== "MY EVENTS" &&
        item.title !== "EVENTS" &&
        item.title !== "COLLEGE REAPS" &&
        item.title !== "TEAMS" &&
        item.title !== "YOUR TEAMS" && 
        item.title !== "BOOKINGS" && 
        item.title !== "EVENT BOOKINGS"
      )
    }
    return true
  })

  const CoordinatorNavItems = navItems.filter((item) => {
    if (user && user.role === "COORDINATOR") {
      return (
        item.title !== "DASHBOARD" &&
        item.title !== "ADMINS" &&
        item.title !== "USERS" &&
        item.title !== "COORDINATORS" &&
        item.title !== "COLLEGE REAPS" &&
        item.title !== "TEAMS" &&
        item.title !== "MY TEAMS" && 
        item.title !== "EVENTS" &&
        item.title !== "BOOKINGS"
      )
    }
    return true
  })

  const UserNavItems = navItems.filter((item) => {
    if (user && user.role === "USER") {
      return (
        item.title !== "DASHBOARD" &&
        item.title !== "ADMINS" &&
        item.title !== "USERS" &&
        item.title !== "COORDINATORS" &&
        item.title !== "COLLEGE REAPS" &&
        item.title !== "TEAMS" &&
        item.title !== "MY TEAMS" &&
        item.title !== "MY EVENTS" &&
        item.title !== "EVENTS" && 
        item.title !== "BOOKINGS" && 
         item.title !== "EVENT BOOKINGS"
      )
    }
    return true
  })

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="">
        <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mt-1">
            <company.logo className="size-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight pt-0.5">
            <span className="truncate font-semibold">{company.name}</span>
            {isLoading ? (
              <Skeleton className="w-20 h-4 rounded-sm mt-0.5" />
            ) : (
              <span className="truncate text-xs font-semibold">
                {user?.role || "  "}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        {isLoading ? (
          <div className="flex flex-col gap-2 mt-6 px-4">
            <Skeleton className="w-full h-8 rounded-sm" />
            <Skeleton className="w-full h-8 rounded-sm" />
            <Skeleton className="w-full h-8 rounded-sm" />
            <Skeleton className="w-full h-8 rounded-sm" />
            <Skeleton className="w-full h-8 rounded-sm" />
            <Skeleton className="w-full h-8 rounded-sm" />
          </div>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase">
              {user?.role} PANEL
            </SidebarGroupLabel>
            <SidebarMenu>
              {(user?.role === "REAP"
                ? ReapNavItems
                : user?.role === "COORDINATOR"
                ? CoordinatorNavItems
                : user?.role === "USER"
                ? UserNavItems
                : navItems
              ).map((item) => {
                const Icon = item.icon
                  ? Icons[item.icon as keyof typeof Icons]
                  : Icons.logo
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname === item.url}
                        >
                          {item.icon && <Icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.slice(0, 2)?.toUpperCase() || "ES"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || ""}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.slice(0, 2)?.toUpperCase() || "ES"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || ""}
                      </span>
                      <span className="truncate text-xs">
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/dashboard/profile")
                    }}
                  >
                    <UserCog />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut()
                  }}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
