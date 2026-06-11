"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  IconRecycle,
  IconUser,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconArrowLeft,
  IconLoader2,
  IconLeaf,
  IconShieldCheck,
  IconHistory,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react"

const LEFT_BENEFITS = [
  { icon: IconLeaf, text: "Identifikasi sampah organik & anorganik" },
  { icon: IconShieldCheck, text: "Data klasifikasi tersimpan aman" },
  { icon: IconHistory, text: "Riwayat lengkap bisa diakses kapan saja" },
]

export default function RegisterPage() {
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
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsLoading(false)
    toast.success("Registrasi Berhasil!")
    router.push("/dashboard")
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
          <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-emerald-400/12 blur-3xl animate-blob" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl animate-blob [animation-delay:4s]" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col p-10">
          {/* Logo */}
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/40">
              <IconRecycle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-white/90">TrashSort AI</span>
          </Link>

          {/* Hero copy */}
          <div className="flex flex-1 flex-col justify-center py-10">
            <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              ✦ Gratis Selamanya
            </span>

            <h2 className="mb-4 text-4xl font-bold leading-tight text-white">
              Mulai{" "}
              <span className="animate-shimmer-text bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">
                Memilah Sampah
              </span>
              <br />
              Lebih Cerdas
            </h2>

            <p className="mb-10 max-w-sm text-sm leading-relaxed text-white/50">
              Buat akun gratis dan mulai mengidentifikasi jenis sampah secara
              otomatis menggunakan teknologi AI berbasis KNN.
            </p>

            {/* Benefit list */}
            <div className="space-y-2.5">
              {LEFT_BENEFITS.map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <b.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-white/65">{b.text}</span>
                  <IconCheck className="ml-auto h-4 w-4 shrink-0 text-emerald-500/60" />
                </div>
              ))}
            </div>
          </div>

          {/* Mini classification preview card */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/30">
              Contoh Hasil Klasifikasi
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <IconTrash className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white/80">Sampah Organik</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">94.3%</span>
                </div>
              </div>
            </div>
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
          <span className="font-bold text-lg">TrashSort AI</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="mb-1.5 text-2xl font-bold tracking-tight">Buat Akun Baru</h1>
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Masuk sekarang
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Lengkap
              </Label>
              <div className="relative">
                <IconUser className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-muted/40 pl-10 text-sm transition-colors focus:bg-background"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Kata Sandi
              </Label>
              <div className="relative">
                <IconLock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-muted/40 pl-10 text-sm transition-colors focus:bg-background"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Konfirmasi Kata Sandi
              </Label>
              <div className="relative">
                <IconLock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-1 h-11 w-full rounded-xl font-semibold shadow-md shadow-primary/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-primary/35"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftarkan Akun...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-7 text-center">
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
