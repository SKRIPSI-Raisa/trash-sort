"use client"

import * as React from "react"
import { toast } from "sonner"
import { classifyImage, checkApiConnection } from "@/lib/api"
import { ClassificationResult } from "@/lib/types"
import { WasteBadge } from "@/components/waste-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { NeighborViewer } from "@/components/neighbor-viewer"
import { ProcessingStepper } from "@/components/processing-stepper"
import { WasteGuideCard } from "@/components/waste-guide-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CameraCapture } from "@/components/camera-capture"
import {
  IconUpload,
  IconPhoto,
  IconArrowLeft,
  IconDownload,
  IconRefresh,
  IconInfoCircle,
  IconHelpCircle,
  IconClock,
  IconSettings,
  IconCamera,
} from "@tabler/icons-react"


export default function Page() {
  const [file, setFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [appState, setAppState] = React.useState<"upload" | "processing" | "result">("upload")
  const [currentStep, setCurrentStep] = React.useState(1)
  const [result, setResult] = React.useState<ClassificationResult | null>(null)
  
  // API Connection State
  const [apiConnected, setApiConnected] = React.useState<boolean | null>(null)
  const [checkingApi, setCheckingApi] = React.useState(false)
  const [apiDetails, setApiDetails] = React.useState<{ modelStatus?: string; kValue?: number } | null>(null)

  const verifyApiConnection = React.useCallback(async () => {
    setCheckingApi(true)
    try {
      const status = await checkApiConnection()
      setApiConnected(status.connected)
      if (status.connected) {
        setApiDetails({
          modelStatus: status.modelStatus,
          kValue: status.kValue
        })
      } else {
        setApiDetails(null)
      }
    } catch {
      setApiConnected(false)
      setApiDetails(null)
    } finally {
      setCheckingApi(false)
    }
  }, [])

  React.useEffect(() => {
    verifyApiConnection()
  }, [verifyApiConnection])
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Sistem hanya mendukung citra statis format RGB (JPG, PNG, WEBP).")
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (selectedFile.size > maxSize) {
      toast.error("Ukuran file melebihi batas maksimum 10MB.")
      return
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    toast.success("File citra berhasil diunggah.")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleClassify = async () => {
    if (!file) return

    setAppState("processing")
    setCurrentStep(1)

    // Simulate classification pipeline timeline
    const timers = [
      setTimeout(() => setCurrentStep(2), 300),
      setTimeout(() => setCurrentStep(3), 600),
      setTimeout(() => setCurrentStep(4), 900),
      setTimeout(() => setCurrentStep(5), 1200),
    ]

    try {
      // 1.5s total time for classification animation
      const [res] = await Promise.all([
        classifyImage(file),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ])
      
      setResult(res)
      setAppState("result")
      toast.success("Klasifikasi Selesai! Hasil berhasil disimpan ke Riwayat.")
    } catch (error) {
      toast.error("Terjadi kesalahan saat memproses gambar.")
      setAppState("upload")
      console.error(error)
    }

    // Clear timers
    return () => timers.forEach(clearTimeout)
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setAppState("upload")
  }

  const handleDownload = () => {
    if (!result) return
    
    // Create text file summary to download
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Klasifikasi Sampah</h1>
          <p className="text-muted-foreground text-sm">
            Unggah atau ambil foto untuk klasifikasi sampah secara otomatis.
          </p>
        </div>

        {/* API Status Badge */}
        <div className="flex items-center gap-2.5 bg-muted/40 hover:bg-muted/60 border rounded-xl px-3.5 py-1.5 transition-all duration-200 self-start md:self-auto">
          <div className="relative flex h-2.5 w-2.5">
            {checkingApi ? (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            ) : apiConnected ? (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            ) : (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              checkingApi ? "bg-blue-500" : apiConnected ? "bg-emerald-500" : "bg-destructive"
            }`}></span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-tight">
              {checkingApi ? "Memeriksa API..." : apiConnected ? "API Terhubung" : "API Terputus"}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {checkingApi 
                ? "Menghubungi backend..." 
                : apiConnected 
                  ? `FastAPI Aktif (K=${apiDetails?.kValue || 11})` 
                  : "FastAPI Offline"}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground ml-1"
            onClick={verifyApiConnection}
            disabled={checkingApi}
          >
            <IconRefresh className={`h-3.5 w-3.5 ${checkingApi ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh Status</span>
          </Button>
        </div>
      </div>

      {/* STATE A: UPLOAD */}
      {appState === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dropzone / Preview */}
          <div className="lg:col-span-2">
            {!previewUrl ? (
              <div className="space-y-4 animate-fade-in">
                {apiConnected === false && (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive dark:text-destructive-foreground text-xs">
                    <IconInfoCircle className="size-5 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5">API Backend Offline</strong>
                      Klasifikasi memerlukan FastAPI backend aktif. Silakan jalankan API KNN dengan perintah <code>python app.py</code> di folder model.
                    </div>
                  </div>
                )}
                
                <Tabs defaultValue="upload-file" className="w-full">
<TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4 bg-muted/65 p-1 rounded-xl">
  <TabsTrigger
    value="upload-file"
    className="rounded-lg font-semibold text-xs sm:text-sm cursor-pointer"
  >
    <IconUpload className="size-4 mr-2" />
    Unggah File
  </TabsTrigger>

  <TabsTrigger
    value="camera"
    className="rounded-lg font-semibold text-xs sm:text-sm cursor-pointer"
  >
    <IconCamera className="size-4 mr-2" />
    Ambil Foto
  </TabsTrigger>
</TabsList>
                  
                  <TabsContent value="upload-file" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 min-h-[350px] ${
                        isDragging
                          ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
                          : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/5"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />
                      
                      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <IconUpload className="size-8 animate-bounce" />
                      </div>
                      
                      <h3 className="text-lg font-bold">Tarik & Letakkan foto sampah</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                        Format gambar yang didukung: <strong>JPG, PNG, WEBP</strong>. Maksimal ukuran file 10MB.
                      </p>
                      <Button variant="outline" className="mt-6 rounded-xl">
                        Pilih dari Galeri
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="camera" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                    <CameraCapture onCapture={validateAndSetFile} />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Pratinjau Citra Sampah</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6 bg-muted/30">
                  <div className="max-w-md w-full aspect-video rounded-xl overflow-hidden border bg-background shadow-xs flex items-center justify-center">
                    <img src={previewUrl} alt="Trash Preview" className="max-h-64 object-contain p-2" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-semibold text-sm truncate max-w-md">{file?.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ukuran: {file ? (file.size / (1024 * 1024)).toFixed(2) : 0} MB
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t p-4 gap-3">
                  <Button variant="ghost" onClick={handleReset} className="rounded-xl w-full sm:w-auto">
                    Ganti Gambar
                  </Button>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {apiConnected === false && (
                      <span className="text-xs text-destructive font-medium text-center sm:text-right">
                        API tidak aktif. Klasifikasi dinonaktifkan.
                      </span>
                    )}
                    <Button 
                      onClick={handleClassify} 
                      disabled={apiConnected === false}
                      className="rounded-xl px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold w-full sm:w-auto"
                    >
                      Klasifikasikan Sekarang
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>

          {/* Tips Sidebar */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <IconHelpCircle className="size-5" />
                  Panduan Foto Berkualitas
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm text-muted-foreground">
                <p>
                  Untuk mendapatkan hasil klasifikasi yang akurat, ikuti tips foto berikut:
                </p>
                
                <ul className="space-y-3 pl-1">
                  <li className="flex gap-3 items-start">
                    <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-foreground block">Pencahayaan Cukup:</strong>
                      Pastikan objek sampah mendapat cukup cahaya dan tidak terlalu gelap.
                    </div>
                  </li>
                  
                  <li className="flex gap-3 items-start">
                    <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-foreground block">Satu Objek Terfokus:</strong>
                      Hindari adanya objek lain yang mendominasi gambar selain sampah yang ingin diklasifikasi.
                    </div>
                  </li>

                  <li className="flex gap-3 items-start">
                    <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-foreground block">Latar Bersih:</strong>
                      Gunakan latar belakang yang kontras atau bersih (polos) jika memungkinkan agar fitur visual terekstraksi optimal.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* STATE B: PROCESSING (STEPPER ANIMATION) */}
      {appState === "processing" && (
        <Card className="max-w-3xl mx-auto py-10 px-6">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-xl font-bold">Memproses Citra Sampah</CardTitle>
            <CardDescription>
              Ekstraksi fitur visual dan penghitungan jarak Euclidean model KNN sedang berjalan...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <ProcessingStepper currentStep={currentStep} />
            <div className="flex justify-center pt-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE C: RESULT */}
      {appState === "result" && result && (
        <div className="space-y-6">
          {/* Main Action Bar */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleReset} className="rounded-xl">
              <IconArrowLeft className="size-4 mr-2" />
              Kembali
            </Button>
            <Button onClick={handleDownload} variant="secondary" className="rounded-xl">
              <IconDownload className="size-4 mr-2" />
              Unduh Hasil
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Image, Prediction, Config */}
            <div className="space-y-6 lg:col-span-1">
              {/* Image & Prediction */}
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

              {/* Model Context Collapsible */}
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
                    <span className="font-semibold text-foreground">Histogram + LBP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pra-pemrosesan:</span>
                    <span className="font-semibold text-foreground">Resize 128x128 RGB</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: KNN Neighbors & Guide */}
            <div className="lg:col-span-2 space-y-6">
              {/* Neighbors */}
              <NeighborViewer neighbors={result.neighbors} />
              
              {/* Guide card */}
              <WasteGuideCard prediction={result.prediction} />
            </div>
          </div>

          {/* Repeat classification button */}
          <div className="flex justify-center pt-2">
            <Button onClick={handleReset} size="lg" className="rounded-xl px-8 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
              <IconRefresh className="size-5 mr-2" />
              Klasifikasikan Sampah Lain
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
