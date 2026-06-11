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
      <div className="relative flex items-center justify-between px-4 py-1 bg-background/70 dark:bg-background/60 backdrop-blur-xl border border-border/50 dark:border-border/20 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== "/dashboard" && pathname.startsWith(item.url))

          if (item.isCenter) {
            return (
              <Link
                key={item.label}
                href={item.url}
                className="relative -top-3.5 flex flex-col items-center group shrink-0"
              >
                <div className="flex items-center justify-center size-11 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white shadow-[0_6px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] group-hover:scale-105 active:scale-95 transition-all duration-300">
                  <item.icon className="size-5.5 animate-pulse group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <span className="text-[8px] font-bold text-foreground mt-0.5 select-none">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.url}
              className="flex flex-col items-center justify-center w-12 py-0.5 transition-all duration-200 select-none group"
            >
              <item.icon
                className={`size-4.5 transition-transform duration-200 group-hover:scale-110 active:scale-95 ${
                  isActive
                    ? "text-primary dark:text-emerald-400 font-bold"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span
                className={`text-[8px] mt-0.5 font-semibold transition-all duration-200 ${
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
