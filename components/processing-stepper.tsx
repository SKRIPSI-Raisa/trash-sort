import * as React from "react"
import { cn } from "@/lib/utils"
import { IconCheck, IconLoader2 } from "@tabler/icons-react"

interface Step {
  label: string
  description: string
}

interface ProcessingStepperProps {
  currentStep: number // 1 to 5
}

const steps: Step[] = [
  { label: "Citra Diterima", description: "Format RGB tervalidasi" },
  { label: "Preprocessing", description: "Resize ke 128x128 & normalisasi" },
  { label: "Ekstraksi Fitur RGB & GLCM", description: "Ekstraksi fitur visual" },
  { label: "Normalisasi Fitur", description: "Normalisasi fitur" },
  { label: "Klasifikasi menggunakan KNN", description: "Klasifikasi tetangga terdekat" },
  { label: "Hasil Klasifikasi", description: "Penetapan kategori akhir" },
]

export function ProcessingStepper({ currentStep }: ProcessingStepperProps) {
  return (
    <div className="w-full py-4">
      <div className="relative flex flex-col md:flex-row md:justify-between gap-6 md:gap-4">
        {/* Connection Line for Desktop */}
        <div className="absolute top-5 left-6 right-6 hidden md:block h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100)}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const stepNum = idx + 1
          const isCompleted = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isPending = stepNum > currentStep

          return (
            <div
              key={step.label}
              className="flex md:flex-col items-start md:items-center md:text-center gap-4 md:gap-2 flex-1 group"
            >
              {/* Step Circle */}
              <div
                className={cn(
                  "size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-sm shrink-0",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : isActive
                    ? "bg-background border-primary text-primary animate-pulse shadow-md"
                    : "bg-background border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <IconCheck className="size-5" />
                ) : isActive ? (
                  <IconLoader2 className="size-5 animate-spin" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="flex flex-col md:items-center">
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors duration-300",
                    isActive ? "text-primary font-bold" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
