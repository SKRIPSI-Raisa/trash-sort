# Rencana Pengembangan UI MVP — WasteSort (Versi Lengkap)

Dokumen ini merupakan rencana pengembangan antarmuka pengguna (UI) untuk sistem **WasteSort**, disesuaikan penuh dengan **PRD.md** dan **SRS.md**. Fokus dokumen: **pembangunan kerangka (scaffolding), detail UI per halaman, dan struktur routing yang jelas** — sebelum integrasi backend Python (KNN Engine).

---

## 1. Ringkasan Lingkup MVP

| Aspek | Keputusan MVP |
| :--- | :--- |
| Input | Hanya citra statis RGB (JPG/PNG/WebP), tanpa video dan tanpa teks/deskripsi |
| Model | Satu algoritma klasifikasi: KNN (hasil disimulasikan dengan mock data di fase UI) |
| Visualisasi | Tampilan K-tetangga terdekat (thumbnail referensi) + confidence bar |
| Evaluasi | Akurasi, Presisi, Recall, F1-Score + Confusion Matrix + kurva K-optimization |
| Pengguna | Dua peran: **Masyarakat Umum** (utama) dan **Peneliti** — tanpa autentikasi multi-role di MVP |
| Data | Mock/dummy data terpusat (`lib/mock-data.ts`) agar mudah diganti API call saat integrasi |

**Prinsip fase UI:** semua halaman berfungsi penuh secara visual dan interaktif menggunakan data simulasi, dengan kontrak data yang identik dengan respons API backend nantinya.

---

## 2. Arsitektur Routing (Sitemap Lengkap)

Struktur rute menggunakan **Next.js App Router** dengan satu route group dashboard:

```
app/
├── page.tsx                          → redirect ke /dashboard
├── layout.tsx                        → RootLayout (font, theme provider, metadata global)
│
└── dashboard/
    ├── layout.tsx                    → DashboardLayout (Sidebar + Header + Breadcrumb)
    ├── page.tsx                      → [R1] Dashboard / Ringkasan
    │
    ├── classification/
    │   ├── page.tsx                  → [R2] Klasifikasi Sampah (upload → proses → hasil)
    │   └── [id]/
    │       └── page.tsx              → [R3] Detail Hasil Klasifikasi (K-tetangga penuh)
    │
    ├── performance/
    │   └── page.tsx                  → [R4] Performa Model (metrik, CM, kurva K-optimization)
    │
    ├── history/
    │   └── page.tsx                  → [R5] Riwayat Klasifikasi (tabel data)
    │
    ├── guide/
    │   └── page.tsx                  → [R6] Panduan Pengelolaan Sampah (referensi statis)
    │
    └── about/
        └── page.tsx                  → [R7] Tentang Sistem (info batasan & metodologi)
```

### Tabel Rute & Navigasi

| ID | Rute | Menu Sidebar | Ikon (`@tabler/icons-react`) | Sumber Kebutuhan |
| :--- | :--- | :--- | :--- | :--- |
| R1 | `/dashboard` | Dashboard | `IconLayoutDashboard` | PRD §5 (Output Dashboard) |
| R2 | `/dashboard/classification` | Klasifikasi Sampah | `IconRecycle` / `IconCamera` | PRD §5 (Input, Preprocessing, KNN) |
| R3 | `/dashboard/classification/[id]` | — (dari R2/R5) | — | PRD §6 (Halaman Hasil) |
| R4 | `/dashboard/performance` | Performa Model | `IconChartBar` | SRS FR-07 (Kalkulasi Metrik Evaluasi) |
| R5 | `/dashboard/history` | Riwayat | `IconHistory` | Kebutuhan turunan (audit hasil) |
| R6 | `/dashboard/guide` | Panduan Pengelolaan | `IconLeaf` | PRD §5 (Rekomendasi Pengelolaan) |
| R7 | `/dashboard/about` | Tentang Sistem | `IconInfoCircle` | SRS §1 (Batasan Sistem) |

### Aturan Routing

- Root `/` melakukan `redirect('/dashboard')` (server-side, via `next/navigation`).
- Rute detail `[id]` menerima ID hasil klasifikasi; jika ID tidak ditemukan → tampilkan `not-found.tsx` dengan tombol kembali ke Riwayat.
- Metadata per halaman (judul tab browser):
  - Global: `WasteSort — Sistem Klasifikasi Sampah Rumah Tangga`
  - Per halaman: `Klasifikasi Sampah | WasteSort`, `Performa Model | WasteSort`, dst.
- Breadcrumb otomatis di header berdasarkan segmen rute (mis. `Dashboard / Klasifikasi Sampah / Hasil #456`).

---

## 3. Kerangka Layout & Komponen Global

### 3.1 `app/dashboard/layout.tsx`

```
┌─────────────────────────────────────────────┐
│ Sidebar (collapsible)  │  Header             │
│  • Logo WasteSort      │   • SidebarTrigger  │
│  • NavMain (5 menu)    │   • Breadcrumb      │
│  • NavSecondary        │   • ThemeToggle     │
│    (Panduan, Tentang)  ├─────────────────────│
│  • Footer versi        │  <children />       │
│                        │  (konten halaman)   │
└─────────────────────────────────────────────┘
```

### 3.2 Komponen Bersama (Shared Components)

| Komponen | File | Digunakan di | Fungsi |
| :--- | :--- | :--- | :--- |
| `AppSidebar` | `components/app-sidebar.tsx` | Semua | Navigasi utama, branding WasteSort |
| `SiteHeader` | `components/site-header.tsx` | Semua | Breadcrumb + trigger sidebar + toggle tema |
| `WasteBadge` | `components/waste-badge.tsx` | R1, R2, R3, R5 | Badge label: hijau = *Organik*, abu-abu biru = *Non-Organik* |
| `ConfidenceBar` | `components/confidence-bar.tsx` | R2, R3, R5 | Progress bar persentase keyakinan KNN |
| `NeighborViewer` | `components/neighbor-viewer.tsx` | R2, R3 | Grid thumbnail K-tetangga terdekat + jarak |
| `MetricCard` | `components/metric-card.tsx` | R1, R4 | Kartu statistik tunggal (nilai + ikon) |
| `EmptyState` | `components/empty-state.tsx` | R2, R5 | Tampilan kosong dengan CTA |
| `ProcessingStepper` | `components/processing-stepper.tsx` | R2 | Indikator tahapan: Upload → Preprocessing → Ekstraksi Fitur → KNN → Hasil |
| `WasteGuideCard` | `components/waste-guide-card.tsx` | R2, R3, R6 | Kartu panduan pengelolaan (kompos, daur ulang, dll.) |

### 3.3 Lapisan Data Mock

- `lib/types.ts` — definisi TypeScript: `ClassificationResult`, `ModelMetrics`, `ConfusionMatrix`, `KOptimizationPoint`, `Neighbor`, `WasteGuide`.
- `lib/mock-data.ts` — data simulasi terpusat (riwayat klasifikasi, metrik model, kurva K-optimization, data panduan).
- `lib/api.ts` — fungsi async tiruan (`classifyImage()`, `getMetrics()`, `getHistory()`) dengan `setTimeout` 1–2 detik. **Saat integrasi, hanya file ini yang diganti dengan `fetch` ke FastAPI/Flask.**

---

## 4. Detail Spesifikasi Per Halaman

### R1 — Dashboard / Ringkasan (`/dashboard`)

**Tujuan:** ringkasan cepat aktivitas sistem untuk semua pengguna.

**Susunan section (atas → bawah):**

1. **Section Cards** (4 kartu, grid responsif 1→2→4 kolom):

   | Kartu | Konten | Indikator |
   | :--- | :--- | :--- |
   | Total Klasifikasi | Jumlah total citra diproses | Tren mingguan (↑/↓) |
   | Sampah Organik | Jumlah + persentase | Badge hijau |
   | Sampah Non-Organik | Jumlah + persentase | Badge abu-abu biru |
   | Akurasi Model | Nilai akurasi KNN aktif (mis. 89.5%) | Status model: *Ready* |

2. **Grafik Area Interaktif:** tren frekuensi klasifikasi per hari (toggle 7/30/90 hari), dua seri data: *Organik* vs *Non-Organik* (stacked area, Recharts).

3. **Tabel "Klasifikasi Terbaru"** (5 baris terakhir): thumbnail, nama file, label, confidence, waktu — dengan tautan "Lihat semua →" ke `/dashboard/history`.

4. **Kartu Aksi Cepat:** tombol besar "Mulai Klasifikasi Baru" → `/dashboard/classification`.

5. **Kartu Fakta Singkat:** statistik menarik (mis. "Dari 1.200 klasifikasi, 67% adalah sampah Organik — siap dikompos!") untuk edukasi pengguna umum.

**State kosong:** jika belum ada riwayat, tampilkan `EmptyState` dengan CTA klasifikasi pertama.

---

### R2 — Klasifikasi Sampah (`/dashboard/classification`)

**Tujuan:** alur inti sesuai *Activity Diagram* PRD §6 (Upload → Preprocessing → Ekstraksi Fitur → KNN → Hasil). Halaman ini adalah **single-page flow dengan 3 state UI**:

#### State A — Upload (default)
- **Dropzone** drag-and-drop: area besar bergaris putus-putus, ikon daur ulang, teks "Tarik & letakkan foto sampah, atau klik untuk memilih".
- **Validasi sisi klien:**
  - Format: hanya `image/jpeg`, `image/png`, `image/webp`.
  - Ukuran maksimum: 10 MB.
  - Tolak file video/dokumen dengan toast error: *"Sistem hanya mendukung citra statis format RGB."*
- **Tips kontekstual:** panduan singkat cara foto sampah yang baik (pencahayaan cukup, objek terfokus, latar bersih).
- **Pratinjau:** setelah file valid, tampilkan thumbnail + nama file + ukuran + dimensi piksel, dengan tombol "Ganti Gambar" dan "Klasifikasikan Sekarang".

#### State B — Processing
- **`ProcessingStepper`** menampilkan 5 tahap berurutan dengan animasi:
  1. ✅ Citra diterima
  2. 🔄 Preprocessing (resize + normalisasi)
  3. 🔄 Ekstraksi Fitur (Color Histogram + LBP/HOG)
  4. 🔄 Kalkulasi KNN (menghitung jarak ke K-tetangga)
  5. 🔄 Menentukan hasil klasifikasi
- Skeleton/spinner di area hasil; tombol dinonaktifkan selama proses.

#### State C — Hasil
- **Panel Hasil Klasifikasi** (kartu utama):
  - `WasteBadge` besar: **Organik** (hijau) atau **Non-Organik** (abu-abu biru).
  - `ConfidenceBar`: persentase keyakinan berdasarkan proporsi suara K-tetangga (mis. 7/10 tetangga = 70%).
  - Waktu eksekusi (detik) + timestamp + nilai K yang digunakan.
- **Panel K-Tetangga Terdekat (`NeighborViewer`):**
  - Grid thumbnail K citra referensi terdekat dari data latih.
  - Setiap thumbnail menampilkan: label (Organik/Non-Organik), nilai jarak (skor kemiripan), dan nama kategori sampah (mis. "Plastik", "Daun", "Kertas").
  - Badge berwarna pada thumbnail sesuai kelas.
- **Panel Rekomendasi Pengelolaan (`WasteGuideCard`):**
  - Jika **Organik:** Panduan komposting, pupuk cair, atau biogas.
  - Jika **Non-Organik:** Panduan pemilahan daur ulang (plastik, kertas, logam, kaca) dan informasi bank sampah terdekat.
- **Panel Konteks Model** (collapsible): akurasi, presisi, recall, F1-score model aktif + nilai K optimal + tautan "Detail performa →" ke R4.
- **Aksi lanjutan:** tombol "Simpan ke Riwayat", "Klasifikasi Sampah Lain" (reset ke State A), "Unduh Hasil (PNG)".

---

### R3 — Detail Hasil Klasifikasi (`/dashboard/classification/[id]`)

**Tujuan:** halaman permanen satu hasil klasifikasi, dibuka dari tabel Riwayat atau setelah penyimpanan.

**Konten:**
- Header: nama file + ID klasifikasi + tanggal + tombol kembali (breadcrumb).
- `NeighborViewer` ukuran penuh — grid K-tetangga terdekat dengan detail lengkap.
- Kartu metadata: dimensi asli, ukuran file, hasil preprocessing, waktu eksekusi, nilai K yang digunakan.
- `WasteBadge` besar + `ConfidenceBar`.
- `WasteGuideCard` rekomendasi pengelolaan.
- Aksi: "Unduh Hasil", "Hapus dari Riwayat" (dengan dialog konfirmasi).

---

### R4 — Performa Model (`/dashboard/performance`)

**Tujuan:** transparansi evaluasi model untuk peneliti (SRS FR-07).

**Susunan section:**

1. **4 Kartu Metrik Utama** (`MetricCard`): **Akurasi, Presisi, Recall, F1-Score** — nilai persentase + deskripsi singkat makna metrik.

2. **Confusion Matrix** (komponen `confusion-matrix.tsx`):
   - Grid 2×2: *Aktual (Organik/Non-Organik)* × *Prediksi (Organik/Non-Organik)*.
   - Intensitas warna sel proporsional terhadap nilai.
   - Tooltip per sel: TP/TN/FP/FN + jumlah sampel.

3. **Kurva K-Optimization** (line chart Recharts):
   - Akurasi validasi vs nilai K (K=1 hingga K=20 atau sesuai eksperimen).
   - Penanda titik K-optimal dengan anotasi.
   - Membantu pengguna memahami mengapa nilai K tertentu dipilih.

4. **Perbandingan Metode Ekstraksi Fitur** (bar chart):
   - Akurasi per metode ekstraksi fitur yang diuji (Color Histogram, LBP, HOG, atau kombinasi).
   - Menunjukkan fitur mana yang paling efektif untuk dataset ini.

5. **Kartu Informasi Model** (statis): algoritma KNN, nilai K optimal, metode ekstraksi fitur yang digunakan, ukuran input (mis. 128×128 RGB), jumlah kelas (2), tanggal pelatihan terakhir, jumlah dataset latih/uji.

---

### R5 — Riwayat Klasifikasi (`/dashboard/history`)

**Tujuan:** audit seluruh pengujian yang pernah dilakukan.

**Tabel data** (TanStack Table):

| Kolom | Konten | Fitur |
| :--- | :--- | :--- |
| Thumbnail | Pratinjau 48×48 px | Klik → buka R3 |
| Nama File | string + ekstensi | Sortable, searchable |
| Prediksi | `WasteBadge` | Filter: Semua / Organik / Non-Organik |
| Confidence | `ConfidenceBar` mini + angka | Sortable |
| Tanggal | format relatif + absolut (tooltip) | Sortable (default: terbaru) |
| Aksi | Dropdown: Lihat Detail (→ R3), Unduh, Hapus | — |

**Fitur tabel:**
- Search bar global (nama file).
- Filter berdasarkan label prediksi.
- Pagination (10/25/50 baris per halaman).
- `EmptyState` jika belum ada riwayat + CTA ke R2.
- Tombol "Export CSV" untuk kebutuhan analisis peneliti.

---

### R6 — Panduan Pengelolaan Sampah (`/dashboard/guide`)

**Tujuan:** referensi edukasi pengelolaan sampah yang benar bagi masyarakat umum.

**Konten:**

1. **Kartu Sampah Organik** (hijau): daftar contoh sampah (sisa makanan, sayur, buah, daun, dll.) + metode pengelolaan (komposting, pupuk cair, lubang biopori, biogas).

2. **Kartu Sampah Non-Organik** (abu-abu biru): sub-kategori (plastik, kertas, kaca, logam, elektronik) + metode pengelolaan masing-masing (daur ulang, bank sampah, drop-off point).

3. **Tips Pemilahan di Rumah:** panduan praktis pemisahan sampah sejak dari sumbernya (dapur, kamar mandi, ruang kerja).

4. **Dampak Lingkungan:** fakta singkat dampak salah pilah sampah (infografis sederhana).

---

### R7 — Tentang Sistem (`/dashboard/about`)

**Tujuan:** mengkomunikasikan tujuan, metodologi, dan batasan sistem secara transparan.

**Konten (statis):**
- Deskripsi singkat tujuan sistem (klasifikasi sampah Organik/Non-Organik menggunakan KNN).
- Penjelasan singkat metodologi: alur IPO (Input Citra → Preprocessing → Ekstraksi Fitur → KNN → Klasifikasi → Rekomendasi).
- Daftar batasan: hanya citra statis RGB, dua kelas (Organik/Non-Organik), algoritma KNN, sampah rumah tangga umum.
- Sumber data: dataset publik + koleksi mandiri.
- Informasi pengembang / tugas akhir.

---

## 5. Milestone Implementasi

```
M1: Scaffolding, Routing & Sidebar
  → M2: Lapisan Tipe & Mock Data
    → M3: Dashboard Ringkasan
      → M4: Halaman Klasifikasi (3 State + Neighbor Viewer)
        → M5: Halaman Detail Hasil [id]
          → M6: Performa Model
            → M7: Riwayat Klasifikasi + Tabel
              → M8: Panduan + About + Polish
```

### M1 — Scaffolding, Routing & Sidebar
- [ ] Bersihkan menu bawaan template di `components/app-sidebar.tsx`; pasang 5–6 menu (R1–R7).
- [ ] Pasang ikon `@tabler/icons-react` sesuai tabel rute.
- [ ] Buat seluruh folder & file rute (R1–R7) dengan placeholder `<h1>`.
- [ ] Redirect `/` → `/dashboard`.
- [ ] Set metadata global & per halaman.
- [ ] Komponen breadcrumb dinamis.

### M2 — Lapisan Tipe & Mock Data
- [ ] `lib/types.ts`: `ClassificationResult`, `ModelMetrics`, `ConfusionMatrix`, `KOptimizationPoint`, `Neighbor`, `WasteGuide`.
- [ ] `lib/mock-data.ts`: ±20 entri riwayat dummy, metrik model, titik kurva K-optimization (K=1..20), data panduan pengelolaan.
- [ ] `lib/api.ts`: fungsi async simulasi dengan delay.

### M3 — Dashboard Ringkasan (R1)
- [ ] 4 kartu statistik WasteSort.
- [ ] Grafik tren klasifikasi harian 2 seri (Organik vs Non-Organik).
- [ ] Tabel mini "Klasifikasi Terbaru" + CTA.
- [ ] Kartu fakta edukasi.

### M4 — Halaman Klasifikasi (R2)
- [ ] Dropzone + validasi format/ukuran + toast error + tips foto.
- [ ] Pratinjau citra + metadata file.
- [ ] `ProcessingStepper` 5 tahap.
- [ ] Panel hasil: `WasteBadge`, `ConfidenceBar`, info K.
- [ ] `NeighborViewer`: grid K-tetangga + jarak + label.
- [ ] `WasteGuideCard`: rekomendasi kontekstual.
- [ ] Aksi: simpan, reset, unduh.

### M5 — Detail Hasil (R3)
- [ ] Rute dinamis `[id]` + `not-found.tsx`.
- [ ] Layout detail penuh + dialog konfirmasi hapus.

### M6 — Performa Model (R4)
- [ ] 4 `MetricCard` evaluasi.
- [ ] `ConfusionMatrix` 2×2 dengan tooltip.
- [ ] Kurva K-optimization (line chart).
- [ ] Bar chart perbandingan fitur ekstraksi.
- [ ] Kartu info model.

### M7 — Riwayat Klasifikasi (R5)
- [ ] `data-table.tsx`: kolom sesuai spesifikasi.
- [ ] Search, filter label, sort, pagination, export CSV.
- [ ] Integrasi aksi baris → R3.

### M8 — Polish & Finalisasi
- [ ] Panduan Pengelolaan (R6) + Tentang Sistem (R7).
- [ ] `EmptyState` di semua halaman berdata.
- [ ] Uji responsif (mobile & desktop).
- [ ] Dark mode konsisten.
- [ ] Loading skeleton (`loading.tsx`) per rute.

---

## 6. Struktur Folder Akhir (Target)

```
wastesort-web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                        # redirect → /dashboard
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx                    # R1
│       ├── classification/
│       │   ├── page.tsx                # R2
│       │   ├── loading.tsx
│       │   └── [id]/
│       │       ├── page.tsx            # R3
│       │       └── not-found.tsx
│       ├── performance/
│       │   ├── page.tsx                # R4
│       │   └── loading.tsx
│       ├── history/
│       │   ├── page.tsx                # R5
│       │   └── loading.tsx
│       ├── guide/
│       │   └── page.tsx                # R6
│       └── about/
│           └── page.tsx                # R7
├── components/
│   ├── app-sidebar.tsx
│   ├── site-header.tsx
│   ├── section-cards.tsx
│   ├── chart-area-interactive.tsx
│   ├── data-table.tsx
│   ├── waste-badge.tsx
│   ├── confidence-bar.tsx
│   ├── neighbor-viewer.tsx
│   ├── processing-stepper.tsx
│   ├── confusion-matrix.tsx
│   ├── metric-card.tsx
│   ├── empty-state.tsx
│   ├── waste-guide-card.tsx
│   └── ui/                             # shadcn/ui primitives
└── lib/
    ├── types.ts
    ├── mock-data.ts
    ├── api.ts                          # ← satu-satunya file yang diganti saat integrasi
    └── utils.ts
```

---

## 7. Kontrak Data & Strategi Integrasi Backend (FastAPI/Flask)

UI dibangun mengikuti kontrak berikut sejak awal, sehingga integrasi cukup mengganti implementasi `lib/api.ts`:

### 7.1 `POST /api/classify`
- **Request:** `multipart/form-data` → field `image` (file RGB).
- **Response:**
```json
{
  "status": "success",
  "id": "cls_20260611_001",
  "prediction": "Organik",
  "confidence": 0.8700,
  "k_value": 7,
  "neighbors": [
    {
      "rank": 1,
      "label": "Organik",
      "category": "Sisa Makanan",
      "distance": 0.1234,
      "thumbnail_url": "/references/organic_001.jpg"
    }
  ],
  "original_image_url": "/uploads/image_456.jpg",
  "preprocessing": { "resized_to": [128, 128], "normalized": true },
  "features_used": ["color_histogram", "lbp"],
  "execution_time_seconds": 0.87,
  "created_at": "2026-06-11T10:30:00Z"
}
```

### 7.2 `GET /api/model/metrics`
```json
{
  "accuracy": 0.895,
  "precision": 0.901,
  "recall": 0.888,
  "f1_score": 0.894,
  "k_optimal": 7,
  "confusion_matrix": { "tp": 445, "tn": 450, "fp": 44, "fn": 61 },
  "k_curve": [
    { "k": 1, "accuracy": 0.81 },
    { "k": 3, "accuracy": 0.85 },
    { "k": 7, "accuracy": 0.895 }
  ],
  "feature_comparison": [
    { "method": "Color Histogram", "accuracy": 0.82 },
    { "method": "LBP", "accuracy": 0.86 },
    { "method": "HOG", "accuracy": 0.84 },
    { "method": "Histogram + LBP", "accuracy": 0.895 }
  ],
  "model_info": {
    "algorithm": "KNN",
    "k_value": 7,
    "input_size": [128, 128, 3],
    "classes": ["Organik", "Non-Organik"],
    "trained_at": "2026-06-01T00:00:00Z",
    "train_size": 800,
    "test_size": 200
  }
}
```

### 7.3 `GET /api/history` & `DELETE /api/history/{id}`
- List riwayat (paginated, dengan filter `prediction` dan search `file_name`) + penghapusan satu entri.

### 7.4 Catatan Integrasi
- Thumbnail K-tetangga dikirim sebagai URL path dari Supabase Storage (atau base64 pada fase awal).
- Validasi format RGB diduplikasi di backend.
- CORS diaktifkan untuk origin frontend Next.js selama pengembangan.

---

## 8. Definisi Selesai (Definition of Done — MVP UI)

MVP UI dinyatakan selesai apabila:

1. Seluruh rute R1–R7 dapat dinavigasi tanpa error, dengan breadcrumb dan metadata yang benar.
2. Alur klasifikasi penuh (upload → stepper → hasil + K-tetangga + rekomendasi pengelolaan) berjalan dengan data simulasi.
3. Semua data dummy berasal dari satu sumber (`lib/mock-data.ts`) dan seluruh akses data melalui `lib/api.ts`.
4. Tabel riwayat mendukung search, filter, sort, pagination, dan export CSV.
5. Halaman performa menampilkan 4 metrik, Confusion Matrix, kurva K-optimization, dan perbandingan fitur.
6. Layout responsif (mobile & desktop) dan konsisten pada dark mode.
7. Halaman Panduan Pengelolaan menampilkan informasi edukasi yang informatif dan mudah dipahami masyarakat umum.
