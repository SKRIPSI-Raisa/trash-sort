import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">404 - Hasil Tidak Ditemukan</h2>
      <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
        Maaf, ID klasifikasi yang Anda cari tidak dapat ditemukan dalam sistem.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/dashboard/history">Kembali ke Riwayat</Link>
        </Button>
      </div>
    </div>
  )
}
