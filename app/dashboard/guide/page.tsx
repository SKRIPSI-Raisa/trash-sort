"use client"

import * as React from "react"
import { mockGuides } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  IconLeaf,
  IconRecycle,
  IconSearch,
  IconTrash,
  IconInfoCircle,
  IconDroplet,
  IconRotate,
  IconAlertCircle,
} from "@tabler/icons-react"

export default function Page() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const faqs = [
    {
      q: "Bagaimana cara membuang botol plastik minuman yang benar?",
      a: "Kosongkan sisa cairan, bilas bagian dalam botol, lepaskan label plastik di bagian badan botol, lalu remas botol untuk menghemat ruang tempat sampah daur ulang.",
      category: "Non-Organik"
    },
    {
      q: "Apakah kardus bekas wadah pizza yang berminyak bisa didaur ulang?",
      a: "Kardus yang terkena noda minyak makanan berat dikategorikan sebagai sampah residu/Non-Organik yang tidak dapat didaur ulang karena noda minyak merusak serat kertas saat proses pulping. Bagian kardus yang bersih tetap dapat dipotong dan didaur ulang.",
      category: "Non-Organik"
    },
    {
      q: "Bagaimana cara terbaik mengolah sampah sisa makanan di rumah?",
      a: "Cara terbaik adalah membuat komposter sederhana di halaman rumah. Sampah sisa makanan (sayur, nasi, buah) ditumpuk bergantian dengan bahan kering (daun kering/serbuk gergaji) untuk mencegah bau busuk dan menghasilkan pupuk organik berkualitas.",
      category: "Organik"
    },
    {
      q: "Apakah pecahan kaca dan beling termasuk sampah Non-Organik yang aman dibuang langsung?",
      a: "Kaca termasuk Non-Organik, namun demi keselamatan petugas kebersihan, bungkus pecahan kaca dengan kertas tebal atau kardus lalu beri label peringatan 'Pecahan Kaca' sebelum dimasukkan ke tempat sampah.",
      category: "Non-Organik"
    },
    {
      q: "Apakah daun basah dan daun kering memiliki cara pengolahan yang sama?",
      a: "Ya, keduanya adalah sampah organik. Namun dalam pembuatan kompos, daun basah dikategorikan sebagai 'unsur hijau' (kaya nitrogen), sedangkan daun kering sebagai 'unsur cokelat' (kaya karbon). Keduanya harus seimbang agar kompos matang sempurna.",
      category: "Organik"
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const organicGuide = mockGuides.find(g => g.type === "Organik")
  const nonOrganicGuide = mockGuides.find(g => g.type === "Non-Organik")

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Panduan Edukasi Pemilahan</h1>
        <p className="text-muted-foreground text-sm">
          Pelajari cara yang benar dalam memilah, membersihkan, dan mendaur ulang berbagai jenis sampah rumah tangga.
        </p>
      </div>

      {/* Tabs for Organic vs Non-Organic Guides */}
      <Tabs defaultValue="organic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md rounded-xl">
          <TabsTrigger value="organic" className="rounded-lg gap-2">
            <IconLeaf className="size-4 text-emerald-500" />
            Sampah Organik
          </TabsTrigger>
          <TabsTrigger value="nonorganic" className="rounded-lg gap-2">
            <IconRecycle className="size-4 text-indigo-500" />
            Sampah Non-Organik
          </TabsTrigger>
        </TabsList>

        {/* ORGANIC GUIDE */}
        <TabsContent value="organic" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-l-4 border-l-emerald-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <IconLeaf className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Panduan Sampah Organik</CardTitle>
                    <CardDescription>Sampah yang berasal dari sisa makhluk hidup dan mudah membusuk secara alami.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {organicGuide?.description}
                </p>

                <div>
                  <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Contoh Sampah Organik:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {organicGuide?.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-muted/40 hover:bg-muted/60 transition-colors border rounded-xl font-medium text-center">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Langkah-Langkah Pengolahan Kompos Mandiri:
                  </h3>
                  <div className="space-y-3">
                    {organicGuide?.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                        <span className="size-6 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-muted-foreground leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organic Micro tips */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <IconDroplet className="size-5 text-emerald-600 dark:text-emerald-400" />
                    Aturan Kelembaban Kompos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Kompos yang baik tidak boleh terlalu basah atau terlalu kering. Idealnya terasa seperti spons basah yang diperas.
                  </p>
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl text-xs flex gap-2">
                    <IconAlertCircle className="size-5 shrink-0" />
                    <span>
                      Jangan masukkan tulang tebal, daging lemak, kotoran hewan peliharaan, atau produk susu karena memicu bau busuk dan mengundang hama tikus.
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <IconRotate className="size-5 text-emerald-600 dark:text-emerald-400" />
                    Metode 3R untuk Organik
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    <strong>Reduce:</strong> Belanja bahan makanan secukupnya untuk menekan food waste.
                  </p>
                  <p>
                    <strong>Reuse:</strong> Gunakan sisa sayuran (wortel, bawang, seledri) untuk membuat kaldu sup buatan sendiri.
                  </p>
                  <p>
                    <strong>Recycle:</strong> Olah sisa buah dan kulit jeruk menjadi cairan pembersih serbaguna ramah lingkungan (Eco-Enzyme).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* NON-ORGANIC GUIDE */}
        <TabsContent value="nonorganic" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-l-4 border-l-indigo-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <IconRecycle className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Panduan Sampah Non-Organik</CardTitle>
                    <CardDescription>Sampah yang tidak mudah membusuk secara alami dan membutuhkan waktu puluhan hingga ratusan tahun untuk terurai.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {nonOrganicGuide?.description}
                </p>

                <div>
                  <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Contoh Sampah Non-Organik Layak Daur Ulang:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {nonOrganicGuide?.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-muted/40 hover:bg-muted/60 transition-colors border rounded-xl font-medium text-center">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Langkah-Langkah Pemilahan & Penyaluran:
                  </h3>
                  <div className="space-y-3">
                    {nonOrganicGuide?.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                        <span className="size-6 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-muted-foreground leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Non-Organic Micro tips */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <IconDroplet className="size-5 text-indigo-600 dark:text-indigo-400" />
                    Aturan 3B (Bersih, Bilas, Buang)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Kunci utama daur ulang plastik dan kaleng adalah kebersihan. Sisa minyak/cairan manis akan menurunkan kualitas daur ulang dan menarik serangga di bank sampah.
                  </p>
                  <p className="font-semibold text-foreground">
                    Selalu bilas wadah plastik/kaleng sebelum dibuang!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <IconTrash className="size-5 text-indigo-600 dark:text-indigo-400" />
                    Jenis Plastik Daur Ulang
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2.5">
                  <p>
                    Perhatikan kode segitiga daur ulang di bawah botol/wadah:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="outline">PETE (1)</Badge>
                    <Badge variant="outline">HDPE (2)</Badge>
                    <Badge variant="outline">LDPE (4)</Badge>
                    <Badge variant="outline">PP (5)</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    *Kode 3 (PVC) dan 6 (Styrofoam) sangat sulit didaur ulang secara umum di Indonesia.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Accordion FAQ Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Tanya Jawab Seputar Pemilahan (FAQ)</CardTitle>
          <CardDescription>Temukan solusi praktis untuk kebingungan memilah sampah harian Anda.</CardDescription>
          
          <div className="relative w-full md:max-w-sm mt-3">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
              <IconInfoCircle className="size-5 text-muted-foreground" />
              Tidak ditemukan tanya jawab yang cocok.
            </div>
          ) : (
            <div className="w-full divide-y">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx
                return (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-sm font-bold text-left hover:text-primary transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <Badge variant="secondary" className={faq.category === "Organik" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-none" : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-none"}>
                          {faq.category}
                        </Badge>
                        <span className="text-foreground">{faq.q}</span>
                      </div>
                      <span className={`text-muted-foreground text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-[200px] opacity-100 mt-2 pl-4 border-l border-primary/20" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-muted-foreground leading-relaxed text-sm py-1">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
