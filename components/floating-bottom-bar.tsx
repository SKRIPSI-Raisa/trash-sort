"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconChartBar,
  IconRecycle,
  IconHistory,
  IconLeaf,
} from "@tabler/icons-react"

export function FloatingBottomBar() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      label: "Performa",
      url: "/dashboard/performance",
      icon: IconChartBar,
    },
    {
      label: "Klasifikasi",
      url: "/dashboard/classification",
      icon: IconRecycle,
      isCenter: true,
    },
    {
      label: "Riwayat",
      url: "/dashboard/history",
      icon: IconHistory,
    },
    {
      label: "Panduan",
      url: "/dashboard/guide",
      icon: IconLeaf,
    },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md md:hidden">
      <div className="relative flex items-center justify-between px-4 py-2 bg-background/70 dark:bg-background/60 backdrop-blur-xl border border-border/50 dark:border-border/20 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== "/dashboard" && pathname.startsWith(item.url))

          if (item.isCenter) {
            return (
              <Link
                key={item.label}
                href={item.url}
                className="relative -top-5 flex flex-col items-center group shrink-0"
              >
                <div className="flex items-center justify-center size-14 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.5)] group-hover:scale-105 active:scale-95 transition-all duration-300">
                  <item.icon className="size-7 animate-pulse group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <span className="text-[10px] font-bold text-foreground mt-1 select-none">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.url}
              className="flex flex-col items-center justify-center w-12 py-1 transition-all duration-200 select-none group"
            >
              <item.icon
                className={`size-5 transition-transform duration-200 group-hover:scale-110 active:scale-95 ${
                  isActive
                    ? "text-primary dark:text-emerald-400 font-bold"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span
                className={`text-[9px] mt-1 font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-primary dark:text-emerald-400"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
