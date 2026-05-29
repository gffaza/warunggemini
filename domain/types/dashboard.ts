import type { StockStatus } from "@/domain/types/stock";

export type { StockStatus };

export interface TodaySalesSummary {
  revenue: number;
  transactionCount: number;
  topItem?: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  qty: number;
  status: StockStatus;
}

export interface DailyInsight {
  content: string;
  generatedAt: string;
}

export interface HomeDashboardData {
  sales: TodaySalesSummary;
  lowStock: LowStockItem[];
  insight: DailyInsight | null;
}
