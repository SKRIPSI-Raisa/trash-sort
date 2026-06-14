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
              <span className="font-bold text-lg tracking-tight">TrashSort</span>
            </Link>

            {/* Desktop nav */}


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
                {/*<Link href="/register">Daftar Gratis</Link>*/}
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
              Sampah
            </span>
            <br className="hidden sm:block" />

          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-up [animation-delay:160ms]">
            Identifikasi sampah {" "}
            <span className="font-semibold text-foreground">organik & non-organik </span> secara cepat dan mudah
            untuk mendukung pengelolaan sampah yang lebih baik serta menciptakan lingkungan yang lebih bersih
          </p>

          {/* CTA row */}
          <div className="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up [animation-delay:240ms]">
            <Button
              size="lg"
              className="h-13 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] transition-all duration-300"
              asChild
            >
              <Link href="/dashboard/classification">
                Mulai Klasifikasi
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>


        </div>

        {/* Bottom gradient fade */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
        />
      </section>

      {/* ── Features Bento Grid ── */}


      {/* ── How it Works ── */}


      {/* ── Technology ── */}

      {/* ── Social Proof / Highlight ── */}


      {/* ── Final CTA ── */}


      {/* ── Footer ── */}

    </div>
  )
}
