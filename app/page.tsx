"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconRecycle,
  IconBrain,
  IconCamera,
  IconChartBar,
  IconArrowRight,
  IconCheck,
  IconHistory,
  IconBook,
  IconBolt,
  IconMenu2,
  IconX,
  IconAward,
  IconEye,
  IconDatabase,
  IconArrowUpRight,
  IconTrash,
  IconCircleCheck,
} from "@tabler/icons-react"

// ─────────────────────────────────────────────
// MagicUI Primitives
// ─────────────────────────────────────────────

function NumberTicker({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number
  suffix?: string
  prefix?: string
}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let startTime: number | null = null
    const duration = 1800
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, value])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

function Meteors({ number = 12 }: { number?: number }) {
  const [mounted, setMounted] = useState(false)
  const meteors = useRef(
    Array.from({ length: number }, (_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 80)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
      duration: `${(Math.random() * 5 + 4).toFixed(2)}s`,
    }))
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {meteors.current.map((m) => (
        <span
          key={m.id}
          className="absolute h-px w-px animate-meteor pointer-events-none"
          style={{
            top: m.top,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        >
          <span className="absolute left-0 top-0 h-px w-20 bg-gradient-to-r from-emerald-400/80 to-transparent" />
        </span>
      ))}
    </>
  )
}

function GridPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 pointer-events-none",
        "[mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_0%,black_70%)]",
        className
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle, oklch(0.527 0.154 150.069 / 0.12) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  )
}

function GlowCard({
  children,
  className,
  glowColor = "emerald",
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
}) {
  return (
    <div className={cn("group relative", className)}>
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/50 to-teal-500/50 opacity-0 transition-all duration-500 group-hover:opacity-100 blur-sm" />
      <div className="relative h-full rounded-2xl border border-border bg-card">
        {children}
      </div>
    </div>
  )
}

function AnimatedBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full animate-[shimmer-text_2.5s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
      />
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mb-4">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {children}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// Landing Page
// ─────────────────────────────────────────────

const FEATURES = [
  {
    icon: IconCamera,
    title: "Klasifikasi Instan",
    desc: "Upload foto sampah dan dapatkan klasifikasi organik / anorganik dalam hitungan detik menggunakan model KNN.",
    large: true,
    accent: "from-emerald-500/10 to-teal-500/5",
  },
  {
    icon: IconAward,
    title: "Akurasi Tinggi",
    desc: "Model KNN dioptimasi pada K=7 dengan akurasi lebih dari 95%.",
    large: false,
    accent: "from-green-500/10 to-emerald-500/5",
  },
  {
    icon: IconHistory,
    title: "Riwayat Lengkap",
    desc: "Semua hasil klasifikasi tersimpan otomatis dan bisa diakses kapan saja.",
    large: false,
    accent: "from-teal-500/10 to-cyan-500/5",
  },
  {
    icon: IconBook,
    title: "Panduan Edukasi",
    desc: "Pelajari cara mengelola setiap jenis sampah dengan panduan interaktif yang komprehensif.",
    large: false,
    accent: "from-emerald-500/10 to-green-500/5",
  },
  {
    icon: IconChartBar,
    title: "Analisis Performa",
    desc: "Pantau metrik model secara real-time: akurasi, presisi, recall, F1-score, dan confusion matrix.",
    large: true,
    accent: "from-teal-500/10 to-emerald-500/5",
  },
]

const STEPS = [
  {
    number: "01",
    icon: IconCamera,
    title: "Upload Foto Sampah",
    desc: "Ambil atau unggah foto sampah yang ingin diklasifikasi dari perangkat Anda.",
  },
  {
    number: "02",
    icon: IconBrain,
    title: "Analisis KNN",
    desc: "Algoritma K-Nearest Neighbor menganalisis fitur gambar dan menemukan 7 tetangga terdekat di dataset.",
  },
  {
    number: "03",
    icon: IconCircleCheck,
    title: "Hasil & Rekomendasi",
    desc: "Dapatkan klasifikasi akurat beserta rekomendasi cara pengelolaan sampah yang tepat.",
  },
]

const TECH_STATS = [
  { label: "Akurasi Model", value: 95, suffix: "%" },
  { label: "K Tetangga Optimal", value: 7, suffix: "" },
  { label: "Kategori Sampah", value: 2, suffix: "" },
  { label: "Fitur Ekstraksi", value: 512, suffix: "+" },
]

const WASTE_TYPES = [
  { label: "Organik", color: "bg-green-500", items: ["Sisa Makanan", "Daun", "Kertas", "Kayu"] },
  { label: "Anorganik", color: "bg-blue-500", items: ["Plastik", "Logam", "Kaca", "Karet"] },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary transition-transform duration-300 group-hover:scale-110">
                <IconRecycle className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight">TrashSort AI</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-8 md:flex">
              {[
                { label: "Fitur", href: "#features" },
                { label: "Cara Kerja", href: "#how-it-works" },
                { label: "Teknologi", href: "#technology" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="hidden items-center gap-3 md:flex">
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-full px-5 shadow-md shadow-primary/20 hover:shadow-primary/35 transition-shadow"
                asChild
              >
                <Link href="/register">Daftar Gratis</Link>
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              className="rounded-lg p-2 hover:bg-muted md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconMenu2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
            <div className="space-y-3 px-4 py-4">
              {["Fitur", "Cara Kerja", "Teknologi"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(" ", "-")}`}
                  className="block text-sm text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-full" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button size="sm" className="flex-1 rounded-full" asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* BG layers */}
        <div className="absolute inset-0" aria-hidden>
          <GridPattern />
          {/* Animated blobs */}
          <div className="absolute left-[15%] top-[20%] h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl animate-blob" />
          <div className="absolute right-[15%] bottom-[20%] h-96 w-96 rounded-full bg-teal-400/12 blur-3xl animate-blob [animation-delay:2.5s]" />
          <div className="absolute left-[50%] top-[60%] h-64 w-64 -translate-x-1/2 rounded-full bg-green-400/10 blur-3xl animate-blob [animation-delay:5s]" />
        </div>

        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Meteors number={14} />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-32 text-center sm:px-6 lg:px-8">
          {/* Top badge */}
          <div className="mb-8 flex justify-center animate-fade-up">
            <AnimatedBadge>
              <IconBolt className="h-3.5 w-3.5" />
              Powered by K-Nearest Neighbor Algorithm
            </AnimatedBadge>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl animate-fade-up [animation-delay:80ms]">
            Klasifikasi{" "}
            <span className="animate-shimmer-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
              Sampah Cerdas
            </span>
            <br className="hidden sm:block" />
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"> dengan Teknologi AI</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-up [animation-delay:160ms]">
            Identifikasi jenis sampah{" "}
            <span className="font-semibold text-foreground">organik & anorganik</span> secara
            instan. Upload foto, dapatkan klasifikasi akurat dari model KNN yang telah
            dioptimasi dengan akurasi &gt;95%.
          </p>

          {/* CTA row */}
          <div className="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up [animation-delay:240ms]">
            <Button
              size="lg"
              className="h-13 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] transition-all duration-300"
              asChild
            >
              <Link href="/register">
                Mulai Klasifikasi Gratis
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-13 rounded-full px-8 text-base border-border/60 hover:bg-muted/50"
              asChild
            >
              <Link href="/login">Sudah Punya Akun?</Link>
            </Button>
          </div>

          {/* Stats cards */}
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4 animate-fade-up [animation-delay:320ms]">
            {TECH_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-2xl border border-border/60 bg-card/60 px-4 py-5 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all duration-300"
              >
                <span className="text-3xl font-bold text-primary">
                  <NumberTicker value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-1 text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
        />
      </section>

      {/* ── Features Bento Grid ── */}
      <section id="features" className="relative py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>Fitur Unggulan</SectionLabel>

          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Semua yang Anda Butuhkan
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Platform lengkap untuk klasifikasi sampah berbasis AI dengan antarmuka yang
              intuitif dan analitik mendalam.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {/* Large card left */}
            <GlowCard className="md:col-span-2 lg:col-span-3 row-span-2">
              <div
                className={cn(
                  "h-full p-8 rounded-2xl bg-gradient-to-br",
                  FEATURES[0].accent
                )}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <IconCamera className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">{FEATURES[0].title}</h3>
                <p className="mb-8 text-muted-foreground leading-relaxed">{FEATURES[0].desc}</p>

                {/* Mini mockup */}
                <div className="rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-muted-foreground">Klasifikasi Sampah</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <span className="text-xs font-medium">Hasil Klasifikasi</span>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Organik
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <span className="text-xs text-muted-foreground">Kepercayaan</span>
                      <span className="text-xs font-medium text-primary">94.3%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-gradient-xy" />
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>

            {/* Small cards */}
            {FEATURES.slice(1, 4).map((f) => (
              <GlowCard key={f.title} className="lg:col-span-2">
                <div className={cn("h-full p-6 rounded-2xl bg-gradient-to-br", f.accent)}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </GlowCard>
            ))}

            {/* Large card right */}
            <GlowCard className="md:col-span-3 lg:col-span-3">
              <div
                className={cn(
                  "h-full p-8 rounded-2xl bg-gradient-to-br",
                  FEATURES[4].accent
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <IconChartBar className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{FEATURES[4].title}</h3>
                <p className="mb-6 text-muted-foreground text-sm leading-relaxed">{FEATURES[4].desc}</p>

                {/* Mini metric bars */}
                <div className="space-y-3">
                  {[
                    { label: "Akurasi", value: 95 },
                    { label: "Presisi", value: 93 },
                    { label: "Recall", value: 97 },
                    { label: "F1-Score", value: 95 },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-xs text-muted-foreground">{m.label}</span>
                      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs font-medium text-primary">
                        {m.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="relative py-28 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-500/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>Cara Kerja</SectionLabel>

          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
              3 Langkah Mudah
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Proses klasifikasi yang sederhana namun didukung teknologi AI canggih.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center text-center group">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute top-10 left-[calc(50%+3.5rem)] hidden w-[calc(100%-7rem)] border-t-2 border-dashed border-border md:block"
                  />
                )}

                {/* Icon circle */}
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary/20 group-hover:scale-110">
                  <step.icon className="h-8 w-8" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA inline */}
          <div className="mt-16 flex justify-center">
            <Button
              size="lg"
              className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/register">
                Coba Sekarang
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Technology ── */}
      <section id="technology" className="relative py-28 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/5 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Left: Text */}
            <div>
              <SectionLabel>Teknologi</SectionLabel>
              <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-5xl">
                Algoritma{" "}
                <span className="animate-shimmer-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                  K-Nearest Neighbor
                </span>
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                KNN bekerja dengan membandingkan fitur gambar sampah yang diunggah dengan
                dataset training. Sistem menemukan <strong className="text-foreground">7 tetangga terdekat</strong> (K=7) dan
                mengklasifikasikan berdasarkan mayoritas kelas.
              </p>

              <div className="mb-8 space-y-3">
                {[
                  "Ekstraksi fitur visual dari gambar",
                  "Perhitungan jarak Euclidean ke dataset",
                  "Pemilihan K=7 tetangga terdekat",
                  "Voting mayoritas menentukan kelas akhir",
                  "Output disertai skor kepercayaan",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <IconCheck className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <Link href="/dashboard/performance">
                  Lihat Performa Model
                  <IconArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right: Visual */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Outer glow ring */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 blur-2xl"
                />

                <div className="relative rounded-3xl border border-border bg-card p-8">
                  <h4 className="mb-6 text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                    Kategori Sampah
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {WASTE_TYPES.map((type) => (
                      <div
                        key={type.label}
                        className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <div className={cn("h-3 w-3 rounded-full", type.color)} />
                          <span className="text-sm font-semibold">{type.label}</span>
                        </div>
                        <div className="space-y-1.5">
                          {type.items.map((item) => (
                            <div
                              key={item}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            >
                              <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KNN illustration */}
                  <div className="mt-6 rounded-2xl border border-border/60 bg-muted/20 p-4">
                    <p className="mb-3 text-center text-xs font-medium text-muted-foreground">
                      Visualisasi K=7 Tetangga Terdekat
                    </p>
                    <div className="relative flex h-28 items-center justify-center">
                      {/* Center point */}
                      <div className="absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-float">
                        <IconTrash className="h-4 w-4" />
                      </div>
                      {/* Orbit ring */}
                      <div className="absolute h-24 w-24 rounded-full border-2 border-dashed border-primary/25 animate-spin-slow" />
                      {/* Neighbor dots */}
                      {Array.from({ length: 7 }).map((_, i) => {
                        const angle = (i / 7) * 2 * Math.PI
                        const r = 42
                        const x = 50 + r * Math.cos(angle)
                        const y = 50 + r * Math.sin(angle)
                        const isOrganic = i % 3 !== 0
                        return (
                          <div
                            key={i}
                            className={cn(
                              "absolute h-4 w-4 rounded-full border-2 border-background shadow-sm",
                              isOrganic ? "bg-green-500" : "bg-blue-500"
                            )}
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        )
                      })}
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground/70 mt-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1" />Organik&nbsp;
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1 ml-2" />Anorganik
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Highlight ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: IconBolt,
                label: "Klasifikasi Cepat",
                desc: "Hasil dalam hitungan detik tanpa proses panjang.",
              },
              {
                icon: IconEye,
                label: "Mudah Digunakan",
                desc: "Antarmuka intuitif, cukup upload foto dan lihat hasilnya.",
              },
              {
                icon: IconDatabase,
                label: "Data Tersimpan",
                desc: "Riwayat klasifikasi tersimpan otomatis di akun Anda.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 hover:bg-card hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.label}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-32 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/8" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/8 blur-3xl" />
          <GridPattern className="opacity-50" />
          <div className="absolute inset-0 overflow-hidden">
            <Meteors number={8} />
          </div>
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20 animate-float">
              <IconRecycle className="h-8 w-8" />
            </div>
          </div>

          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Mulai Klasifikasi{" "}
            <span className="animate-shimmer-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
              Sekarang
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
            Bergabung dan mulai mengidentifikasi sampah secara akurat untuk lingkungan
            yang lebih bersih.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-13 w-full rounded-full px-10 text-base font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.04] transition-all duration-300 sm:w-auto glow-emerald"
              asChild
            >
              <Link href="/register">
                Daftar Gratis Sekarang
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="h-13 rounded-full px-8 text-base hover:bg-muted/60"
              asChild
            >
              <Link href="/login">Sudah punya akun? Masuk →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <IconRecycle className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">TrashSort AI</span>
            </div>

            {/* Nav links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                Daftar
              </Link>
              <a href="#features" className="hover:text-foreground transition-colors">
                Fitur
              </a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">
                Cara Kerja
              </a>
            </nav>

            {/* Caption */}
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} TrashSort AI. Dibuat untuk skripsi penelitian.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
