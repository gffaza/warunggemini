import type { StockStatus } from "@/domain/types/stock";

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  normalizedName: string;
  qty: number;
  status: StockStatus;
  lastScannedAt?: string;
  source: "manual" | "vision";
  updatedAt: string;
}

export interface DetectedStockItem {
  name: string;
  estimatedQty: number;
  status: StockStatus;
}

export type ScanConfidence = "high" | "medium" | "low";

export interface VisionScanResult {
  items: DetectedStockItem[];
  confidence: ScanConfidence;
  notes?: string;
}

export interface ScanReviewItem extends DetectedStockItem {
  id: string;
}
