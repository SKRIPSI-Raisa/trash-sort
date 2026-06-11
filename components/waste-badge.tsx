import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface WasteBadgeProps {
  prediction: "Organik" | "Non-Organik"
  className?: string
}

export function WasteBadge({ prediction, className }: WasteBadgeProps) {
  const isOrganic = prediction === "Organik"

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1.5 w-fit",
        isOrganic
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
          : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isOrganic ? "bg-emerald-500 animate-pulse" : "bg-indigo-500"
        )}
      />
      {prediction}
    </Badge>
  )
}
