import { ClassificationResult, ModelMetrics } from "./types"
import { mockMetrics, SVGS } from "./mock-data"
import { supabase } from "./supabase"

const PUBLIC_HISTORY_KEY = "wastesort_public_history"

// API configuration dynamically built from HF space name or custom URL env variables
const HF_SPACE_NAME = process.env.NEXT_PUBLIC_HF_SPACE_NAME || ""
const API_BASE_URL = HF_SPACE_NAME
  ? `https://${HF_SPACE_NAME.replace(/\/$/, "")}.hf.space`
  : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "")


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
    
    // Add small noise for lower confidence: e.g. rank 6 and 7 could mismatch
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

// Extract clean filename from URL path
function extractFilename(url: string): string {
  try {
    const decoded = decodeURIComponent(url)
    const parts = decoded.split('/')
    const lastPart = parts[parts.length - 1]
    // Remove timestamp and scaling prefix from filename if present
    return lastPart.replace(/^\d+_(scaled_)?/, '')
  } catch {
    return "sampah.jpg"
  }
}

interface ScanHistoryRow {
  id: string
  user_id: string
  confidence: number
  image_url: string
  category: string
  created_at: string
}

// Map database row to ClassificationResult interface
function mapDbToClassificationResult(item: ScanHistoryRow): ClassificationResult {
  const prediction = item.category as "Organik" | "Non-Organik"
  const confidence = item.confidence
  const neighbors = generateMockNeighbors(prediction, confidence, item.id)

  return {
    id: item.id,
    filename: extractFilename(item.image_url || ""),
    prediction,
    confidence,
    k_value: 7,
    neighbors,
    original_image_url: item.image_url || "",
    preprocessing: {
      resized_to: [128, 128],
      normalized: true
    },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: 0.42,
    created_at: item.created_at
  }
}

// Read history (Supabase for logged in user, localStorage for guest/public user)
export async function getHistory(): Promise<ClassificationResult[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return getLocalHistory()
  }

  const { data, error } = await supabase
    .from("scan_histories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch history from Supabase:", error)
    return []
  }

  return (data || []).map(mapDbToClassificationResult)
}

// Get single item by ID
export async function getHistoryItemById(id: string): Promise<ClassificationResult | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const local = getLocalHistory()
    return local.find(item => item.id === id) || null
  }

  const { data, error } = await supabase
    .from("scan_histories")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    console.error(`Failed to fetch history item #${id}:`, error)
    return null
  }

  return mapDbToClassificationResult(data)
}

// Save to history (primarily handled in classifyImage, fallback kept for compatibility)
export async function saveToHistory(result: ClassificationResult): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const local = getLocalHistory()
    if (!local.some(item => item.id === result.id)) {
      saveLocalHistory([result, ...local])
    }
    return
  }
  console.log("saveToHistory called for", result.id)
}

// Delete item
export async function deleteHistoryItem(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const local = getLocalHistory()
    const updated = local.filter(item => item.id !== id)
    saveLocalHistory(updated)
    return
  }

  const { error } = await supabase
    .from("scan_histories")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(`Failed to delete history item #${id}:`, error)
    throw error
  }
}

// Clear all history for current user
export async function clearHistory(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    saveLocalHistory([])
    return
  }

  const { error } = await supabase
    .from("scan_histories")
    .delete()
    .eq("user_id", user.id)

  if (error) {
    console.error("Failed to clear history:", error)
    throw error
  }
}

// Check connection status of FastAPI backend
// Tries /api/info first (HF Space), then falls back to / (local API)
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

// Fetch model metrics from FastAPI backend with fallback to mock metrics
export async function getMetrics(): Promise<ModelMetrics> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/metrics`, {
      headers: { accept: "application/json" },
    })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return await res.json() as ModelMetrics
  } catch (error) {
    console.error("Failed to fetch metrics from FastAPI, falling back to mock data:", error)
    return mockMetrics
  }
}

// Classification engine connected to FastAPI backend, saving to Supabase for authenticated users
export async function classifyImage(file: File): Promise<ClassificationResult> {
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Send the file to the FastAPI classify endpoint
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

  // Map and sanitize response to match ClassificationResult type
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

  // GUEST MODE FALLBACK
  if (!user) {
    const local = getLocalHistory()
    saveLocalHistory([apiResult, ...local])
    return apiResult
  }

  // SIGNED IN USER MODE
  // 1. Upload image to Supabase Storage in 'scans' bucket
  const fileExt = file.name.split('.').pop() || "jpg"
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, "_")
  const filePath = `${user.id}/${Date.now()}_${cleanFileName}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from("scans")
    .upload(filePath, file)

  if (uploadError) {
    console.error("Storage upload failed:", uploadError)
    throw new Error("Gagal mengunggah citra ke storage: " + uploadError.message)
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from("scans")
    .getPublicUrl(filePath)

  // 3. Save scan metadata to public.scan_histories table
  const { data: insertData, error: insertError } = await supabase
    .from("scan_histories")
    .insert({
      id: apiResult.id,
      user_id: user.id,
      confidence: apiResult.confidence,
      image_url: publicUrl,
      category: apiResult.prediction,
      created_at: apiResult.created_at
    })
    .select()
    .single()

  if (insertError) {
    console.error("Database insert failed:", insertError)
    // Cleanup uploaded file on DB failure
    await supabase.storage.from("scans").remove([filePath])
    throw new Error("Gagal menyimpan riwayat klasifikasi ke database: " + insertError.message)
  }

  // Map database row to ClassificationResult interface, but use the real neighbors returned from API!
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
