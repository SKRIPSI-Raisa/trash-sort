"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  IconBook,
  IconUser,
  IconSchool,
  IconCpu,
  IconRoute,
  IconPhoto,
  IconDatabase,
  IconArrowRight,
} from "@tabler/icons-react"

export default function Page() {
  const steps = [
    {
      title: "1. Pengunggahan Citra (Image Upload)",
      desc: "Sistem menerima citra masukan sampah rumah tangga dalam format RGB (JPG, PNG, atau WEBP) melalui antarmuka web.",
      icon: <IconPhoto className="size-5" />
    },
    {
      title: "2. Pra-pemrosesan (Preprocessing)",
      desc: "Citra diseragamkan ukurannya menjadi 128x128 piksel dan dilakukan normalisasi kecerahan untuk mengurangi noise pencahayaan.",
      icon: <IconRoute className="size-5" />
    },
    {
      title: "3. Ekstraksi Fitur (Feature Extraction)",
      desc: "Mengekstrak informasi visual penting: Color Histogram (warna) dan Local Binary Patterns / LBP (tekstur permukaan).",
      icon: <IconCpu className="size-5" />
    },
    {
      title: "4. Jarak Euclidean (Euclidean Distance)",
      desc: "Menghitung jarak kemiripan vektor fitur antara citra masukan dengan seluruh dataset latih di database.",
      icon: <IconDatabase className="size-5" />
    },
    {
      title: "5. Voting KNN (K-Nearest Neighbors)",
      desc: "Mengambil K=7 tetangga terdekat dengan jarak terkecil, lalu melakukan voting mayoritas kelas (Organik vs Non-Organik).",
      icon: <IconArrowRight className="size-5" />
    }
  ]

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Tentang Penelitian</h1>
        <p className="text-muted-foreground text-sm">
          Informasi lengkap mengenai proyek tugas akhir/skripsi dan arsitektur sistem klasifikasi WasteSort.
        </p>
      </div>

      {/* Skripsi Title and Student Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thesis Info */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
              <IconBook className="size-4" />
              Tugas Akhir / Skripsi
            </div>
            <CardTitle className="text-xl font-bold leading-snug">
              Implementasi Algoritma K-Nearest Neighbors (KNN) Untuk Pemilahan Otomatis Sampah Organik Dan Non-Organik Berdasarkan Fitur Citra RGB
            </CardTitle>
            <CardDescription className="pt-2 text-sm">
              Penelitian ini berfokus pada pemanfaatan pemrosesan citra digital (image processing) dan algoritma machine learning konvensional KNN untuk memilah jenis sampah secara real-time berdasarkan ekstraksi histogram warna dan LBP.
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t pt-4 text-sm text-muted-foreground space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Latar Belakang:</h4>
              <p className="leading-relaxed">
                Pemilahan sampah di sumbernya (rumah tangga) masih menjadi kendala utama dalam sistem daur ulang nasional. Sistem ini dirancang untuk memberikan solusi otomasi visual yang ringan, akurat, dan mudah dideploy di perangkat berspesifikasi rendah tanpa membutuhkan komputasi GPU yang besar seperti pada model Deep Learning.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Student Profile Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">R</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-bold">Raisa</CardTitle>
                <CardDescription className="text-xs">Mahasiswa Informatika</CardDescription>
                <Badge className="mt-1.5 bg-primary/10 text-primary hover:bg-primary/15 border-none">
                  NIM: 123456789
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-4 space-y-3.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconSchool className="size-5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-xs block">Institusi Pendidikan</span>
                <span className="font-semibold text-foreground">Fakultas Ilmu Komputer</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconUser className="size-5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-xs block">Dosen Pembimbing I</span>
                <span className="font-semibold text-foreground">Dr. Eng. Ir. Budi Santoso, M.T.</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconUser className="size-5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-xs block">Dosen Pembimbing II</span>
                <span className="font-semibold text-foreground">Siti Rahma, S.Kom., M.Cs.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KNN Methodology Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Alur Pengolahan Citra & Algoritma KNN</CardTitle>
          <CardDescription>Tahapan sistematis dari masukan gambar hingga keputusan kategori akhir.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col p-4 bg-muted/40 border rounded-xl hover:bg-muted/60 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  {step.icon}
                </div>
                <h4 className="font-bold text-sm text-foreground mb-1.5">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dataset & Parameter specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Spesifikasi Dataset</CardTitle>
            <CardDescription>Rincian sebaran data yang digunakan untuk pelatihan model.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Penelitian ini menggunakan total <strong>1000 data sampel citra</strong> beresolusi tinggi yang terbagi secara merata:
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
              <div className="p-3 border rounded-xl bg-card">
                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400 block">500 Citra</span>
                <span>Sampah Organik</span>
              </div>
              <div className="p-3 border rounded-xl bg-card">
                <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400 block">500 Citra</span>
                <span>Sampah Non-Organik</span>
              </div>
            </div>
            <p className="text-xs pt-1">
              Rasio pembagian data latih (training data) dan data uji (testing data) adalah <strong>80:20</strong> (800 sampel latih dan 200 sampel uji).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Detail Ekstraksi Fitur</CardTitle>
            <CardDescription>Dua fitur utama yang digabungkan untuk klasifikasi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground block text-sm">1. Color Histogram (Dimensi Warna):</strong>
              <p className="text-xs mt-0.5 leading-relaxed">
                Mengekstrak persebaran nilai warna pada channel Red, Green, dan Blue (RGB). Fitur warna sangat membedakan daun hijau/buah busuk (organik) dengan kaleng berwarna perak atau plastik beraneka warna (non-organik).
              </p>
            </div>
            <div>
              <strong className="text-foreground block text-sm">2. Local Binary Patterns / LBP (Dimensi Tekstur):</strong>
              <p className="text-xs mt-0.5 leading-relaxed">
                Mengekstrak informasi tekstur lokal dengan membandingkan nilai keabuan piksel pusat terhadap piksel tetangganya. Berguna mendeteksi kehalusan botol plastik vs kekasaran permukaan daun atau kayu.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
