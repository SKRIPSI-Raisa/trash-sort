"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  IconRecycle,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconArrowLeft,
  IconLoader2,
  IconCamera,
  IconBrain,
  IconChartBar,
  IconCheck,
} from "@tabler/icons-react"

const LEFT_FEATURES = [
  { icon: IconCamera, text: "Monitoring Hasil Klasifikasi" },
  { icon: IconBrain, text: "Evaluasi Performa Model" },
  { icon: IconChartBar, text: "Kelola Riwayat Klasifikasi" },
]

/*const STATS = [
  { value: "83%", label: "Akurasi" },
  { value: "K=11", label: "Optimal" },
  { value: "2", label: "Kategori" },
]*/

export default function LoginPage() {
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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast.error("Login Gagal: " + error.message)
      setIsLoading(false)
      return
    }

    // Check role
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()
      
      setIsLoading(false)
      toast.success("Login Berhasil!")

      if (profile?.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } else {
      setIsLoading(false)
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col bg-gradient-to-br from-emerald-950 via-emerald-950/80 to-background">
        {/* BG decorations */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(52,211,153,0.18) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%)",
            }}
          />
          <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-emerald-400/12 blur-3xl animate-blob" />
          <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl animate-blob [animation-delay:3s]" />
          {/* Subtle gradient border on right edge */}
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col p-10">
          {/* Logo */}
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/40">
              <IconRecycle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-white/90">TrashSort</span>
          </Link>

          {/* Hero copy */}
          <div className="flex flex-1 flex-col justify-center py-10">
            <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              ✦ Selamat Datang Kembali
            </span>

            <h2 className="mb-4 text-4xl font-bold leading-tight text-white">
           {" "}
              <span className="animate-shimmer-text bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">
                Klasifikasi Sampah
              </span>
              <br />
            </h2>

            <p className="mb-10 max-w-sm text-sm leading-relaxed text-white/50">
              Pantau riwayat klasifikasi,performa model, dan tinjau aktivitas sistem
            </p>

            {/* Feature chips */}
            <div className="space-y-2.5">
              {LEFT_FEATURES.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-white/65">{f.text}</span>
                  <IconCheck className="ml-auto h-4 w-4 shrink-0 text-emerald-500/60" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats row */}
          <div className="flex items-center gap-8 border-t border-white/10 pt-6">
            {/* {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-white/90">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
            <IconRecycle className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">TrashSort</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="mb-1.5 text-2xl font-bold tracking-tight">Masuk ke Halaman Admin</h1>
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <IconMail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-muted/40 pl-10 text-sm transition-colors focus:bg-background"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Kata Sandi
                </Label>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    toast.info("Fitur reset sandi disimulasikan.")
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <IconLock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-muted/40 pl-10 pr-11 text-sm transition-colors focus:bg-background"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <IconEyeOff className="h-4 w-4" />
                  ) : (
                    <IconEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 w-full rounded-xl font-semibold shadow-md shadow-primary/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-primary/35"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconArrowLeft className="h-3.5 w-3.5" />
              Kembali ke halaman utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
