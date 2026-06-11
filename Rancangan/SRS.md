# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
# WEB WASTESORT — Sistem Klasifikasi Sampah Organik & Non-Organik

---

## 1. Pendahuluan

### 1.1 Tujuan Sistem

Sistem ini dibangun untuk mengklasifikasikan jenis sampah rumah tangga (Organik dan Non-Organik) berdasarkan citra visual menggunakan algoritma *K-Nearest Neighbor* (KNN). Sistem mengintegrasikan pipeline ekstraksi fitur citra (Color Histogram, LBP, HOG) sebagai representasi vektor fitur masukan model KNN, serta menyediakan antarmuka web yang transparan bagi pengguna untuk memahami hasil klasifikasi beserta rekomendasi pengelolaan limbah.

### 1.2 Batasan Sistem

- Input sistem difokuskan pada **citra statis (foto) dengan format RGB** dan tidak mendukung pemrosesan video.
- Analisis hanya dilakukan pada aspek **visual citra sampah**, sehingga sistem tidak memproses teks, label produk, atau metadata lainnya.
- Klasifikasi menghasilkan **dua kelas**: `Organik` dan `Non-Organik`.
- Sistem hanya menggunakan **satu jenis algoritma (KNN)** tanpa perbandingan metode lain.
- Sumber data mencakup dataset publik terbuka (mis. Garbage Classification Dataset) dan citra sampah dokumentasi mandiri dari lingkungan rumah tangga.
- Nilai K pada KNN ditentukan melalui eksperimen *cross-validation* (grid search K=1 hingga K=20).

---

## 2. Kebutuhan Fungsional (*Functional Requirements*)

Sistem wajib memiliki kemampuan berikut:

| Kode | Kebutuhan | Keterangan |
| :--- | :--- | :--- |
| FR-01 | **Menerima Input Citra Digital** | Sistem harus memiliki fungsi untuk menerima input berupa citra sampah rumah tangga dari pengguna (JPG/PNG/WebP). |
| FR-02 | **Melakukan *Preprocessing* Citra** | Sistem harus mampu melakukan *resize* (penyesuaian ukuran ke dimensi standar), normalisasi nilai piksel, dan konversi ruang warna. |
| FR-03 | **Mengekstraksi Fitur Citra** | Sistem harus mampu mengekstraksi vektor fitur dari citra menggunakan metode Color Histogram, LBP (*Local Binary Pattern*), dan/atau HOG (*Histogram of Oriented Gradients*). |
| FR-04 | **Melatih dan Menguji Model KNN** | Sistem harus memiliki fungsi untuk melatih model KNN menggunakan dataset berlabel dan mengujinya dengan data uji terpisah (pembagian train/test minimal 80:20). |
| FR-05 | **Mengklasifikasikan Sampah** | Sistem harus mampu menentukan label kelas (`Organik` atau `Non-Organik`) dari citra sampah yang diunggah pengguna. |
| FR-06 | **Menampilkan Confidence & K-Tetangga** | Sistem harus menampilkan tingkat keyakinan prediksi dan visualisasi K-tetangga terdekat (thumbnail citra referensi yang paling mirip). |
| FR-07 | **Kalkulasi Metrik Evaluasi** | Sistem harus bisa menghitung dan menampilkan kinerja model berdasarkan parameter: **akurasi, presisi, *recall*, dan F1-score**. |
| FR-08 | **Menampilkan Rekomendasi Pengelolaan** | Berdasarkan kelas hasil klasifikasi, sistem harus menampilkan panduan pengelolaan sampah yang sesuai. |

---

## 3. Kebutuhan Data (*Data Requirements*)

Untuk mendukung proses pengolahan dan analisis, sistem mewajibkan pengelolaan jenis data berikut:

- Dataset berisi **citra sampah Organik** (sisa makanan, daun, sayuran, buah, dan sejenisnya).
- Dataset berisi **citra sampah Non-Organik** (plastik, kertas, kaca, logam, kardus, dan sejenisnya).
- Vektor fitur hasil ekstraksi untuk setiap citra pada dataset latih (disimpan sebagai referensi KNN).
- Data hasil evaluasi performa klasifikasi sistem (akurasi, presisi, recall, F1-score, confusion matrix).

---

## 4. Interaksi dan Pemodelan Sistem

### 4.1 Pengguna Sistem (Diagram Konteks)

Sistem berinteraksi dengan dua entitas eksternal utama:

- **Pengguna Umum (Masyarakat / Rumah Tangga):** Mengunggah citra sampah dan menerima hasil klasifikasi beserta rekomendasi.
- **Peneliti / Administrator:** Mengelola model, dataset, dan memantau performa evaluasi sistem.

### 4.2 Fungsi Pengguna (*Use Case*)

Melalui sistem, pengguna dapat melakukan aktivitas:

- Mengunggah citra sampah rumah tangga.
- Melihat hasil klasifikasi (label, confidence, K-tetangga terdekat).
- Membaca rekomendasi pengelolaan sampah.
- Melihat riwayat klasifikasi sebelumnya.
- Meninjau performa dan evaluasi model KNN.

### 4.3 Alur Sistem (*Activity Diagram*)

Sistem beroperasi secara berurutan (*Input-Process-Output*):

```
Input Citra → Preprocessing → Ekstraksi Fitur → Klasifikasi KNN
    → Tampilkan Hasil (Label + Confidence + K-Tetangga)
    → Tampilkan Rekomendasi Pengelolaan
```

---

## 5. Kebutuhan Lingkungan Implementasi (*Environment*)

| Komponen | Teknologi |
| :--- | :--- |
| Bahasa Pemrograman *Back-End* | Python 3.x |
| Library ML | scikit-learn (KNN, preprocessing, metrik evaluasi) |
| Library Citra | OpenCV, Pillow, scikit-image (ekstraksi fitur) |
| Library Numerik | NumPy, SciPy |
| API *Back-End* | FastAPI atau Flask |
| *Front-End* | Next.js (React) + Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Penyimpanan File | Supabase Storage |
| Deployment Model | HuggingFace Spaces / Inference Endpoint |
