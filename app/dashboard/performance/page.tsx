"use client"

import * as React from "react"
import { getMetrics } from "@/lib/api"
import { ModelMetrics } from "@/lib/types"
import { MetricCard } from "@/components/metric-card"
import { ConfusionMatrix } from "@/components/confusion-matrix"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Bar, BarChart, Cell } from "recharts"
import {
  IconTarget,
  IconCircleCheck,
  IconRefresh,
  IconAward,
  IconCpu,
  IconDatabase,
  IconCalendar,
  IconHierarchy2,
} from "@tabler/icons-react"

const kCurveConfig = {
  accuracy: {
    label: "Akurasi",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const featureConfig = {
  accuracy: {
    label: "Akurasi",
    color: "#6366f1", // Indigo
  },
} satisfies ChartConfig

export default function Page() {
  const [metrics, setMetrics] = React.useState<ModelMetrics | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getMetrics()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to load model metrics", error)
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  if (loading || !metrics) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-[400px] rounded-xl lg:col-span-2" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    )
  }

  const { accuracy, precision, recall, f1_score, confusion_matrix, k_curve, feature_comparison, model_info } = metrics

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Performa Model KNN</h1>
        <p className="text-muted-foreground text-sm">
          Evaluasi mendalam mengenai performa klasifikasi KNN dan analisis parameter optimalisasi model.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Akurasi Keseluruhan (Accuracy)"
          value={accuracy}
          description="Rasio prediksi benar (Organik & Non-Organik) dibandingkan total seluruh sampel uji."
          icon={<IconTarget className="size-5" />}
        />
        <MetricCard
          title="Presisi (Precision)"
          value={precision}
          description="Mengukur ketepatan model: dari semua sampah yang diprediksi Organik, berapa yang aktualnya Organik."
          icon={<IconCircleCheck className="size-5" />}
          colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          title="Sensitivitas (Recall)"
          value={recall}
          description="Mengukur kemampuan model: dari semua sampah yang aktualnya Organik, berapa yang berhasil dideteksi."
          icon={<IconRefresh className="size-5" />}
          colorClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
        <MetricCard
          title="F1-Score"
          value={f1_score}
          description="Nilai rata-rata harmonis antara Presisi dan Recall untuk mengukur keseimbangan performa model."
          icon={<IconAward className="size-5" />}
          colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Confusion Matrix & Model Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Confusion Matrix */}
        <div className="lg:col-span-2">
          <ConfusionMatrix data={confusion_matrix} />
        </div>

        {/* Model Info Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Spesifikasi Model KNN</CardTitle>
            <CardDescription>
              Detail konfigurasi dan status data pelatihan aktif.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <IconCpu className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Algoritma Klasifikasi</span>
                <span className="font-semibold">{model_info.algorithm}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b pb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <IconHierarchy2 className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Nilai Tetangga Terdekat (K)</span>
                <span className="font-semibold">K = {model_info.k_value} (Optimal)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b pb-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <IconDatabase className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Jumlah Dataset (Latih / Uji)</span>
                <span className="font-semibold">
                  {model_info.train_size} data latih / {model_info.test_size} data uji
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <IconCalendar className="size-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Pelatihan Terakhir</span>
                <span className="font-semibold">
                  {new Date(model_info.trained_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimasi K & Ekstraksi Fitur Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* K Optimization Curve */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Kurva Optimasi Nilai K (K-Optimization)</CardTitle>
            <CardDescription>
              Menunjukkan perbandingan akurasi validasi terhadap nilai K. Akurasi puncak tercapai pada <strong>K=7 ({accuracy * 100}%)</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer config={kCurveConfig} className="aspect-auto h-[260px] w-full">
              <LineChart data={k_curve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="k" tickLine={false} axisLine={false} tickMargin={8} label={{ value: "Nilai K", position: "insideBottom", offset: -5, className: "text-xs font-semibold fill-muted-foreground" }} />
                <YAxis
                  domain={[0.75, 0.95]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(val) => `${Math.round(val * 100)}%`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(val) => `Jumlah Tetangga (K) = ${val}`}
                      indicator="line"
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--color-accuracy)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Feature Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Perbandingan Akurasi Metode Ekstraksi Fitur</CardTitle>
            <CardDescription>
              Akurasi klasifikasi berdasarkan fitur visual yang diekstrak. Kombinasi <strong>Color Histogram & LBP</strong> memberikan hasil terbaik.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer config={featureConfig} className="aspect-auto h-[260px] w-full">
              <BarChart data={feature_comparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="method" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(val) => val.split(" ")[0]} />
                <YAxis
                  domain={[0.7, 1.0]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(val) => `${Math.round(val * 100)}%`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                    />
                  }
                />
                <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={[6, 6, 0, 0]}>
                  {feature_comparison.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.method.includes("Combined") ? "var(--primary)" : "#818cf8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
