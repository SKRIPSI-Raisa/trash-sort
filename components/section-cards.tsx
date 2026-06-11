"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  IconTrendingUp,
  IconLeaf,
  IconTrash,
  IconHistory,
  IconCpu,
} from "@tabler/icons-react"

interface SectionCardsProps {
  total: number
  organic: number
  nonOrganic: number
  accuracy: number
}

export function SectionCards({ total, organic, nonOrganic, accuracy }: SectionCardsProps) {
  const organicPercent = total > 0 ? Math.round((organic / total) * 100) : 0
  const nonOrganicPercent = total > 0 ? Math.round((nonOrganic / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2 lg:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Total Klasifikasi */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-medium">Total Klasifikasi</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            {total}
          </CardTitle>
          <CardAction>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <IconHistory className="size-5" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <IconTrendingUp className="size-4" />
            Aktif & Responsif
          </div>
          <div className="text-muted-foreground">Jumlah gambar yang diproses</div>
        </CardFooter>
      </Card>

      {/* Sampah Organik */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-medium">Sampah Organik</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            {organic}
          </CardTitle>
          <CardAction>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <IconLeaf className="size-5" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-1.5 font-medium">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-none">
              {organicPercent}% dari total
            </Badge>
          </div>
          <div className="text-muted-foreground">Siap diolah menjadi kompos</div>
        </CardFooter>
      </Card>

      {/* Sampah Non-Organik */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-medium">Sampah Non-Organik</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            {nonOrganic}
          </CardTitle>
          <CardAction>
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <IconTrash className="size-5" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-1.5 font-medium">
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-none">
              {nonOrganicPercent}% dari total
            </Badge>
          </div>
          <div className="text-muted-foreground">Siap dipilah untuk daur ulang</div>
        </CardFooter>
      </Card>

      {/* Akurasi Model */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-medium">Akurasi Model KNN</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            {(accuracy * 100).toFixed(1)}%
          </CardTitle>
          <CardAction>
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <IconCpu className="size-5" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
            Status: Optimal (K=7)
          </div>
          <div className="text-muted-foreground">Akurasi pada dataset uji</div>
        </CardFooter>
      </Card>
    </div>
  )
}
