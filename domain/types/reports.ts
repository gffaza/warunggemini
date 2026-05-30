export interface SalesSummary {
  revenue: number;
  transactionCount: number;
}

export interface WeeklySalesSummary extends SalesSummary {
  periodLabel: string;
}

export interface TopProduct {
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface EstimatedProfit {
  amount: number;
  weeklyRevenue: number;
  weeklyExpenses: number;
  hasExpenseRecords: boolean;
}

export interface ReportsData {
  hasTransactions: boolean;
  todaySales: SalesSummary;
  weeklySales: WeeklySalesSummary;
  topProducts: TopProduct[];
  estimatedProfit: EstimatedProfit;
}
