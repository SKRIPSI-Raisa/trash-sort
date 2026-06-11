import { ClassificationResult, ModelMetrics } from "./types"
import { mockHistory, mockMetrics, SVGS } from "./mock-data"

const HISTORY_KEY = "wastesort_history"

// Helper to initialize history in localStorage if empty
function initializeLocalStorage() {
  if (typeof window === "undefined") return []
  
  const existing = localStorage.getItem(HISTORY_KEY)
  if (!existing) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(mockHistory))
    return mockHistory
  }
  
  try {
    return JSON.parse(existing) as ClassificationResult[]
  } catch (e) {
    console.error("Failed to parse history from localStorage", e)
    return mockHistory
  }
}

// Read history from localStorage
export async function getHistory(): Promise<ClassificationResult[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return initializeLocalStorage()
}

// Get single item by ID
export async function getHistoryItemById(id: string): Promise<ClassificationResult | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const history = initializeLocalStorage()
  return history.find((item) => item.id === id) || null
}

// Save to localStorage history
export async function saveToHistory(result: ClassificationResult): Promise<void> {
  if (typeof window === "undefined") return
  
  const history = initializeLocalStorage()
  // Check if already exists to prevent duplicates
  if (!history.some(item => item.id === result.id)) {
    const updated = [result, ...history]
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  }
}

// Delete item
export async function deleteHistoryItem(id: string): Promise<void> {
  if (typeof window === "undefined") return
  
  await new Promise((resolve) => setTimeout(resolve, 300))
  const history = initializeLocalStorage()
  const updated = history.filter((item) => item.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

// Clear all history
export async function clearHistory(): Promise<void> {
  if (typeof window === "undefined") return
  
  await new Promise((resolve) => setTimeout(resolve, 300))
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]))
}

// Fetch model metrics
export async function getMetrics(): Promise<ModelMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockMetrics
}

// Intelligent mock classification engine
export async function classifyImage(file: File): Promise<ClassificationResult> {
  // Convert File to base64 Data URL so we can save and display it in UI
  const originalImageUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })

  // Basic keyword classification for a clever demo experience
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
    // If unknown, choose randomly
    prediction = Math.random() > 0.5 ? "Organik" : "Non-Organik"
  }

  // Generate confidence score based on keyword match
  const confidence = parseFloat((0.70 + Math.random() * 0.30).toFixed(3)) // 70% to 100%
  const k_value = 7
  
  // Create simulated neighbors based on predicted class
  const neighbors = Array.from({ length: k_value }).map((_, index) => {
    const rank = index + 1
    // The majority of neighbors should match the prediction class (at least 4 out of 7)
    let label: "Organik" | "Non-Organik" = prediction
    
    // Add small noise for lower confidence: e.g. rank 6 and 7 could mismatch
    if (confidence < 0.85 && index >= 5) {
      label = prediction === "Organik" ? "Non-Organik" : "Organik"
    }

    const category = label === "Organik"
      ? ["Dedaunan", "Sisa Buah", "Sisa Makanan", "Sisa Sayuran"][Math.floor(Math.random() * 4)]
      : ["Botol Plastik", "Kaleng Minuman", "Kardus/Karton", "Kertas/Buku", "Kemasan Plastik"][Math.floor(Math.random() * 5)]

    const distance = parseFloat((0.01 + index * 0.02 + Math.random() * 0.01).toFixed(3))
    
    let thumbnail_url = SVGS.leaf
    if (label === "Organik") {
      thumbnail_url = [SVGS.leaf, SVGS.apple, SVGS.banana, SVGS.orange][Math.floor(Math.random() * 4)]
    } else {
      thumbnail_url = [SVGS.bottle, SVGS.can, SVGS.box, SVGS.paper][Math.floor(Math.random() * 4)]
    }

    return { rank, label, category, distance, thumbnail_url }
  })

  // Construct complete result object
  const newResult: ClassificationResult = {
    id: `cls_${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 8)}_${Math.floor(100 + Math.random() * 900)}`,
    filename: file.name,
    prediction,
    confidence,
    k_value,
    neighbors,
    original_image_url: originalImageUrl,
    preprocessing: {
      resized_to: [128, 128],
      normalized: true
    },
    features_used: ["Color Histogram", "LBP"],
    execution_time_seconds: parseFloat((0.35 + Math.random() * 0.3).toFixed(2)),
    created_at: new Date().toISOString()
  }

  // Save to localStorage history so it persists instantly
  await saveToHistory(newResult)

  return newResult
}
