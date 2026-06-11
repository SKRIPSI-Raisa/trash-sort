"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ClassificationResult } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface ChartProps {
  history: ClassificationResult[]
}

const chartConfig = {
  classifications: {
    label: "Klasifikasi",
  },
  organic: {
    label: "Organik",
    color: "#10b981", // Emerald
  },
  nonOrganic: {
    label: "Non-Organik",
    color: "#6366f1", // Indigo
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ history }: ChartProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("7d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // Process history data dynamically
  const chartData = React.useMemo(() => {
    const dataMap: Record<string, { date: string; organic: number; nonOrganic: number }> = {}
    
    // Determine number of days to show
    let days = 7
    if (timeRange === "30d") days = 30
    if (timeRange === "90d") days = 90

    // Set today as reference (June 12, 2026 based on metadata)
    const referenceDate = new Date("2026-06-12")
    
    // Initialize dates with 0 values
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(referenceDate)
      d.setDate(referenceDate.getDate() - i)
      const dateString = d.toISOString().split("T")[0]
      dataMap[dateString] = {
        date: dateString,
        organic: 0,
        nonOrganic: 0,
      }
    }

    // Populate counts from history
    history.forEach((item) => {
      const itemDate = item.created_at.split("T")[0]
      if (dataMap[itemDate]) {
        if (item.prediction === "Organik") {
          dataMap[itemDate].organic += 1
        } else {
          dataMap[itemDate].nonOrganic += 1
        }
      }
    })

    return Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date))
  }, [history, timeRange])

  // Calculate totals for description
  const totals = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => {
        return {
          organic: acc.organic + curr.organic,
          nonOrganic: acc.nonOrganic + curr.nonOrganic,
        }
      },
      { organic: 0, nonOrganic: 0 }
    )
  }, [chartData])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Tren Klasifikasi Sampah</CardTitle>
        <CardDescription>
          Menampilkan tren harian sampah Organik vs Non-Organik. Total periode ini:{" "}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{totals.organic} Organik</span>
          {" & "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{totals.nonOrganic} Non-Organik</span>.
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(val) => val && setTimeRange(val)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">7 Hari Terakhir</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 Hari Terakhir</ToggleGroupItem>
            <ToggleGroupItem value="90d">90 Hari Terakhir</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Pilih Periode"
            >
              <SelectValue placeholder="7 Hari Terakhir" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                7 Hari Terakhir
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 Hari Terakhir
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                90 Hari Terakhir
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillOrganic" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#10b981"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="#10b981"
                  stopOpacity={0.01}
                />
              </linearGradient>
              <linearGradient id="fillNonOrganic" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#6366f1"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="#6366f1"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="organic"
              name="organic"
              type="monotone"
              fill="url(#fillOrganic)"
              stroke="#10b981"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="nonOrganic"
              name="nonOrganic"
              type="monotone"
              fill="url(#fillNonOrganic)"
              stroke="#6366f1"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
