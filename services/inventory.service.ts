import { analyzeShelfImage } from "@/lib/gemini/vision";
import {
  batchUpsertInventory,
  findInventoryByUser,
} from "@/repositories/inventory.repository";
import type { InventoryItem, VisionScanResult } from "@/domain/types/inventory";

export async function getInventoryList(userId: string): Promise<InventoryItem[]> {
  return findInventoryByUser(userId);
}

export async function scanShelfImage(
  imageBase64: string,
  mimeType: string,
): Promise<VisionScanResult> {
  return analyzeShelfImage(imageBase64, mimeType);
}

export async function saveReviewedItems(
  userId: string,
  items: { name: string; qty: number }[],
): Promise<InventoryItem[]> {
  return batchUpsertInventory(userId, items);
}
