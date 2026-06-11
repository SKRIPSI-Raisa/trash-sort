import * as React from "react"
import { ConfusionMatrix as CMType } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ConfusionMatrixProps {
  data: CMType
}

export function ConfusionMatrix({ data }: ConfusionMatrixProps) {
  const { tp, tn, fp, fn } = data
  const total = tp + tn + fp + fn
  
  const tpPercent = Math.round((tp / total) * 100)
  const tnPercent = Math.round((tn / total) * 100)
  const fpPercent = Math.round((fp / total) * 100)
  const fnPercent = Math.round((fn / total) * 100)

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Confusion Matrix (2×2)</CardTitle>
        <CardDescription>
          Mengukur kecocokan antara kelas Aktual vs kelas Prediksi model KNN. Total sampel uji: {total}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-4">
        {/* Matrix Wrapper */}
        <div className="w-full max-w-[420px] grid grid-cols-[auto_1fr_1fr] gap-2 items-center text-center text-sm font-semibold">
          {/* Top Label: PREDICTED CLASS */}
          <div className="col-span-3 pb-2 text-xs text-muted-foreground uppercase tracking-wider font-bold">
            Kelas Prediksi (Predicted)
          </div>

          {/* Empty corner */}
          <div></div>
          <div className="py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Organik</div>
          <div className="py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Non-Organik</div>

          {/* Row 1: Actual Organik */}
          <div className="pr-3 text-left text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase vertical-text flex items-center justify-end">
            <span>Aktual: Org</span>
          </div>
          
          {/* TP Cell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="aspect-square bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all rounded-xl flex flex-col items-center justify-center cursor-help p-3">
                <span className="text-2xl font-bold">{tp}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1">True Positive (TP)</span>
                <span className="text-xs font-semibold opacity-70">{tpPercent}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-xs space-y-1">
              <p className="font-bold text-emerald-500">True Positive (TP)</p>
              <p className="text-xs text-muted-foreground">
                Sistem memprediksi <strong>Organik</strong> dan data aktual memang <strong>Organik</strong>.
              </p>
            </TooltipContent>
          </Tooltip>

          {/* FN Cell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="aspect-square bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all rounded-xl flex flex-col items-center justify-center cursor-help p-3">
                <span className="text-2xl font-bold">{fn}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1">False Negative (FN)</span>
                <span className="text-xs font-semibold opacity-70">{fnPercent}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-xs space-y-1">
              <p className="font-bold text-destructive">False Negative (FN)</p>
              <p className="text-xs text-muted-foreground">
                Sistem memprediksi <strong>Non-Organik</strong> padahal data aktual adalah <strong>Organik</strong>.
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Row 2: Actual Non-Organik */}
          <div className="pr-3 text-left text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase vertical-text flex items-center justify-end">
            <span>Aktual: Non</span>
          </div>

          {/* FP Cell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="aspect-square bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all rounded-xl flex flex-col items-center justify-center cursor-help p-3">
                <span className="text-2xl font-bold">{fp}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1">False Positive (FP)</span>
                <span className="text-xs font-semibold opacity-70">{fpPercent}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-xs space-y-1">
              <p className="font-bold text-destructive">False Positive (FP)</p>
              <p className="text-xs text-muted-foreground">
                Sistem memprediksi <strong>Organik</strong> padahal data aktual adalah <strong>Non-Organik</strong>.
              </p>
            </TooltipContent>
          </Tooltip>

          {/* TN Cell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="aspect-square bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all rounded-xl flex flex-col items-center justify-center cursor-help p-3">
                <span className="text-2xl font-bold">{tn}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1">True Negative (TN)</span>
                <span className="text-xs font-semibold opacity-70">{tnPercent}%</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-xs space-y-1">
              <p className="font-bold text-indigo-500">True Negative (TN)</p>
              <p className="text-xs text-muted-foreground">
                Sistem memprediksi <strong>Non-Organik</strong> dan data aktual memang <strong>Non-Organik</strong>.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  )
}
