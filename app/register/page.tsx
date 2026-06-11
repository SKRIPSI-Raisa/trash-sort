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
  IconUser,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconLoader2,
} from "@tabler/icons-react"

export default function Page() {
  const router = useRouter()
  
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Harap isi semua kolom formulir.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.")
      return
    }

    setIsLoading(true)
    
    // Simulate mock registration delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
    
    setIsLoading(false)
    toast.success("Registrasi Berhasil!")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <Card className="w-full max-w-md border border-border/80 shadow-sm rounded-xl bg-card">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto size-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
            <IconRecycle className="size-5.5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Buat Akun Baru</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Mulai pemilahan sampah otomatis sekarang gratis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">Nama Lengkap</Label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9.5 rounded-lg text-sm h-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

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
              <Label htmlFor="password" className="text-xs font-semibold">Kata Sandi</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9.5 pr-10 rounded-lg text-sm h-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Mendaftarkan Akun...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <IconArrowRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground pt-1 border-t border-border/40">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-semibold"
            >
              Masuk Sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
