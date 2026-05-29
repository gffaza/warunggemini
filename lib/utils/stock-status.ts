import { DEFAULT_LOW_STOCK_THRESHOLD } from "@/domain/schemas/inventory.schema";
import type { StockStatus } from "@/domain/types/stock";

export function computeStockStatus(
  qty: number,
  threshold = DEFAULT_LOW_STOCK_THRESHOLD,
): StockStatus {
  if (qty <= 0) return "empty";
  if (qty <= threshold) return "low";
  return "ok";
}
