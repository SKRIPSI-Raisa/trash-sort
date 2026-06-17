"use client"

import * as React from "react"
import { getAllHistory, adminDeleteHistoryItem, adminClearAllHistory } from "@/lib/api"
import { ClassificationResult } from "@/lib/types"
import { WasteBadge } from "@/components/waste-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  IconSearch,
  IconDownload,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,

  IconRecycle,
  IconArrowsUpDown,
  IconTrashX,
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

type SortField = "filename" | "prediction" | "confidence" | "created_at"
type SortOrder = "asc" | "desc"

export default function Page() {
  const [history, setHistory] = React.useState<ClassificationResult[]>([])
  const [loading, setLoading] = React.useState(true)
  
  // Search & Filter
  const [search, setSearch] = React.useState("")
  const [filterType, setFilterType] = React.useState<"Semua" | "Organik" | "Non-Organik">("Semua")
  
  // Sorting
  const [sortField, setSortField] = React.useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc")
  
  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // Drawer Confirmation state for clear all
  const [clearAllOpen, setClearAllOpen] = React.useState(false)

  const loadData = React.useCallback(async () => {
    try {
      const data = await getAllHistory()
      setHistory(data)
    } catch (e) {
      toast.error("Gagal memuat data riwayat.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleDeleteItem = async (id: string) => {
    try {
      await adminDeleteHistoryItem(id)
      toast.success("Riwayat klasifikasi berhasil dihapus.")
      loadData()
    } catch (e) {
      toast.error("Gagal menghapus item.")
    }
  }

  const handleClearAll = async () => {
    try {
      await adminClearAllHistory()
      toast.success("Seluruh riwayat klasifikasi berhasil dikosongkan.")
      setClearAllOpen(false)
      loadData()
    } catch (e) {
      toast.error("Gagal mengosongkan riwayat.")
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    if (history.length === 0) {
      toast.warning("Tidak ada data untuk diekspor.")
      return
    }

    const headers = ["ID", "Nama File", "Prediksi", "Confidence", "Nilai K", "Waktu Eksekusi (Detik)", "Tanggal"]
    const rows = history.map((item) => [
      item.id,
      item.filename,
      item.prediction,
      item.confidence,
      item.k_value,
      item.execution_time_seconds,
      new Date(item.created_at).toLocaleString("id-ID")
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `wastesort_history_export_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success("Data riwayat berhasil diekspor ke format CSV.")
  }

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  // Filter & Search & Sort logic
  const filteredAndSortedData = React.useMemo(() => {
    let result = [...history]

    // 1. Search filter
    if (search.trim() !== "") {
      const q = search.toLowerCase()
      result = result.filter((item) => item.filename.toLowerCase().includes(q))
    }

    // 2. Class type filter
    if (filterType !== "Semua") {
      result = result.filter((item) => item.prediction === filterType)
    }

    // 3. Sorting
    result.sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]

      if (sortField === "created_at") {
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA
      }

      return 0
    })

    return result
  }, [history, search, filterType, sortField, sortOrder])

  // Pagination calculations
  const totalItems = filteredAndSortedData.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize)
  }, [filteredAndSortedData, currentPage, pageSize])

  // Adjust page number if it exceeds total pages
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  if (loading) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-[450px] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Riwayat Klasifikasi</h1>
          <p className="text-muted-foreground text-sm">
            Daftar audit seluruh gambar sampah rumah tangga yang pernah diproses.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <Button variant="outline" onClick={handleExportCSV} disabled={history.length === 0} className="rounded-xl">
            <IconDownload className="size-4 mr-2" />
            Ekspor CSV
          </Button>

          {/* Clear All Drawer */}
          <Drawer open={clearAllOpen} onOpenChange={setClearAllOpen}>
            <DrawerTrigger asChild>
              <Button variant="destructive" disabled={history.length === 0} className="rounded-xl">
                <IconTrashX className="size-4 mr-2" />
                Kosongkan
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
                    <IconAlertCircle className="size-6" />
                  </div>
                  <DrawerTitle>Kosongkan Seluruh Riwayat?</DrawerTitle>
                  <DrawerDescription>
                    Tindakan ini akan menghapus semua riwayat klasifikasi secara permanen dari penyimpanan lokal.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button variant="destructive" onClick={handleClearAll} className="rounded-xl">
                    Ya, Hapus Semua
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

      {/* Main Table Card */}
      <Card>
        {/* Search & Filter Header */}
        <CardHeader className="pb-3 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-0">
          <div className="relative w-full md:max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama file..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 rounded-xl"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Filter Prediksi:</span>
            <Select
              value={filterType}
              onValueChange={(val: any) => {
                setFilterType(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Semua">Semua</SelectItem>
                <SelectItem value="Organik">Organik</SelectItem>
                <SelectItem value="Non-Organik">Non-Organik</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* Content Table */}
        <CardContent className="p-0">
          {paginatedData.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Riwayat Kosong"
                description={
                  search || filterType !== "Semua"
                    ? "Tidak ditemukan data riwayat yang cocok dengan filter pencarian Anda."
                    : "Belum ada riwayat klasifikasi dalam database."
                }
                icon={<IconRecycle className="size-6" />}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs font-semibold uppercase text-muted-foreground select-none">
                    <th className="p-4 w-16">Pratinjau</th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("filename")}>
                      <div className="flex items-center gap-1.5">
                        Nama File
                        <IconArrowsUpDown className="size-3.5" />
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("prediction")}>
                      <div className="flex items-center gap-1.5">
                        Kategori
                        <IconArrowsUpDown className="size-3.5" />
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("confidence")}>
                      <div className="flex items-center gap-1.5">
                        Confidence
                        <IconArrowsUpDown className="size-3.5" />
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort("created_at")}>
                      <div className="flex items-center gap-1.5">
                        Tanggal diproses
                        <IconArrowsUpDown className="size-3.5" />
                      </div>
                    </th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="size-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                          <img
                            src={item.original_image_url}
                            alt={item.filename}
                            className="size-full object-contain p-1"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-semibold max-w-[200px] truncate" title={item.filename}>
                        {item.filename}
                      </td>
                      <td className="p-4">
                        <WasteBadge prediction={item.prediction} />
                      </td>
                      <td className="p-4 min-w-[150px]">
                        <ConfidenceBar value={item.confidence} prediction={item.prediction} showText={false} size="sm" />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1.5">
                          {/* Delete Item Drawer */}
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button variant="outline" size="icon" className="rounded-lg h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" title="Hapus">
                                <IconTrash className="size-4" />
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader className="text-center">
                                  <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
                                    <IconAlertCircle className="size-6" />
                                  </div>
                                  <DrawerTitle>Hapus Item Riwayat?</DrawerTitle>
                                  <DrawerDescription>
                                    Menghapus riwayat klasifikasi untuk file &quot;{item.filename}&quot; secara permanen.
                                  </DrawerDescription>
                                </DrawerHeader>
                                <DrawerFooter>
                                  <Button variant="destructive" onClick={() => handleDeleteItem(item.id)} className="rounded-xl">
                                    Ya, Hapus
                                  </Button>
                                  <DrawerClose asChild>
                                    <Button variant="outline" className="rounded-xl">Batal</Button>
                                  </DrawerClose>
                                </DrawerFooter>
                              </div>
                            </DrawerContent>
                          </Drawer>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Table Pagination Footer */}
        {paginatedData.length > 0 && (
          <div className="border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground select-none">
            <div className="flex items-center gap-4">
              <span>
                Menampilkan <strong>{Math.min(totalItems, (currentPage - 1) * pageSize + 1)}</strong> -{" "}
                <strong>{Math.min(totalItems, currentPage * pageSize)}</strong> dari <strong>{totalItems}</strong> item
              </span>
              
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase whitespace-nowrap">Baris:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(Number(val))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-16 h-8 rounded-lg">
                    <SelectValue placeholder={String(pageSize)} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg"
              >
                &lt;&lt;
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg"
              >
                <IconChevronLeft className="size-4" />
              </Button>
              
              <div className="px-3 py-1 bg-primary/10 text-primary font-semibold rounded-lg text-xs">
                Halaman {currentPage} dari {totalPages}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg"
              >
                <IconChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg"
              >
                &gt;&gt;
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
