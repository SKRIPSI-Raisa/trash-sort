import { ClassificationResult, ModelMetrics } from "./types"
import { mockMetrics, SVGS } from "./mock-data"
import { supabase } from "./supabase"

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

// Read history from Supabase
export async function getHistory(): Promise<ClassificationResult[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

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

// Save to history (now handled directly in classifyImage, kept for type compatibility)
export async function saveToHistory(result: ClassificationResult): Promise<void> {
  // No-op because it's handled at creation time.
  console.log("saveToHistory called for", result.id)
}

// Delete item
export async function deleteHistoryItem(id: string): Promise<void> {
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
  if (!user) return

  const { error } = await supabase
    .from("scan_histories")
    .delete()
    .eq("user_id", user.id)

  if (error) {
    console.error("Failed to clear history:", error)
    throw error
  }
}

// Fetch model metrics (statically mocked as the DB lacks model metrics tables)
export async function getMetrics(): Promise<ModelMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockMetrics
}

// Classification engine connected to Supabase Database and Storage
export async function classifyImage(file: File): Promise<ClassificationResult> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Pengguna harus masuk terlebih dahulu.")
  }

  // 1. Upload image to Supabase Storage in 'scans' bucket
  const fileExt = file.name.split('.').pop() || "jpg"
  // Clean filename for safety in URL
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

  // 3. Classify local file (simulated algorithm based on filename keywords)
  const nameLower = file.name.toLowerCase()
  const organicKeywords = ["daun", "apel", "pisang", "sayur", "nasi", "roti", "jeruk", "makanan", "buah", "tulang", "kulit", "organik", "daon", "sampah_kebun"]
  const nonOrganicKeywords = ["plastik", "botol", "kaleng", "kardus", "kertas", "kresek", "gelas", "snack", "chiki", "box", "besi", "logam", "kaca", "beling", "non"]

  let prediction: "Organik" | "Non-Organik" = "Organik"
  
  const isOrganicWord = organicKeywords.some((keyword) => nameLower.includes(keyword))
  const isNonOrganicWord = nonOrganicKeywords.some((keyword) => nameLower.includes(keyword))

  if (isNonOrganicWord) {
    prediction = "Non-Organik"
  } else if (isOrganicWord) {
    prediction = "Organik"
  } else {
    prediction = Math.random() > 0.5 ? "Organik" : "Non-Organik"
  }

  const confidence = parseFloat((0.70 + Math.random() * 0.28).toFixed(2)) // 70% to 98%
  const scanId = crypto.randomUUID()

  // 4. Save scan metadata to public.scan_histories table
  const { data: insertData, error: insertError } = await supabase
    .from("scan_histories")
    .insert({
      id: scanId,
      user_id: user.id,
      confidence: confidence,
      image_url: publicUrl,
      category: prediction,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (insertError) {
    console.error("Database insert failed:", insertError)
    // Cleanup uploaded file from storage on database insert failure
    await supabase.storage.from("scans").remove([filePath])
    throw new Error("Gagal menyimpan riwayat klasifikasi ke database: " + insertError.message)
  }

  return mapDbToClassificationResult(insertData)
}
