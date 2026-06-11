"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  IconLayoutDashboard,
  IconRecycle,
  IconChartBar,
  IconHistory,
  IconLeaf,
  IconInfoCircle,
  IconUser,
  IconLogout,
} from "@tabler/icons-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Klasifikasi Sampah",
      url: "/dashboard/classification",
      icon: IconRecycle,
    },
    {
      title: "Performa Model",
      url: "/dashboard/performance",
      icon: IconChartBar,
    },
    {
      title: "Riwayat Klasifikasi",
      url: "/dashboard/history",
      icon: IconHistory,
    },
  ],
  navSecondary: [
    {
      title: "Panduan Pengelolaan",
      url: "/dashboard/guide",
      icon: IconLeaf,
    },
    {
      title: "Tentang Sistem",
      url: "/dashboard/about",
      icon: IconInfoCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-sidebar-accent"
            >
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconRecycle className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-base">WasteSort</span>
                  <span className="text-xs text-muted-foreground">KNN Classifier</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between py-4">
        {/* Main Navigation */}
        <SidebarMenu className="px-2 space-y-1">
          {data.navMain.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="data-[slot=sidebar-menu-button]:p-2.5! rounded-xl transition-all"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className={`size-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* Secondary Navigation (Bottom) */}
        <div className="mt-auto">
          <SidebarMenu className="px-2 space-y-1">
            {data.navSecondary.map((item) => {
              const isActive = pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className="data-[slot=sidebar-menu-button]:p-2.5! rounded-xl transition-all"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={`size-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground border shrink-0">
              <IconUser className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate">Demo User</span>
              <span className="text-xs text-muted-foreground truncate">Peneliti / Umum</span>
            </div>
          </div>
          <button
            onClick={() => {
              toast.success("Anda telah keluar dari sistem.")
              router.push("/login")
            }}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all cursor-pointer shrink-0"
            title="Keluar"
          >
            <IconLogout className="size-5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
