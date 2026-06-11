"use client"

import * as React from "react"
import Link from "next/link"
import { getHistory, getMetrics } from "@/lib/api"
import { ClassificationResult, ModelMetrics } from "@/lib/types"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { WasteBadge } from "@/components/waste-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { IconRecycle, IconArrowRight, IconInfoCircle } from "@tabler/icons-react"

export default function Page() {
  const [history, setHistory] = React.useState<ClassificationResult[]>([])
  const [metrics, setMetrics] = React.useState<ModelMetrics | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadData() {
      try {
        const histData = await getHistory()
        const metricsData = await getMetrics()
        setHistory(histData)
        setMetrics(metricsData)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-[380px] rounded-xl lg:col-span-2" />
          <Skeleton className="h-[380px] rounded-xl" />
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    )
  }

  const total = history.length
  const organic = history.filter((item) => item.prediction === "Organik").length
  const nonOrganic = history.filter((item) => item.prediction === "Non-Organik").length
  const accuracy = metrics?.accuracy || 0.895

  // Take latest 5 items for the table
  const recentItems = history.slice(0, 5)

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Ringkasan Sistem</h1>
        <p className="text-muted-foreground text-sm">
          Pantau ringkasan aktivitas klasifikasi dan efisiensi model klasifikasi WasteSort.
        </p>
      </div>

      {/* R1 Section Cards */}
      <SectionCards total={total} organic={organic} nonOrganic={nonOrganic} accuracy={accuracy} />

      {/* Interactive Charts & Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          <ChartAreaInteractive history={history} />
        </div>

        {/* Quick Actions & Fact Cards */}
        <div className="flex flex-col gap-6">
          {/* Quick Action Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 flex flex-col justify-between h-full">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-2">
                <IconRecycle className="size-6" />
              </div>
              <CardTitle className="text-lg font-bold">Mulai Klasifikasi Baru</CardTitle>
              <CardDescription>
                Unggah foto sampah rumah tangga Anda dan biarkan model KNN kami memilahnya secara instan.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild className="w-full rounded-xl" size="lg">
                <Link href="/dashboard/classification">
                  Klasifikasikan Sekarang
                  <IconArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Fact Card */}
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <IconInfoCircle className="size-4" />
                Edukasi Sampah
              </div>
              <CardTitle className="text-base font-bold mt-1">Mengapa Memilah Sampah?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Memilah sampah organik dan non-organik di rumah dapat meningkatkan tingkat keberhasilan daur ulang hingga <strong>80%</strong>.
              </p>
              <p>
                Sampah organik yang tercampur sampah plastik akan membusuk dalam keadaan anaerobik di TPA, melepaskan gas metana yang berbahaya bagi iklim.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Classifications Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Klasifikasi Terbaru</CardTitle>
            <CardDescription>
              Menampilkan 5 aktivitas klasifikasi citra sampah terakhir.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/history" className="flex items-center gap-1">
              Lihat Semua
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentItems.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              Belum ada riwayat klasifikasi. Mulai dengan melakukan klasifikasi baru!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs font-semibold uppercase text-muted-foreground">
                    <th className="p-4 w-16">Pratinjau</th>
                    <th className="p-4">Nama File</th>
                    <th className="p-4">Prediksi</th>
                    <th className="p-4">Confidence</th>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {recentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="size-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                          <img
                            src={item.original_image_url}
                            alt={item.filename}
                            className="size-full object-contain p-1"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-medium max-w-[200px] truncate" title={item.filename}>
                        {item.filename}
                      </td>
                      <td className="p-4">
                        <WasteBadge prediction={item.prediction} />
                      </td>
                      <td className="p-4 min-w-[150px]">
                        <ConfidenceBar value={item.confidence} prediction={item.prediction} showText={false} size="sm" />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" asChild className="rounded-lg">
                          <Link href={`/dashboard/classification/${item.id}`}>Detail</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
