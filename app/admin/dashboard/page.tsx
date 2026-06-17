"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllHistory } from "@/lib/api"
import { ClassificationResult } from "@/lib/types"
import { WasteBadge } from "@/components/waste-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import {
  IconUsers,
  IconRecycle,
  IconChartBar,
  IconHistory,
  IconArrowRight,
  IconBrain,
  IconLeaf,
  IconPackage
} from "@tabler/icons-react"

export default function AdminDashboard() {
  const [history, setHistory] = React.useState<ClassificationResult[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAllHistory()
        setHistory(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Stats calculation
  const totalScans = history.length
  const organicCount = history.filter(h => h.prediction === "Organik").length
  const nonOrganicCount = totalScans - organicCount
  const avgConfidence = totalScans > 0
    ? history.reduce((acc, curr) => acc + curr.confidence, 0) / totalScans
    : 0

  const recentHistory = history.slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-6 px-4 lg:px-6 animate-pulse">
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-80 rounded-2xl mt-6" />
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 lg:px-6 pb-10">
      {/* Header section with gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-background p-8 md:p-10 border border-emerald-900/50 shadow-2xl shadow-emerald-900/20">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: "radial-gradient(circle, rgba(52,211,153,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <IconRecycle className="size-3.5" />
            TrashSort Admin
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Dashboard Utama
          </h1>
          <p className="text-emerald-100/70 text-sm md:text-base leading-relaxed">
            Pantau ringkasan seluruh aktivitas sistem, statistik klasifikasi sampah secara real-time, dan evaluasi performa model.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Scans */}
        <Card className="rounded-2xl border-white/5 bg-white/5 backdrop-blur-sm shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-20">
            <IconRecycle className="size-16" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Total Klasifikasi</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{totalScans}</span>
                <span className="text-xs font-medium text-emerald-500">Gambar</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg Confidence */}
        <Card className="rounded-2xl border-white/5 bg-white/5 backdrop-blur-sm shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-20">
            <IconBrain className="size-16" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Rata-rata Confidence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{(avgConfidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted mt-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${avgConfidence * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organic */}
        <Card className="rounded-2xl border-emerald-500/10 bg-gradient-to-b from-emerald-500/5 to-transparent backdrop-blur-sm shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 text-emerald-500 transition-transform group-hover:scale-110 group-hover:opacity-20">
            <IconLeaf className="size-16" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Sampah Organik</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-emerald-400">{organicCount}</span>
                {totalScans > 0 && <span className="text-xs font-medium text-emerald-500/70">({Math.round((organicCount / totalScans) * 100)}%)</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Non-Organic */}
        <Card className="rounded-2xl border-blue-500/10 bg-gradient-to-b from-blue-500/5 to-transparent backdrop-blur-sm shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 text-blue-500 transition-transform group-hover:scale-110 group-hover:opacity-20">
            <IconPackage className="size-16" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Sampah Non-Organik</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-blue-400">{nonOrganicCount}</span>
                {totalScans > 0 && <span className="text-xs font-medium text-blue-500/70">({Math.round((nonOrganicCount / totalScans) * 100)}%)</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Classifications Table */}
        <Card className="md:col-span-2 rounded-2xl border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/20 border-b flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">Klasifikasi Terbaru</CardTitle>
              <CardDescription>5 data gambar terakhir yang diproses sistem.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-xl hidden sm:flex">
              <Link href="/admin/history">
                Lihat Semua <IconArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentHistory.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Belum ada data klasifikasi.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/10 text-xs uppercase text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-4 w-12">Gambar</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Confidence</th>
                      <th className="p-4 text-right">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {recentHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                        <td className="p-4">
                          <div className="size-10 rounded-xl overflow-hidden bg-muted border">
                            <img src={item.original_image_url} alt="scan" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          <WasteBadge prediction={item.prediction} />
                        </td>
                        <td className="p-4 w-40">
                          <ConfidenceBar value={item.confidence} prediction={item.prediction} showText={false} size="sm" />
                          <span className="text-[10px] text-muted-foreground mt-1">{Math.round(item.confidence * 100)}%</span>
                        </td>
                        <td className="p-4 text-right text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(item.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="p-4 border-t bg-muted/10 sm:hidden">
              <Button variant="outline" size="sm" className="w-full rounded-xl" asChild>
                <Link href="/admin/history">Lihat Semua Riwayat</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="flex flex-col gap-4">
          <Link href="/admin/history">
            <Card className="hover:bg-muted/50 hover:border-emerald-500/30 hover:shadow-emerald-500/10 transition-all cursor-pointer h-full border-border/50 shadow-md group rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconHistory className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Riwayat Lengkap</h3>
                  <p className="text-sm text-muted-foreground">Akses dan kelola seluruh riwayat klasifikasi, ekspor ke CSV, atau bersihkan data.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/performance">
            <Card className="hover:bg-muted/50 hover:border-blue-500/30 hover:shadow-blue-500/10 transition-all cursor-pointer h-full border-border/50 shadow-md group rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconChartBar className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Evaluasi Performa</h3>
                  <p className="text-sm text-muted-foreground">Lihat metrik akurasi model, confusion matrix, dan performa KNN.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
