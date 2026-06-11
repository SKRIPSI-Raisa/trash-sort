"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  IconRecycle,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconLoader2,
} from "@tabler/icons-react"

export default function Page() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Harap isi email dan kata sandi Anda.")
      return
    }

    setIsLoading(true)
    
    // Simulate mock authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    toast.success("Login Berhasil!")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <Card className="w-full max-w-md border border-border/80 shadow-sm rounded-xl bg-card">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto size-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
            <IconRecycle className="size-5.5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">WasteSort</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Masukkan akun Anda untuk mengelola klasifikasi sampah
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9.5 rounded-lg text-sm h-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold">Kata Sandi</Label>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    toast.info("Fitur reset sandi disimulasikan.")
                  }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9.5 pr-10 rounded-lg text-sm h-10"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? (
                    <IconEyeOff className="size-4" />
                  ) : (
                    <IconEye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-10 mt-2 text-sm"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="size-4 mr-2 animate-spin" />
                  Memasuki Sistem...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <IconArrowRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground pt-1 border-t border-border/40">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-semibold"
            >
              Daftar Sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
