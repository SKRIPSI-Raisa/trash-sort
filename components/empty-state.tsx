import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconSearch } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-muted-foreground/20 rounded-2xl bg-card min-h-[300px]",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon || <IconSearch className="size-6" />}
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild className="mt-5 rounded-xl px-5" size="sm">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
