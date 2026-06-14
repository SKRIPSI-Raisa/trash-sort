export interface Neighbor {
  rank: number
  label: "Organik" | "Non-Organik"
  category: string
  distance: number
  thumbnail_url: string // Path or base64 string
}

export interface PreprocessingInfo {
  resized_to: [number, number]
  normalized: boolean
}

export interface ClassificationResult {
  id: string
  filename: string
  prediction: "Organik" | "Non-Organik"
  confidence: number // 0.0 to 1.0
  k_value: number
  neighbors: Neighbor[]
  original_image_url: string // original uploaded photo (base64 or path)
  preprocessing: PreprocessingInfo
  features_used: string[]
  execution_time_seconds: number
  created_at: string // ISO date string
}

export interface ConfusionMatrix {
  tp: number // True Positive (Organik predicted as Organik)
  tn: number // True Negative (Non-Organik predicted as Non-Organik)
  fp: number // False Positive (Non-Organik predicted as Organik)
  fn: number // False Negative (Organik predicted as Non-Organik)
}

export interface KOptimizationPoint {
  k: number
  accuracy: number
}

export interface DistanceComparisonPoint {
  metric: string
  accuracy: number
}

export interface ModelInfo {
  algorithm: string
  k_value: number
  input_size: [number, number, number] // e.g. [128, 128, 3]
  classes: string[]
  trained_at: string
  train_size: number
  test_size: number
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  k_optimal: number
  confusion_matrix: ConfusionMatrix
  k_curve: KOptimizationPoint[]
  distance_comparison: DistanceComparisonPoint[]
  model_info: ModelInfo
}

export interface WasteGuide {
  title: string
  type: "Organik" | "Non-Organik"
  icon: string
  examples: string[]
  steps: string[]
  description: string
}
