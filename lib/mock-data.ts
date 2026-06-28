import { ClassificationResult, ModelMetrics, WasteGuide } from "./types"

// Beautiful SVG Data URLs representing trash items for direct rendering
export const SVGS = {
  leaf: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"/><path d="M9 22v-4h4"/></svg>`,
  apple: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6c.5-1.5 2-2.5 3.5-1.5M10 2c.5 1 1.5 2 2 4"/></svg>`,
  banana: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22c7 0 12-3 15-8 2-3.3 2-7.5 0-11-2.5 2-3 5.5-5.5 8.5C11 14.5 7.5 15 4 15c-1 0-3-.5-4-1 1 2 2 5.5 4 8z"/></svg>`,
  orange: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>`,
  bottle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v3h-4z"/><path d="M6 9V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a4 4 0 0 1-1 2.6L16 16v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5l-1-3.4A4 4 0 0 1 6 9z"/></svg>`,
  can: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="6" ry="2"/><path d="M6 5v14c0 1.1.9 2 6 2s6-.9 6-2V5"/><path d="M6 12c0 1.1.9 2 6 2s6-.9 6-2"/></svg>`,
  box: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23a16207" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>`,
  paper: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`
}

export const mockHistory: ClassificationResult[] = [
  {
    id: "cls_20260612_001",
    filename: "daun_kering_kebun.jpg",
    prediction: "Organik",
    confidence: 1.0,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Organik", category: "Dedaunan", distance: 0.042, thumbnail_url: SVGS.leaf },
      { rank: 2, label: "Organik", category: "Dedaunan", distance: 0.051, thumbnail_url: SVGS.leaf },
      { rank: 3, label: "Organik", category: "Ranting Kayu", distance: 0.083, thumbnail_url: SVGS.leaf },
      { rank: 4, label: "Organik", category: "Dedaunan", distance: 0.091, thumbnail_url: SVGS.leaf },
      { rank: 5, label: "Organik", category: "Dedaunan", distance: 0.112, thumbnail_url: SVGS.leaf },
      { rank: 6, label: "Organik", category: "Sisa Buah", distance: 0.125, thumbnail_url: SVGS.apple },
      { rank: 7, label: "Organik", category: "Dedaunan", distance: 0.141, thumbnail_url: SVGS.leaf }
    ],
    original_image_url: SVGS.leaf,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.54,
    created_at: "2026-06-11T23:30:00Z"
  },
  {
    id: "cls_20260612_002",
    filename: "botol_minum_plastik.png",
    prediction: "Non-Organik",
    confidence: 0.857,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Non-Organik", category: "Botol Plastik", distance: 0.031, thumbnail_url: SVGS.bottle },
      { rank: 2, label: "Non-Organik", category: "Botol Plastik", distance: 0.045, thumbnail_url: SVGS.bottle },
      { rank: 3, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.062, thumbnail_url: SVGS.bottle },
      { rank: 4, label: "Non-Organik", category: "Gelas Plastik", distance: 0.078, thumbnail_url: SVGS.bottle },
      { rank: 5, label: "Non-Organik", category: "Botol Plastik", distance: 0.089, thumbnail_url: SVGS.bottle },
      { rank: 6, label: "Non-Organik", category: "Kaleng Minuman", distance: 0.104, thumbnail_url: SVGS.can },
      { rank: 7, label: "Organik", category: "Sisa Buah", distance: 0.155, thumbnail_url: SVGS.apple }
    ],
    original_image_url: SVGS.bottle,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.62,
    created_at: "2026-06-11T20:15:00Z"
  },
  {
    id: "cls_20260612_003",
    filename: "sisa_apel_merah.jpg",
    prediction: "Organik",
    confidence: 0.857,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Organik", category: "Sisa Buah", distance: 0.022, thumbnail_url: SVGS.apple },
      { rank: 2, label: "Organik", category: "Sisa Buah", distance: 0.035, thumbnail_url: SVGS.apple },
      { rank: 3, label: "Organik", category: "Sisa Sayuran", distance: 0.059, thumbnail_url: SVGS.leaf },
      { rank: 4, label: "Organik", category: "Sisa Buah", distance: 0.071, thumbnail_url: SVGS.orange },
      { rank: 5, label: "Organik", category: "Sisa Buah", distance: 0.092, thumbnail_url: SVGS.banana },
      { rank: 6, label: "Organik", category: "Dedaunan", distance: 0.122, thumbnail_url: SVGS.leaf },
      { rank: 7, label: "Non-Organik", category: "Kantong Plastik", distance: 0.168, thumbnail_url: SVGS.paper }
    ],
    original_image_url: SVGS.apple,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.49,
    created_at: "2026-06-11T16:40:00Z"
  },
  {
    id: "cls_20260612_004",
    filename: "kardus_bekas_paket.png",
    prediction: "Non-Organik",
    confidence: 1.0,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Non-Organik", category: "Kardus/Karton", distance: 0.012, thumbnail_url: SVGS.box },
      { rank: 2, label: "Non-Organik", category: "Kardus/Karton", distance: 0.028, thumbnail_url: SVGS.box },
      { rank: 3, label: "Non-Organik", category: "Kardus/Karton", distance: 0.041, thumbnail_url: SVGS.box },
      { rank: 4, label: "Non-Organik", category: "Kertas/Buku", distance: 0.065, thumbnail_url: SVGS.paper },
      { rank: 5, label: "Non-Organik", category: "Kardus/Karton", distance: 0.079, thumbnail_url: SVGS.box },
      { rank: 6, label: "Non-Organik", category: "Kertas/Buku", distance: 0.093, thumbnail_url: SVGS.paper },
      { rank: 7, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.111, thumbnail_url: SVGS.bottle }
    ],
    original_image_url: SVGS.box,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.58,
    created_at: "2026-06-11T11:20:00Z"
  },
  {
    id: "cls_20260612_005",
    filename: "kulit_pisang_raja.jpg",
    prediction: "Organik",
    confidence: 1.0,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Organik", category: "Sisa Buah", distance: 0.015, thumbnail_url: SVGS.banana },
      { rank: 2, label: "Organik", category: "Sisa Buah", distance: 0.024, thumbnail_url: SVGS.banana },
      { rank: 3, label: "Organik", category: "Sisa Buah", distance: 0.045, thumbnail_url: SVGS.banana },
      { rank: 4, label: "Organik", category: "Sisa Buah", distance: 0.059, thumbnail_url: SVGS.orange },
      { rank: 5, label: "Organik", category: "Sisa Buah", distance: 0.078, thumbnail_url: SVGS.apple },
      { rank: 6, label: "Organik", category: "Sisa Sayuran", distance: 0.091, thumbnail_url: SVGS.leaf },
      { rank: 7, label: "Organik", category: "Dedaunan", distance: 0.105, thumbnail_url: SVGS.leaf }
    ],
    original_image_url: SVGS.banana,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.42,
    created_at: "2026-06-10T19:45:00Z"
  },
  {
    id: "cls_20260612_006",
    filename: "kaleng_soda_cola.png",
    prediction: "Non-Organik",
    confidence: 1.0,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Non-Organik", category: "Kaleng Minuman", distance: 0.025, thumbnail_url: SVGS.can },
      { rank: 2, label: "Non-Organik", category: "Kaleng Minuman", distance: 0.038, thumbnail_url: SVGS.can },
      { rank: 3, label: "Non-Organik", category: "Kaleng Minuman", distance: 0.051, thumbnail_url: SVGS.can },
      { rank: 4, label: "Non-Organik", category: "Kemasan Logam", distance: 0.068, thumbnail_url: SVGS.can },
      { rank: 5, label: "Non-Organik", category: "Botol Plastik", distance: 0.095, thumbnail_url: SVGS.bottle },
      { rank: 6, label: "Non-Organik", category: "Kaleng Minuman", distance: 0.111, thumbnail_url: SVGS.can },
      { rank: 7, label: "Non-Organik", category: "Kardus/Karton", distance: 0.129, thumbnail_url: SVGS.box }
    ],
    original_image_url: SVGS.can,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.51,
    created_at: "2026-06-10T14:10:00Z"
  },
  {
    id: "cls_20260612_007",
    filename: "sayur_sawi_basi.jpg",
    prediction: "Organik",
    confidence: 0.714,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Organik", category: "Sisa Sayuran", distance: 0.052, thumbnail_url: SVGS.leaf },
      { rank: 2, label: "Organik", category: "Sisa Sayuran", distance: 0.069, thumbnail_url: SVGS.leaf },
      { rank: 3, label: "Organik", category: "Sisa Sayuran", distance: 0.078, thumbnail_url: SVGS.leaf },
      { rank: 4, label: "Organik", category: "Dedaunan", distance: 0.095, thumbnail_url: SVGS.leaf },
      { rank: 5, label: "Organik", category: "Sisa Buah", distance: 0.115, thumbnail_url: SVGS.orange },
      { rank: 6, label: "Non-Organik", category: "Kantong Plastik", distance: 0.142, thumbnail_url: SVGS.paper },
      { rank: 7, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.151, thumbnail_url: SVGS.bottle }
    ],
    original_image_url: SVGS.leaf,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.47,
    created_at: "2026-06-10T09:05:00Z"
  },
  {
    id: "cls_20260612_008",
    filename: "kantong_kresek_putih.png",
    prediction: "Non-Organik",
    confidence: 0.857,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Non-Organik", category: "Kantong Plastik", distance: 0.035, thumbnail_url: SVGS.paper },
      { rank: 2, label: "Non-Organik", category: "Kantong Plastik", distance: 0.048, thumbnail_url: SVGS.paper },
      { rank: 3, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.071, thumbnail_url: SVGS.bottle },
      { rank: 4, label: "Non-Organik", category: "Kantong Plastik", distance: 0.082, thumbnail_url: SVGS.paper },
      { rank: 5, label: "Non-Organik", category: "Kantong Plastik", distance: 0.099, thumbnail_url: SVGS.paper },
      { rank: 6, label: "Non-Organik", category: "Botol Plastik", distance: 0.125, thumbnail_url: SVGS.bottle },
      { rank: 7, label: "Organik", category: "Dedaunan", distance: 0.178, thumbnail_url: SVGS.leaf }
    ],
    original_image_url: SVGS.paper,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.53,
    created_at: "2026-06-09T17:25:00Z"
  },
  {
    id: "cls_20260612_009",
    filename: "sisa_roti_jamuran.jpg",
    prediction: "Organik",
    confidence: 1.0,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Organik", category: "Sisa Makanan", distance: 0.021, thumbnail_url: SVGS.orange },
      { rank: 2, label: "Organik", category: "Sisa Makanan", distance: 0.039, thumbnail_url: SVGS.orange },
      { rank: 3, label: "Organik", category: "Sisa Makanan", distance: 0.051, thumbnail_url: SVGS.orange },
      { rank: 4, label: "Organik", category: "Sisa Buah", distance: 0.074, thumbnail_url: SVGS.apple },
      { rank: 5, label: "Organik", category: "Sisa Sayuran", distance: 0.085, thumbnail_url: SVGS.leaf },
      { rank: 6, label: "Organik", category: "Sisa Makanan", distance: 0.099, thumbnail_url: SVGS.orange },
      { rank: 7, label: "Organik", category: "Sisa Makanan", distance: 0.118, thumbnail_url: SVGS.orange }
    ],
    original_image_url: SVGS.orange,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.44,
    created_at: "2026-06-09T12:50:00Z"
  },
  {
    id: "cls_20260612_010",
    filename: "kertas_hvs_bekas.png",
    prediction: "Non-Organik",
    confidence: 1.0,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Non-Organik", category: "Kertas/Buku", distance: 0.009, thumbnail_url: SVGS.paper },
      { rank: 2, label: "Non-Organik", category: "Kertas/Buku", distance: 0.021, thumbnail_url: SVGS.paper },
      { rank: 3, label: "Non-Organik", category: "Kertas/Buku", distance: 0.038, thumbnail_url: SVGS.paper },
      { rank: 4, label: "Non-Organik", category: "Kertas/Buku", distance: 0.052, thumbnail_url: SVGS.paper },
      { rank: 5, label: "Non-Organik", category: "Kardus/Karton", distance: 0.074, thumbnail_url: SVGS.box },
      { rank: 6, label: "Non-Organik", category: "Kertas/Buku", distance: 0.089, thumbnail_url: SVGS.paper },
      { rank: 7, label: "Non-Organik", category: "Kertas/Buku", distance: 0.104, thumbnail_url: SVGS.paper }
    ],
    original_image_url: SVGS.paper,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.59,
    created_at: "2026-06-08T15:30:00Z"
  },
  {
    id: "cls_20260612_011",
    filename: "kulit_jeruk_manis.jpg",
    prediction: "Organik",
    confidence: 1.0,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Organik", category: "Sisa Buah", distance: 0.019, thumbnail_url: SVGS.orange },
      { rank: 2, label: "Organik", category: "Sisa Buah", distance: 0.028, thumbnail_url: SVGS.orange },
      { rank: 3, label: "Organik", category: "Sisa Buah", distance: 0.041, thumbnail_url: SVGS.orange },
      { rank: 4, label: "Organik", category: "Sisa Buah", distance: 0.058, thumbnail_url: SVGS.apple },
      { rank: 5, label: "Organik", category: "Sisa Buah", distance: 0.073, thumbnail_url: SVGS.banana },
      { rank: 6, label: "Organik", category: "Sisa Sayuran", distance: 0.094, thumbnail_url: SVGS.leaf },
      { rank: 7, label: "Organik", category: "Sisa Buah", distance: 0.111, thumbnail_url: SVGS.orange }
    ],
    original_image_url: SVGS.orange,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.41,
    created_at: "2026-06-08T10:15:00Z"
  },
  {
    id: "cls_20260612_012",
    filename: "gelas_plastik_popice.png",
    prediction: "Non-Organik",
    confidence: 0.857,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Non-Organik", category: "Gelas Plastik", distance: 0.038, thumbnail_url: SVGS.bottle },
      { rank: 2, label: "Non-Organik", category: "Gelas Plastik", distance: 0.049, thumbnail_url: SVGS.bottle },
      { rank: 3, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.068, thumbnail_url: SVGS.bottle },
      { rank: 4, label: "Non-Organik", category: "Gelas Plastik", distance: 0.079, thumbnail_url: SVGS.bottle },
      { rank: 5, label: "Non-Organik", category: "Gelas Plastik", distance: 0.092, thumbnail_url: SVGS.bottle },
      { rank: 6, label: "Non-Organik", category: "Kantong Plastik", distance: 0.115, thumbnail_url: SVGS.paper },
      { rank: 7, label: "Organik", category: "Sisa Makanan", distance: 0.182, thumbnail_url: SVGS.orange }
    ],
    original_image_url: SVGS.bottle,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.61,
    created_at: "2026-06-07T16:20:00Z"
  },
  {
    id: "cls_20260612_013",
    filename: "nasi_putih_basi.jpg",
    prediction: "Organik",
    confidence: 1.0,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Organik", category: "Sisa Makanan", distance: 0.024, thumbnail_url: SVGS.orange },
      { rank: 2, label: "Organik", category: "Sisa Makanan", distance: 0.035, thumbnail_url: SVGS.orange },
      { rank: 3, label: "Organik", category: "Sisa Makanan", distance: 0.049, thumbnail_url: SVGS.orange },
      { rank: 4, label: "Organik", category: "Sisa Makanan", distance: 0.062, thumbnail_url: SVGS.orange },
      { rank: 5, label: "Organik", category: "Sisa Sayuran", distance: 0.082, thumbnail_url: SVGS.leaf },
      { rank: 6, label: "Organik", category: "Sisa Buah", distance: 0.098, thumbnail_url: SVGS.apple },
      { rank: 7, label: "Organik", category: "Sisa Makanan", distance: 0.115, thumbnail_url: SVGS.orange }
    ],
    original_image_url: SVGS.orange,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.45,
    created_at: "2026-06-07T08:45:00Z"
  },
  {
    id: "cls_20260612_014",
    filename: "kemasan_snack_chiki.png",
    prediction: "Non-Organik",
    confidence: 0.714,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.061, thumbnail_url: SVGS.bottle },
      { rank: 2, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.075, thumbnail_url: SVGS.bottle },
      { rank: 3, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.088, thumbnail_url: SVGS.bottle },
      { rank: 4, label: "Non-Organik", category: "Kantong Plastik", distance: 0.099, thumbnail_url: SVGS.paper },
      { rank: 5, label: "Non-Organik", category: "Kemasan Logam", distance: 0.115, thumbnail_url: SVGS.can },
      { rank: 6, label: "Organik", category: "Sisa Buah", distance: 0.138, thumbnail_url: SVGS.orange },
      { rank: 7, label: "Organik", category: "Dedaunan", distance: 0.149, thumbnail_url: SVGS.leaf }
    ],
    original_image_url: SVGS.bottle,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.56,
    created_at: "2026-06-06T14:15:00Z"
  },
  {
    id: "cls_20260612_015",
    filename: "tulang_ayam_goreng.jpg",
    prediction: "Organik",
    confidence: 0.857,
    k_value: 11,
    neighbors: [
      { rank: 1, label: "Organik", category: "Sisa Makanan", distance: 0.038, thumbnail_url: SVGS.orange },
      { rank: 2, label: "Organik", category: "Sisa Makanan", distance: 0.051, thumbnail_url: SVGS.orange },
      { rank: 3, label: "Organik", category: "Sisa Makanan", distance: 0.068, thumbnail_url: SVGS.orange },
      { rank: 4, label: "Organik", category: "Sisa Makanan", distance: 0.082, thumbnail_url: SVGS.orange },
      { rank: 5, label: "Organik", category: "Sisa Sayuran", distance: 0.099, thumbnail_url: SVGS.leaf },
      { rank: 6, label: "Non-Organik", category: "Kemasan Plastik", distance: 0.141, thumbnail_url: SVGS.bottle },
      { rank: 7, label: "Organik", category: "Sisa Makanan", distance: 0.155, thumbnail_url: SVGS.orange }
    ],
    original_image_url: SVGS.orange,
    preprocessing: { resized_to: [128, 128], normalized: true },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.48,
    created_at: "2026-06-06T09:30:00Z"
  }
]

export const mockMetrics: ModelMetrics = {
  accuracy: 0.8361,
  precision: 0.85,
  recall: 0.8361,
  f1_score: 0.8327,
  k_optimal: 11,
  confusion_matrix: {
    tp: 1313, // Predicted Organik, Actual Organik
    tn: 788,  // Predicted Non-Organik, Actual Non-Organik
    fp: 88,   // Predicted Organik, Actual Non-Organik
    fn: 324   // Predicted Non-Organik, Actual Organik
  },
  k_curve: [
    { k: 1, accuracy: 0.790 },
    { k: 3, accuracy: 0.815 },
    { k: 5, accuracy: 0.819 },
    { k: 7, accuracy: 0.827 },
    { k: 9, accuracy: 0.832 },
    { k: 11, accuracy: 0.836 },
    { k: 13, accuracy: 0.834 },
    { k: 15, accuracy: 0.834 }
  ],
  distance_comparison: [
    { metric: "Euclidean", accuracy: 0.8361 },
    { metric: "Manhattan", accuracy: 0.8249 },
    { metric: "Minkowski (p=3)", accuracy: 0.8309 },
    { metric: "Chebyshev", accuracy: 0.8221 }
  ],
  model_info: {
    algorithm: "K-Nearest Neighbors (KNN)",
    k_value: 11,
    input_size: [128, 128, 3],
    classes: ["Organik", "Non-Organik"],
    trained_at: "2026-06-01T08:00:00Z",
    train_size: 22564,
    test_size: 2513
  }
}

export const mockGuides: WasteGuide[] = [
  {
    title: "Sampah Organik",
    type: "Organik",
    icon: "IconLeaf",
    description: "Sampah organik berasal dari makhluk hidup dan dapat terurai secara alami oleh mikroorganisme pembusuk.",
    examples: [
      "Sisa makanan (nasi, sayur, lauk pauk)",
      "Sisa buah-buahan (kulit pisang, apel, jeruk, dll.)",
      "Dedaunan kering dan guguran bunga",
      "Ranting kayu dan rumput kebun",
      "Cangkang telur dan ampas kopi/teh"
    ],
    steps: [
      "Pilah sampah organik dari sampah non-organik di wadah terpisah.",
      "Gunakan komposter atau buat lubang biopori di halaman rumah.",
      "Cincang sampah organik berukuran besar agar lebih cepat membusuk.",
      "Tambahkan aktivator kompos (seperti EM4) dan jaga kelembapan tumpukan.",
      "Dalam 4-6 minggu, kompos siap digunakan sebagai pupuk tanaman."
    ]
  },
  {
    title: "Sampah Non-Organik",
    type: "Non-Organik",
    icon: "IconRecycle",
    description: "Sampah non-organik berasal dari bahan non-hayati (sintetis/tambang) yang sangat sulit atau tidak dapat terurai secara alami.",
    examples: [
      "Botol plastik bekas minuman (PET, HDPE)",
      "Gelas plastik dan kemasan saset makanan",
      "Kardus karton dan kertas bekas",
      "Kaleng minuman alumunium dan wadah logam",
      "Botol kaca dan pecahan beling"
    ],
    steps: [
      "Cuci bersih wadah plastik atau kaleng dari sisa makanan/minuman.",
      "Keringkan wadah agar tidak menimbulkan bau atau mengundang lalat.",
      "Pipihkan botol plastik atau kaleng untuk menghemat ruang penyimpanan.",
      "Kelompokkan berdasarkan kategori (plastik, kertas, logam, kaca).",
      "Salurkan ke Bank Sampah terdekat atau agen daur ulang terpercaya."
    ]
  }
]
