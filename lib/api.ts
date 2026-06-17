import { ClassificationResult, ModelMetrics } from "./types"
import { mockMetrics, SVGS } from "./mock-data"
import { supabase } from "./supabase"

const PUBLIC_HISTORY_KEY = "wastesort_public_history"
const SESSION_KEY = "wastesort_session_id"

// API configuration dynamically built from HF space name or custom URL env variables
const HF_SPACE_NAME = process.env.NEXT_PUBLIC_HF_SPACE_NAME || ""
const API_BASE_URL = HF_SPACE_NAME
  ? `https://${HF_SPACE_NAME.replace(/\/$/, "")}.hf.space`
  : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "")

// Helper to get or create a session ID for tracking visitors
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "SES-SERVER"
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = `SES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

// Helper to retrieve public guest history from localStorage
function getLocalHistory(): ClassificationResult[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(PUBLIC_HISTORY_KEY)
  if (!data) return []
  try {
    return JSON.parse(data) as ClassificationResult[]
  } catch {
    return []
  }
}

// Helper to save public guest history to localStorage
function saveLocalHistory(history: ClassificationResult[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PUBLIC_HISTORY_KEY, JSON.stringify(history))
}

// Deterministic mock neighbors generator for UI premium features
function generateMockNeighbors(
  prediction: "Organik" | "Non-Organik",
  confidence: number,
  id: string
) {
  const k_value = 7
  const seedNum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return Array.from({ length: k_value }).map((_, index) => {
    const rank = index + 1
    let label: "Organik" | "Non-Organik" = prediction

    if (confidence < 0.85 && index >= 5) {
      label = prediction === "Organik" ? "Non-Organik" : "Organik"
    }

    const categories = label === "Organik"
      ? ["Dedaunan", "Sisa Buah", "Sisa Makanan", "Sisa Sayuran"]
      : ["Botol Plastik", "Kaleng Minuman", "Kardus/Karton", "Kertas/Buku", "Kemasan Plastik"]

    const categoryIndex = (seedNum + index) % categories.length
    const category = categories[categoryIndex]

    const distance = parseFloat((0.01 + index * 0.02 + ((seedNum + index) % 10) * 0.001).toFixed(3))

    let thumbnail_url = SVGS.leaf
    if (label === "Organik") {
      const urls = [SVGS.leaf, SVGS.apple, SVGS.banana, SVGS.orange]
      thumbnail_url = urls[(seedNum + index) % urls.length]
    } else {
      const urls = [SVGS.bottle, SVGS.can, SVGS.box, SVGS.paper]
      thumbnail_url = urls[(seedNum + index) % urls.length]
    }

    return { rank, label, category, distance, thumbnail_url }
  })
}

// The new 4-table interface
interface ScanHistoryRow {
  klasifikasi_id: string
  session_id: string
  kategori_id: number
  nama_gambar: string
  path_gambar: string
  confidence: number
  tanggal_klasifikasi: string
}

// Map database row to ClassificationResult interface
function mapDbToClassificationResult(item: ScanHistoryRow): ClassificationResult {
  const prediction = item.kategori_id === 1 ? "Organik" : "Non-Organik"
  const confidence = Number(item.confidence)
  const neighbors = generateMockNeighbors(prediction, confidence, item.klasifikasi_id)

  return {
    id: item.klasifikasi_id,
    filename: item.nama_gambar || "sampah.jpg",
    prediction,
    confidence,
    k_value: 7,
    neighbors,
    original_image_url: item.path_gambar || "",
    preprocessing: {
      resized_to: [128, 128],
      normalized: true
    },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.42,
    created_at: item.tanggal_klasifikasi
  }
}

// Read history for current visitor (using session_id)
export async function getHistory(): Promise<ClassificationResult[]> {
  const sessionId = getOrCreateSessionId()

  const { data, error } = await supabase
    .from("hasil_klasifikasi")
    .select("*")
    .eq("session_id", sessionId)
    .order("tanggal_klasifikasi", { ascending: false })

  if (error) {
    console.warn("Supabase fetch fallback to localStorage:", error?.message || "unknown")
    return getLocalHistory()
  }

  return (data || []).map(mapDbToClassificationResult)
}

// Read all history (For Admin Dashboard)
export async function getAllHistory(): Promise<ClassificationResult[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return [] // Protect admin route

  const { data, error } = await supabase
    .from("hasil_klasifikasi")
    .select("*")
    .order("tanggal_klasifikasi", { ascending: false })

  if (error) {
    console.warn("Failed to fetch all history from Supabase (table might not exist yet):", error.message)
    
    // FALLBACK: Return local history if available, else mock data so Admin can preview UI
    const local = getLocalHistory()
    if (local.length > 0) return local

    return [
      {
        id: "mock_1",
        filename: "apel_sisa_makanan.jpg",
        prediction: "Organik",
        confidence: 0.942,
        k_value: 7,
        neighbors: [],
        original_image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80",
        preprocessing: { resized_to: [128, 128], normalized: true },
        features_used: ["Warna RGB", "Tekstur GLCM"],
        execution_time_seconds: 0.45,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
      },
      {
        id: "mock_2",
        filename: "botol_plastik_bekas.jpg",
        prediction: "Non-Organik",
        confidence: 0.885,
        k_value: 7,
        neighbors: [],
        original_image_url: "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=300&auto=format&fit=crop&q=80",
        preprocessing: { resized_to: [128, 128], normalized: true },
        features_used: ["Warna RGB", "Tekstur GLCM"],
        execution_time_seconds: 0.52,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hrs ago
      },
      {
        id: "mock_3",
        filename: "daun_kering_gugur.jpg",
        prediction: "Organik",
        confidence: 0.91,
        k_value: 7,
        neighbors: [],
        original_image_url: "https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?w=300&auto=format&fit=crop&q=80",
        preprocessing: { resized_to: [128, 128], normalized: true },
        features_used: ["Warna RGB", "Tekstur GLCM"],
        execution_time_seconds: 0.38,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
      }
    ]
  }

  return (data || []).map(mapDbToClassificationResult)
}

// Get single item by ID
export async function getHistoryItemById(id: string): Promise<ClassificationResult | null> {
  const { data, error } = await supabase
    .from("hasil_klasifikasi")
    .select("*")
    .eq("klasifikasi_id", id)
    .single()

  if (error || !data) {
    console.warn(`History item #${id} not in DB, checking localStorage`)
    const local = getLocalHistory()
    return local.find(item => item.id === id) || null
  }

  return mapDbToClassificationResult(data)
}

// Delete item
export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("hasil_klasifikasi")
      .delete()
      .eq("klasifikasi_id", id)

    if (error?.message) {
      console.warn(`DB delete fallback for #${id}:`, error.message)
    }
  } catch (e) {
    console.warn("DB delete unavailable, using localStorage only")
  }

  const local = getLocalHistory()
  const updated = local.filter(item => item.id !== id)
  saveLocalHistory(updated)
}

// Clear all history for current visitor session
export async function clearHistory(): Promise<void> {
  const sessionId = getOrCreateSessionId()

  try {
    const { error } = await supabase
      .from("hasil_klasifikasi")
      .delete()
      .eq("session_id", sessionId)

    if (error?.message) {
      console.warn("DB clear fallback:", error.message)
    }
  } catch (e) {
    console.warn("DB clear unavailable, clearing localStorage only")
  }

  saveLocalHistory([])
}

// ── Admin-specific functions ──

// Admin: Delete a single history item (no session filter)
export async function adminDeleteHistoryItem(id: string): Promise<void> {
  // Try deleting from database first
  try {
    const { error } = await supabase
      .from("hasil_klasifikasi")
      .delete()
      .eq("klasifikasi_id", id)

    if (error?.message) {
      console.warn(`DB delete failed (falling back to local):`, error.message)
    }
  } catch (e) {
    console.warn("DB delete exception, falling back to local storage")
  }

  // Always remove from localStorage too
  const local = getLocalHistory()
  const updated = local.filter(item => item.id !== id)
  saveLocalHistory(updated)
}

// Admin: Clear ALL history across all sessions
export async function adminClearAllHistory(): Promise<void> {
  // Try clearing from database first
  try {
    const { error } = await supabase
      .from("hasil_klasifikasi")
      .delete()
      .neq("klasifikasi_id", "__never_match__")

    if (error?.message) {
      console.warn("DB clear failed (falling back to local):", error.message)
    }
  } catch (e) {
    console.warn("DB clear exception, falling back to local storage")
  }

  // Always clear localStorage
  saveLocalHistory([])
}

export async function checkApiConnection(): Promise<{
  connected: boolean
  status?: string
  modelStatus?: string
  kValue?: number
}> {
  const endpoints = [`${API_BASE_URL}/api/info`, `${API_BASE_URL}/`]

  for (const url of endpoints) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)

      const res = await fetch(url, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!res.ok) continue

      const data = await res.json()
      return {
        connected: true,
        status: data.status,
        modelStatus: data.model_status,
        kValue: data.k_value,
      }
    } catch {
      // try next endpoint
    }
  }

  return { connected: false }
}

export async function getMetrics(): Promise<ModelMetrics> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/metrics`, {
      headers: { accept: "application/json" },
    })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json() as any
    if (!data.distance_comparison) {
      data.distance_comparison = mockMetrics.distance_comparison
    }
    return data as ModelMetrics
  } catch (error) {
    console.error("Failed to fetch metrics from FastAPI, falling back to mock data:", error)
    return mockMetrics
  }
}

export async function classifyImage(file: File): Promise<ClassificationResult> {
  const sessionId = getOrCreateSessionId()

  // 0. Pastikan session_pengunjung terdaftar di database
  const { error: sessionError } = await supabase
    .from("session_pengunjung")
    .upsert(
      { session_id: sessionId, last_activity: new Date().toISOString() }, 
      { onConflict: "session_id" }
    )
  
  if (sessionError) {
    console.warn("Could not upsert session (ignore if RLS blocks):", sessionError)
  }

  // 1. Kirim gambar ke FastAPI Backend
  let rawResult: any = null
  try {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch(`${API_BASE_URL}/api/classify`, {
      method: "POST",
      headers: { accept: "application/json" },
      body: formData,
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    rawResult = await response.json()
  } catch (error) {
    console.error("Failed to classify image using FastAPI backend:", error)
    throw new Error("Gagal mengklasifikasikan citra: " + (error instanceof Error ? error.message : String(error)))
  }

  const apiResult: ClassificationResult = {
    id: rawResult.id || `cls_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    filename: rawResult.filename || file.name,
    prediction: rawResult.prediction as "Organik" | "Non-Organik",
    confidence: typeof rawResult.confidence === 'number'
      ? rawResult.confidence
      : (typeof rawResult.confidence_percent === 'number' ? rawResult.confidence_percent / 100 : 1.0),
    k_value: rawResult.k_value || rawResult.k_neighbors_count || 11,
    neighbors: (rawResult.neighbors || []).map((n: any) => {
      const label = (n.label === "organik" || n.label === "Organik") ? "Organik" : "Non-Organik"
      const categories = label === "Organik"
        ? ["Dedaunan", "Sisa Buah", "Sisa Makanan", "Sisa Sayuran"]
        : ["Botol Plastik", "Kaleng Minuman", "Kardus/Karton", "Kertas/Buku", "Kemasan Plastik"]
      const category = n.category || categories[(n.rank - 1) % categories.length]

      let thumbnail_url = n.thumbnail_url
      if (!thumbnail_url) {
        if (label === "Organik") {
          const urls = [SVGS.leaf, SVGS.apple, SVGS.banana, SVGS.orange]
          thumbnail_url = urls[(n.rank - 1) % urls.length]
        } else {
          const urls = [SVGS.bottle, SVGS.can, SVGS.box, SVGS.paper]
          thumbnail_url = urls[(n.rank - 1) % urls.length]
        }
      }

      return {
        rank: n.rank,
        label,
        category,
        distance: n.distance,
        thumbnail_url
      }
    }),
    original_image_url: rawResult.original_image_url || rawResult.processed_image_url || URL.createObjectURL(file),
    preprocessing: rawResult.preprocessing || {
      resized_to: [128, 128],
      normalized: true
    },
    features_used: rawResult.features_used || ["Warna RGB (Mean & Std)", "Tekstur GLCM"],
    execution_time_seconds: rawResult.execution_time_seconds || 0.45,
    created_at: rawResult.created_at || new Date().toISOString()
  }

  // 2. Upload gambar ke Supabase Storage (Bucket: scans)
  const fileExt = file.name.split('.').pop() || "jpg"
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, "_")
  const filePath = `${sessionId}/${Date.now()}_${cleanFileName}.${fileExt}`

  let publicUrl = ""
  const { error: uploadError } = await supabase.storage
    .from("scans")
    .upload(filePath, file)

  if (uploadError) {
    console.warn("Storage upload fallback to local URL:", uploadError?.message || "unknown")
    publicUrl = apiResult.original_image_url
  } else {
    const { data: { publicUrl: url } } = supabase.storage
      .from("scans")
      .getPublicUrl(filePath)
    publicUrl = url
  }

  // 3. Simpan hasil klasifikasi ke tabel 'hasil_klasifikasi'
  const { data: insertData, error: insertError } = await supabase
    .from("hasil_klasifikasi")
    .insert({
      klasifikasi_id: apiResult.id,
      session_id: sessionId,
      kategori_id: apiResult.prediction === "Organik" ? 1 : 2,
      nama_gambar: apiResult.filename,
      path_gambar: publicUrl,
      confidence: apiResult.confidence,
      tanggal_klasifikasi: apiResult.created_at
    })
    .select()
    .single()

  // Tetap simpan ke localStorage sebagai cache cepat
  const local = getLocalHistory()
  saveLocalHistory([apiResult, ...local])

  if (insertError) {
    console.warn("DB insert fallback (schema cache not ready):", insertError?.message || "unknown")
    // Data tetap tersimpan di localStorage, kembalikan data API murni
    return { ...apiResult, original_image_url: publicUrl }
  }

  // Gabungkan data dari DB dengan detail neighbors dari API
  const mappedResult = mapDbToClassificationResult(insertData)
  return {
    ...mappedResult,
    prediction: apiResult.prediction,
    confidence: apiResult.confidence,
    neighbors: apiResult.neighbors,
    k_value: apiResult.k_value,
    features_used: apiResult.features_used,
    execution_time_seconds: apiResult.execution_time_seconds,
  }
}
