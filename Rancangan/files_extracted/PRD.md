# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# WEB WASTESORT — Sistem Klasifikasi Sampah Organik & Non-Organik

---

## 1. Informasi Umum

| Atribut | Detail |
| :--- | :--- |
| **Nama Produk** | WasteSort (Web Based) |
| **Judul Penelitian** | Pengembangan Model Machine Learning untuk Klasifikasi Jenis Sampah Organik dan Non-Organik pada Sistem Pengelolaan Limbah Rumah Tangga |
| **Tujuan Utama** | Membangun sistem web yang mampu mengklasifikasikan citra sampah rumah tangga ke dalam kategori **Organik** atau **Non-Organik** secara otomatis menggunakan algoritma *K-Nearest Neighbor* (KNN), serta memberikan rekomendasi pengelolaan limbah yang sesuai berdasarkan hasil klasifikasi. |

---

## 2. Latar Belakang Masalah

Pengelolaan sampah rumah tangga di Indonesia masih menghadapi tantangan serius akibat rendahnya kesadaran masyarakat dalam memilah sampah berdasarkan jenisnya. Kesalahan dalam pemilahan sampah organik dan non-organik menyebabkan proses daur ulang terhambat, meningkatkan volume sampah di Tempat Pembuangan Akhir (TPA), serta memperburuk dampak lingkungan.

Sistem berbasis *machine learning* dengan algoritma KNN dapat menjadi solusi otomatisasi pemilahan sampah melalui analisis citra visual. Sistem ini dibangun untuk membantu masyarakat, petugas kebersihan, dan pengelola lingkungan dalam mengidentifikasi jenis sampah secara cepat dan akurat, sekaligus memberikan panduan pengelolaan yang tepat.

---

## 3. Target Pengguna

| Pengguna | Kebutuhan Utama |
| :--- | :--- |
| **Masyarakat Umum / Rumah Tangga** | Mengetahui kategori sampah yang dihasilkan sehari-hari dan cara pengelolaannya yang benar |
| **Peneliti / Akademisi** | Menggunakan sistem untuk evaluasi model KNN, pengujian dataset citra, dan analisis performa klasifikasi |
| **Petugas Kebersihan / Pengelola Lingkungan** | Sebagai alat bantu identifikasi sampah secara cepat dan dasar pengambilan keputusan pengelolaan limbah |

---

## 4. Ruang Lingkup dan Batasan Sistem

Sistem web harus mematuhi batasan masalah berikut:

- Hanya memproses input berupa **citra statis (foto)** dengan format RGB.
- Sistem tidak mendukung pemrosesan video atau analisis teks/deskripsi sampah.
- Sistem menggunakan **K-Nearest Neighbor (KNN)** sebagai satu-satunya algoritma klasifikasi utama.
- Klasifikasi dibatasi pada **dua kelas**: sampah **Organik** dan sampah **Non-Organik**.
- Sistem dirancang untuk menganalisis citra sampah umum yang dihasilkan dari lingkungan rumah tangga.
- Ekstraksi fitur citra menggunakan metode berbasis warna, tekstur, dan bentuk (misalnya histogram warna, HOG, atau LBP).

---

## 5. Kebutuhan Fungsional (Fitur Utama Web)

Berdasarkan rancangan *Input-Process-Output* (IPO) dan *Use Case*, sistem web harus memiliki fitur-fitur berikut:

- **Fitur Input / Unggah Citra:** Web menyediakan antarmuka untuk mengunggah citra sampah rumah tangga (format JPG/PNG/WebP, RGB).
- **Modul *Preprocessing* Otomatis:** Setelah citra diunggah, sistem secara otomatis melakukan *resize*, normalisasi warna, dan ekstraksi fitur (vektor fitur) di sisi *back-end* sebelum dikirim ke model KNN.
- **Fitur Klasifikasi KNN:** Web menjalankan model KNN terlatih untuk menghitung jarak antar fitur citra uji terhadap data latih dan menentukan kelas berdasarkan mayoritas K-tetangga terdekat.
- **Fitur Rekomendasi Pengelolaan:** Berdasarkan hasil klasifikasi, sistem menampilkan panduan singkat pengelolaan sampah yang sesuai (mis. komposting untuk organik, pemilahan daur ulang untuk non-organik).
- **Halaman Hasil Klasifikasi (Output Dashboard):** Menampilkan informasi secara transparan kepada pengguna, yang mencakup:
  - Label hasil klasifikasi: **Organik** atau **Non-Organik**.
  - Tingkat keyakinan/confidence prediksi (berdasarkan proporsi suara K-tetangga).
  - Visualisasi K-tetangga terdekat (thumbnail citra referensi yang paling mirip).
  - Informasi performa/evaluasi model (akurasi, presisi, *recall*, dan F1-score) sebagai referensi keandalan.
  - Rekomendasi cara pengelolaan sampah hasil klasifikasi.

---

## 6. Alur Pengguna (User Flow / Activity)

Berdasarkan *Activity Diagram* dari rancangan sistem, alur pengguna pada web WasteSort adalah sebagai berikut:

1. Pengguna membuka halaman utama web dan mengunggah citra sampah.
2. Sistem melakukan *preprocessing* terhadap citra tersebut (resize + normalisasi + ekstraksi fitur).
3. Sistem mengeksekusi model KNN yang sudah melalui proses pelatihan dan pengujian sebelumnya.
4. Sistem mengklasifikasikan citra ke dalam kategori Organik atau Non-Organik.
5. Sistem menampilkan K-tetangga terdekat sebagai bukti visual pendukung keputusan.
6. Pengguna dialihkan ke halaman hasil untuk melihat label klasifikasi, confidence, visualisasi tetangga terdekat, dan rekomendasi pengelolaan sampah.

---

## 7. Kebutuhan Non-Fungsional (Teknis)

- **Bahasa Pemrograman:** Sistem bagian belakang (*back-end*) dan *core machine learning* diimplementasikan menggunakan bahasa pemrograman **Python** beserta *library* pendukungnya (scikit-learn, OpenCV, NumPy, Pillow).
- **Algoritma:** K-Nearest Neighbor (KNN) dengan nilai K yang ditentukan melalui eksperimen (cross-validation).
- **Metode Ekstraksi Fitur:** Histogram warna (Color Histogram), Local Binary Pattern (LBP), dan/atau Histogram of Oriented Gradients (HOG).
- **Performa Target:** Akurasi klasifikasi minimal 85% pada data uji.
