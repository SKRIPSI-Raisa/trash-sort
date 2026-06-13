"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconCameraOff, IconSwitchHorizontal, IconLoader2, IconAlertTriangle } from "@tabler/icons-react"
import { toast } from "sonner"

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose?: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([])
  const [activeDeviceId, setActiveDeviceId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  // Track whether the active camera is front-facing (user) for mirroring
  const [isFrontCamera, setIsFrontCamera] = React.useState(false)

  // Detect if the active track is front-facing
  const detectFacingMode = (stream: MediaStream) => {
    const track = stream.getVideoTracks()[0]
    if (!track) return
    const settings = track.getSettings()
    // "user" = front camera, "environment" = back camera
    setIsFrontCamera(settings.facingMode === "user")
  }

  // Start the video stream
  const startCamera = React.useCallback(async (deviceId: string | null) => {
    setTimeout(() => {
      setLoading(true)
      setError(null)
    }, 0)

    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = mediaStream

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      detectFacingMode(mediaStream)

      // Enumerate devices to allow switching cameras
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = allDevices.filter((device) => device.kind === "videoinput")
      setDevices(videoDevices)
    } catch (err: unknown) {
      console.error("Error accessing camera:", err)
      let errorMsg = "Gagal mengakses kamera. Pastikan izin kamera telah diberikan."
      const errorName = err instanceof Error ? err.name : String(err)
      if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
        errorMsg = "Akses kamera ditolak. Silakan izinkan akses kamera pada browser Anda."
      } else if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
        errorMsg = "Kamera tidak ditemukan di perangkat Anda."
      } else if (errorName === "NotReadableError" || errorName === "TrackStartError") {
        errorMsg = "Kamera sedang digunakan oleh aplikasi lain."
      }
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Start camera when activeDeviceId changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      startCamera(activeDeviceId)
    }, 0)
    return () => clearTimeout(timer)
  }, [activeDeviceId, startCamera])

  // Stop current stream when unmounting
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Switch to next camera
  const handleSwitchCamera = () => {
    if (devices.length < 2) return
    const currentIndex = devices.findIndex((d) => d.deviceId === activeDeviceId)
    const nextIndex = (currentIndex + 1) % devices.length

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setActiveDeviceId(devices[nextIndex].deviceId)
  }

  // Capture current frame
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight

    canvas.width = videoWidth
    canvas.height = videoHeight

    if (isFrontCamera) {
      // Un-mirror: flip canvas horizontally so saved image is NOT mirrored
      ctx.save()
      ctx.translate(videoWidth, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
      ctx.restore()
    } else {
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Gagal menangkap gambar dari kamera.")
          return
        }

        const file = new File([blob], `camera_capture_${Date.now()}.jpg`, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })

        onCapture(file)
      },
      "image/jpeg",
      0.9,
    )
  }

  return (
    <div className="relative w-full flex flex-col bg-zinc-950 text-white rounded-2xl overflow-hidden border border-zinc-800">
      {/* 
        Aspect ratio: 
        - Mobile (portrait): use 4/5 ratio to feel native 
        - Desktop (landscape): use 16/9 ratio 
        We achieve this with a padding-top trick so it's purely CSS-driven.
      */}
      <div className="relative w-full" style={{ paddingTop: "min(56.25%, 80dvh)" }}>
        <div className="absolute inset-0 flex items-center justify-center">

          {/* Video element */}
          {!error && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              } ${isFrontCamera ? "[transform:scaleX(-1)]" : ""}`}
            />
          )}

          {/* Canvas for capture (hidden) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scan box overlay */}
          {!loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {/* Dim backdrop */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Scan box */}
              <div className="relative border-2 border-dashed border-emerald-400 rounded-2xl bg-transparent shadow-[0_0_20px_rgba(16,185,129,0.2)] z-10"
                style={{ width: "min(260px, 60%)", aspectRatio: "1 / 1" }}>
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 -mt-[2px] -ml-[2px] rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 -mt-[2px] -mr-[2px] rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 -mb-[2px] -ml-[2px] rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 -mb-[2px] -mr-[2px] rounded-br-lg" />

                {/* Animated scan line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-scan" />
              </div>

              {/* Label */}
              <div className="absolute top-4 text-center bg-black/60 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/10 z-10 max-w-[85%]">
                Posisikan objek sampah di dalam kotak
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-20">
              <IconLoader2 className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-sm text-zinc-400 font-medium">Menghubungkan kamera...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-center p-6 z-20">
              <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4 border border-destructive/20">
                <IconAlertTriangle className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">Akses Kamera Gagal</h3>
              <p className="text-sm text-zinc-400 max-w-sm mb-6">{error}</p>
              <div className="flex gap-3">
                {onClose && (
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                  >
                    Kembali
                  </Button>
                )}
                <Button
                  onClick={() => startCamera(activeDeviceId)}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          )}

          {/* Camera controls */}
          {!loading && !error && (
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6 z-20 pointer-events-auto">
              {/* Left: close / back */}
              <div className="w-12 flex justify-start">
                {onClose && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60 border border-white/10"
                  >
                    <IconCameraOff className="size-5" />
                  </Button>
                )}
              </div>

              {/* Center: shutter */}
              <button
                onClick={handleCapture}
                className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white transition-all active:scale-95 shadow-lg border border-black/10 hover:shadow-xl cursor-pointer"
              >
                <span className="w-[52px] h-[52px] rounded-full border-[3px] border-zinc-950 bg-white group-hover:scale-95 transition-transform" />
              </button>

              {/* Right: switch camera */}
              <div className="w-12 flex justify-end">
                {devices.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSwitchCamera}
                    className="h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60 border border-white/10"
                    title="Ganti Kamera"
                  >
                    <IconSwitchHorizontal className="size-5" />
                  </Button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
