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
    <div className="grid grid-cols-2 gap-3 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6 dark:*:data-[slot=card]:bg-card">
      {/* Total Klasifikasi */}
      <Card className="@container/card aspect-square md:aspect-auto flex flex-col justify-between [--card-spacing:0.75rem] md:[--card-spacing:1.125rem]">
        <CardHeader>
          <CardDescription className="font-medium text-[10px] md:text-xs truncate">Total Klasifikasi</CardDescription>
          <CardTitle className="text-xl font-bold tabular-nums md:text-2xl lg:text-3xl">
            {total}
          </CardTitle>
          <CardAction>
            <div className="p-1.5 md:p-2 bg-primary/10 text-primary rounded-lg">
              <IconHistory className="size-4 md:size-5" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 text-xs md:text-sm">
          <div className="line-clamp-1 flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs">
            <IconTrendingUp className="size-3.5 md:size-4" />
            Aktif & Responsif
          </div>
          <div className="text-muted-foreground text-[9px] md:text-xs hidden sm:block">Jumlah gambar yang diproses</div>
        </CardFooter>
      </Card>

      {/* Sampah Organik */}
      <Card className="@container/card aspect-square md:aspect-auto flex flex-col justify-between [--card-spacing:0.75rem] md:[--card-spacing:1.125rem]">
        <CardHeader>
          <CardDescription className="font-medium text-[10px] md:text-xs truncate">Sampah Organik</CardDescription>
          <CardTitle className="text-xl font-bold tabular-nums md:text-2xl lg:text-3xl">
            {organic}
          </CardTitle>
          <CardAction>
            <div className="p-1.5 md:p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <IconLeaf className="size-4 md:size-5" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 text-xs md:text-sm">
          <div className="flex items-center gap-1 font-medium">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-none px-1.5 py-0 text-[9px] md:text-xs">
              {organicPercent}% dari total
            </Badge>
          </div>
          <div className="text-muted-foreground text-[9px] md:text-xs hidden sm:block">Siap diolah menjadi kompos</div>
        </CardFooter>
      </Card>

      {/* Sampah Non-Organik */}
      <Card className="@container/card aspect-square md:aspect-auto flex flex-col justify-between [--card-spacing:0.75rem] md:[--card-spacing:1.125rem]">
        <CardHeader>
          <CardDescription className="font-medium text-[10px] md:text-xs truncate">Sampah Non-Organik</CardDescription>
          <CardTitle className="text-xl font-bold tabular-nums md:text-2xl lg:text-3xl">
            {nonOrganic}
          </CardTitle>
          <CardAction>
            <div className="p-1.5 md:p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <IconTrash className="size-4 md:size-5" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 text-xs md:text-sm">
          <div className="flex items-center gap-1 font-medium">
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-none px-1.5 py-0 text-[9px] md:text-xs">
              {nonOrganicPercent}% dari total
            </Badge>
          </div>
          <div className="text-muted-foreground text-[9px] md:text-xs hidden sm:block">Siap dipilah untuk daur ulang</div>
        </CardFooter>
      </Card>

      {/* Akurasi Model */}
      <Card className="@container/card aspect-square md:aspect-auto flex flex-col justify-between [--card-spacing:0.75rem] md:[--card-spacing:1.125rem]">
        <CardHeader>
          <CardDescription className="font-medium text-[10px] md:text-xs truncate">Akurasi Model KNN</CardDescription>
          <CardTitle className="text-xl font-bold tabular-nums md:text-2xl lg:text-3xl">
            {(accuracy * 100).toFixed(1)}%
          </CardTitle>
          <CardAction>
            <div className="p-1.5 md:p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <IconCpu className="size-4 md:size-5" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-0.5 text-xs md:text-sm">
          <div className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400 text-[10px] md:text-xs">
            Status: K=7 Optimal
          </div>
          <div className="text-muted-foreground text-[9px] md:text-xs hidden sm:block">Akurasi pada dataset uji</div>
        </CardFooter>
      </Card>
    </div>
  )
}
