"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { IconSun, IconMoon } from "@tabler/icons-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeMap: Record<string, string> = {
  dashboard: "Dashboard",
  classification: "Klasifikasi Sampah",
  performance: "Performa Model",
  history: "Riwayat Klasifikasi",
  guide: "Panduan Pengelolaan",
  about: "Tentang Sistem",
  admin: "Admin",
}

export function SiteHeader() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const pathSegments = pathname.split("/").filter(Boolean)

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const isAdminRoute = pathname.startsWith("/admin")

  // Build breadcrumb segments dynamically for both admin and user routes
  const breadcrumbSegments = React.useMemo(() => {
    if (isAdminRoute) {
      return pathSegments.map((seg, index) => {
        const builtUrl = "/" + pathSegments.slice(0, index + 1).join("/")
        const label = routeMap[seg] || seg
        const isLast = index === pathSegments.length - 1
        return { url: builtUrl, label, isLast }
      })
    }
    // User route: skip first segment ("dashboard")
    return pathSegments.slice(1).map((segment, index) => {
      const url = `/dashboard/${pathSegments.slice(1, index + 2).join("/")}`
      const label = routeMap[segment] || (segment.startsWith("cls_") ? `Hasil #${segment.split("_").pop()}` : segment)
      const isLast = index === pathSegments.length - 2
      return { url, label, isLast }
    })
  }, [pathname, pathSegments, isAdminRoute])

  return (
    <header className={`flex h-(--header-height) shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear lg:px-6 ${
      isAdminRoute ? "border-red-500/20 bg-red-950/5" : ""
    }`}>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={isAdminRoute ? "/admin/dashboard" : "/dashboard"}
                className="transition-colors hover:text-foreground"
              >
                {isAdminRoute ? "Admin" : "TrashSort"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {breadcrumbSegments.slice(isAdminRoute ? 1 : 0).map(({ url, label, isLast }) => (
              <React.Fragment key={url}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-semibold text-foreground">{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={url} className="transition-colors hover:text-foreground">
                      {label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Admin mode badge */}
        {isAdminRoute && (
          <span className="ml-2 hidden sm:inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-500 tracking-wider uppercase">
            Admin Mode
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <IconSun className="size-5 text-yellow-400" />
            ) : (
              <IconMoon className="size-5 text-indigo-600" />
            )}
          </Button>
        )}
      </div>
    </header>
  )
}
