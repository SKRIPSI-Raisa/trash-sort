"use client"

import * as React from "react"
import { notFound, useRouter } from "next/navigation"
import { getHistoryItemById, deleteHistoryItem } from "@/lib/api"
import { ClassificationResult } from "@/lib/types"
import { WasteBadge } from "@/components/waste-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { NeighborViewer } from "@/components/neighbor-viewer"
import { WasteGuideCard } from "@/components/waste-guide-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  IconArrowLeft,
  IconDownload,
  IconTrash,
  IconClock,
  IconSettings,
  IconInfoCircle,
  IconAlertCircle,
} from "@tabler/icons-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

type Props = {
  params: Promise<{ id: string }>
}

export default function Page({ params }: Props) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const id = resolvedParams.id

  const [result, setResult] = React.useState<ClassificationResult | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)

  React.useEffect(() => {
    async function loadItem() {
      try {
        const item = await getHistoryItemById(id)
        if (!item) {
          // If not found in localStorage
          notFound()
        } else {
          setResult(item)
        }
      } catch (error) {
        console.error("Failed to load classification details", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    loadItem()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[350px] rounded-xl" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    notFound()
  }

  const handleDelete = async () => {
    try {
      await deleteHistoryItem(result.id)
      toast.success("Klasifikasi berhasil dihapus dari riwayat.")
      router.push("/dashboard/history")
      router.refresh()
    } catch (e) {
      toast.error("Gagal menghapus item.")
      console.error(e)
    }
  }

  const handleDownload = () => {
    const content = `
=============================================
WASTESORT CLASSIFICATION SUMMARY
=============================================
ID Klasifikasi : ${result.id}
Nama File      : ${result.filename}
Hasil Prediksi : ${result.prediction}
Confidence     : ${Math.round(result.confidence * 100)}%
Nilai K        : ${result.k_value}
Waktu Eksekusi : ${result.execution_time_seconds} detik
Metode Fitur   : ${result.features_used.join(" + ")}
Tanggal        : ${new Date(result.created_at).toLocaleString("id-ID")}

=============================================
K NEAREST NEIGHBORS (K-TETANGGA TERDEKAT)
=============================================
${result.neighbors.map(n => `#${n.rank}. Kelas: ${n.label} | Kategori: ${n.category} | Jarak: ${n.distance}`).join("\n")}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `wastesort_summary_${result.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Ringkasan hasil berhasil diunduh.")
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
            <IconArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold truncate max-w-[250px] sm:max-w-md" title={result.filename}>
              {result.filename}
            </h1>
            <span className="text-xs text-muted-foreground">ID: {result.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Download */}
          <Button variant="secondary" onClick={handleDownload} className="rounded-xl">
            <IconDownload className="size-4 mr-2" />
            Unduh Hasil
          </Button>

          {/* Delete Drawer Confirmation */}
          <Drawer open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DrawerTrigger asChild>
              <Button variant="destructive" className="rounded-xl">
                <IconTrash className="size-4 mr-2" />
                Hapus
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
                    <IconAlertCircle className="size-6" />
                  </div>
                  <DrawerTitle>Hapus Hasil Klasifikasi?</DrawerTitle>
                  <DrawerDescription>
                    Tindakan ini tidak dapat dibatalkan. Riwayat klasifikasi untuk gambar ini akan dihapus secara permanen.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button variant="destructive" onClick={handleDelete} className="rounded-xl">
                    Ya, Hapus Permanen
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="rounded-xl">Batal</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image, Prediction info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Image card */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted border-b flex items-center justify-center overflow-hidden">
              <img src={result.original_image_url} alt="Classified Trash" className="max-h-56 object-contain p-2" />
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Kategori Sampah</span>
                <WasteBadge prediction={result.prediction} className="text-sm px-3.5 py-1" />
              </div>
              
              <ConfidenceBar value={result.confidence} prediction={result.prediction} size="md" />
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <IconClock className="size-4" />
                  <span>{result.execution_time_seconds} detik</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
                  <IconSettings className="size-4" />
                  <span>K = {result.k_value} optimal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model info */}
          <Card>
            <CardHeader className="py-4 border-b flex flex-row items-center gap-2">
              <IconInfoCircle className="size-5 text-primary" />
              <CardTitle className="text-sm font-bold">Informasi Model Aktif</CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Model Algoritma:</span>
                <span className="font-semibold text-foreground">KNN (K-Nearest Neighbors)</span>
              </div>
              <div className="flex justify-between">
                <span>Akurasi Model Uji:</span>
                <span className="font-semibold text-foreground">89.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Fitur Visual:</span>
                <span className="font-semibold text-foreground">RGB + GLCM</span>
              </div>
              <div className="flex justify-between">
                <span>Pra-pemrosesan:</span>
                <span className="font-semibold text-foreground">Resize 128x128 RGB</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <WasteGuideCard prediction={result.prediction} />
        </div>
      </div>
    </div>
  )
}
