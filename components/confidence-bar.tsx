import * as React from "react"
import { cn } from "@/lib/utils"

interface ConfidenceBarProps {
  value: number // 0 to 1
  prediction: "Organik" | "Non-Organik"
  showText?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ConfidenceBar({
  value,
  prediction,
  showText = true,
  className,
  size = "md",
}: ConfidenceBarProps) {
  const percentage = Math.round(value * 100)
  const isOrganic = prediction === "Organik"

  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }[size]

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {showText && (
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Tingkat Keyakinan (Confidence)</span>
          <span className={cn(isOrganic ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400")}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-secondary overflow-hidden", heightClass)}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            isOrganic
              ? "bg-emerald-500 dark:bg-emerald-400"
              : "bg-indigo-500 dark:bg-indigo-400"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
