"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

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
  IconLogin,
} from "@tabler/icons-react"

const data = {
  navUser: [
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
      title: "Riwayat Klasifikasi",
      url: "/dashboard/history",
      icon: IconHistory,
    },
  ],
  navAdmin: [
    {
      title: "Admin Dashboard",
      url: "/admin/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Riwayat Semua User",
      url: "/admin/history",
      icon: IconHistory,
    },
    {
      title: "Performa Model",
      url: "/admin/performance",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Panduan Pengelolaan",
      url: "/dashboard/guide",
      icon: IconLeaf,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [userProfile, setUserProfile] = React.useState<{ name: string; role: string; avatarUrl?: string } | null>(null)

  React.useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, role, avatar_url")
          .eq("id", user.id)
          .single()
        
        if (profile) {
          setUserProfile({
            name: profile.name || "User",
            role: profile.role || "user",
            avatarUrl: profile.avatar_url || undefined
          })
        } else {
          setUserProfile({
            name: user.email?.split("@")[0] || "User",
            role: "user"
          })
        }
      } else {
        setUserProfile({
          name: "Pengunjung",
          role: "umum (lokal)",
          avatarUrl: undefined
        })
      }
    }
    
    fetchProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchProfile()
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-sidebar-accent"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconRecycle className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-base">Trash Sort</span>
                  <span className="text-xs text-muted-foreground"></span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between py-4">
        {/* Main Navigation */}
        <SidebarMenu className="px-2 space-y-1">
          {(pathname.startsWith("/admin") ? data.navAdmin : data.navUser).map((item) => {
            const isActive = pathname === item.url || (item.url !== "/dashboard" && item.url !== "/admin/dashboard" && pathname.startsWith(item.url))
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
        {!pathname.startsWith("/admin") && (
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
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 min-w-0">
            {userProfile?.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="size-9 rounded-full object-cover border shrink-0"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground border shrink-0">
                <IconUser className="size-5" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate" title={userProfile?.name || "Memuat..."}>
                {userProfile?.name || "Memuat..."}
              </span>
              <span className="text-xs text-muted-foreground truncate capitalize">
                {userProfile?.role === "admin" ? "Administrator" : "Umum"}
              </span>
            </div>
          </div>
          {userProfile?.role === "umum (lokal)" ? (
            <button
              onClick={() => router.push("/login")}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer shrink-0"
              title="Masuk"
            >
              <IconLogin className="size-5" />
            </button>
          ) : (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                toast.success("Anda telah keluar dari sistem.")
                router.push("/login")
              }}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all cursor-pointer shrink-0"
              title="Keluar"
            >
              <IconLogout className="size-5" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
