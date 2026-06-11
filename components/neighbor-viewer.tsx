import * as React from "react"
import { Neighbor } from "@/lib/types"
import { WasteBadge } from "./waste-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NeighborViewerProps {
  neighbors: Neighbor[]
}

export function NeighborViewer({ neighbors }: NeighborViewerProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">K-Tetangga Terdekat (K Nearest Neighbors)</CardTitle>
        <p className="text-xs text-muted-foreground">
          Menampilkan K={neighbors.length} citra referensi terdekat dari dataset pelatihan yang mempengaruhi keputusan klasifikasi.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {neighbors.map((neighbor) => {
            const isOrganic = neighbor.label === "Organik"
            return (
              <div
                key={neighbor.rank}
                className="relative flex flex-col items-center p-2 rounded-xl border bg-card hover:bg-muted/10 hover:shadow-xs transition-all duration-200"
              >
                {/* Rank Badge */}
                <div className="absolute top-1.5 left-1.5 z-10 size-5 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center justify-center">
                  #{neighbor.rank}
                </div>

                {/* SVG/Thumbnail Container */}
                <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center p-3 overflow-hidden border mb-2">
                  <img
                    src={neighbor.thumbnail_url}
                    alt={neighbor.category}
                    className="size-full object-contain filter drop-shadow-xs"
                  />
                </div>

                {/* Details */}
                <div className="text-center w-full space-y-0.5">
                  <span className="font-semibold text-xs truncate block" title={neighbor.category}>
                    {neighbor.category}
                  </span>
                  
                  <div className="flex justify-center py-0.5">
                    <WasteBadge prediction={neighbor.label} className="scale-85 text-[10px] py-0 px-1.5" />
                  </div>
                  
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    d = {neighbor.distance.toFixed(3)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
