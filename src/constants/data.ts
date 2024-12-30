import { NavItem } from "@/types"

export const navItems: NavItem[] = [
  {
    title: "DASHBOARD",
    url: "/dashboard",
    icon: "layout",
    shortcut: ["d", "d"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "ADMINS",
    url: "/dashboard/admins",
    icon: "userCog",
    shortcut: ["a", "a"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "COORDINATORS",
    url: "/dashboard/coordinators",
    icon: "userPlus",
    shortcut: ["c", "c"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "USERS",
    url: "/dashboard/users",
    icon: "user",
    shortcut: ["u", "u"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "EVENTS",
    url: "/dashboard/events",
    icon: "clapperboard",
    shortcut: ["e", "e"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "FCM TOKENS",
    url: "/dashboard/tokens",
    icon: "key",
    shortcut: ["k", "k"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "MY EVENTS",
    url: "/dashboard/myevents",
    icon: "aparature",
    shortcut: ["m", "e"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "NOTIFICATION",
    url: "/dashboard/notification",
    icon: "bellDot",
    shortcut: ["n", "n"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "PROFILE",
    url: "/dashboard/profile",
    icon: "cog",
    shortcut: ["p", "p"],
    isActive: false,
    items: [], // No child items
  },
]
