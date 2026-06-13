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

  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="transition-colors hover:text-foreground">
                TrashSort
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {pathSegments.slice(1).map((segment, index) => {
              const url = `/dashboard/${pathSegments.slice(1, index + 2).join("/")}`
              const label = routeMap[segment] || (segment.startsWith("cls_") ? `Hasil #${segment.split("_").pop()}` : segment)
              const isLast = index === pathSegments.length - 2

              return (
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
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
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
