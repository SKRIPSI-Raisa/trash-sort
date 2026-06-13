"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { FloatingBottomBar } from "@/components/floating-bottom-bar"
import { IconLoader2 } from "@tabler/icons-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    async function checkAuth() {
      // Just check the session, no force redirect if empty
      await supabase.auth.getSession()
      setIsChecking(false)
    }
    
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      // If user explicitly signs out, redirect to login
      if (event === "SIGNED_OUT") {
        router.push("/login")
      }
      setIsChecking(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Memverifikasi sesi...</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col pb-24 md:pb-0">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
        <FloatingBottomBar />
      </SidebarInset>
    </SidebarProvider>
  )
}
