import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  colorClass?: string
}

export function MetricCard({ title, value, description, icon, colorClass }: MetricCardProps) {
  const percentage = (value * 100).toFixed(1)

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardDescription className="text-sm font-semibold text-muted-foreground">{title}</CardDescription>
        <div className={cn("p-2 rounded-xl bg-primary/10 text-primary", colorClass)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight">{percentage}%</div>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
