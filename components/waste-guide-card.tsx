import * as React from "react"
import { mockGuides } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconLeaf, IconRecycle, IconArrowRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface WasteGuideCardProps {
  prediction: "Organik" | "Non-Organik"
}

export function WasteGuideCard({ prediction }: WasteGuideCardProps) {
  const guide = mockGuides.find((g) => g.type === prediction)

  if (!guide) return null

  const isOrganic = prediction === "Organik"

  return (
    <Card className={cn(
      "border-l-4",
      isOrganic ? "border-l-emerald-500" : "border-l-indigo-500"
    )}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {isOrganic ? (
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconLeaf className="size-5" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <IconRecycle className="size-5" />
            </div>
          )}
          <div>
            <CardTitle className="text-base font-bold">Rekomendasi Pengelolaan Sampah</CardTitle>
            <CardDescription className="text-xs">
              Cara cerdas mengolah kategori sampah {prediction}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 text-sm">
        <p className="text-muted-foreground leading-relaxed">
          {guide.description}
        </p>

        {/* Contoh */}
        <div>
          <h4 className="font-semibold text-foreground mb-1.5">Contoh Barang Serupa:</h4>
          <div className="flex flex-wrap gap-1.5">
            {guide.examples.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs bg-muted text-muted-foreground border border-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Langkah-langkah */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">Langkah Pengolahan Rekomendasi:</h4>
          <ol className="space-y-2.5 pl-1">
            {guide.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className={cn(
                  "size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                  isOrganic ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400"
                )}>
                  {idx + 1}
                </span>
                <span className="text-muted-foreground leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
