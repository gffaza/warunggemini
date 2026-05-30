import type { TopProduct } from "@/domain/types/reports";
import type { Transaction } from "@/domain/types/transaction";
import { isDateWithinRange } from "@/lib/utils/dates";

export function sumTransactionTotals(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => sum + transaction.total, 0);
}

export function filterTransactionsByTypeAndRange(
  transactions: Transaction[],
  type: Transaction["type"],
  startDate: string,
  endDate: string,
): Transaction[] {
  return transactions.filter(
    (transaction) =>
      transaction.type === type &&
      isDateWithinRange(transaction.date, startDate, endDate),
  );
}

export function computeTopProducts(
  sales: Transaction[],
  limit = 5,
): TopProduct[] {
  const productMap = new Map<string, { name: string; qty: number; revenue: number }>();

  for (const transaction of sales) {
    for (const item of transaction.items) {
      const key = item.normalizedName || item.name.toLowerCase();
      const existing = productMap.get(key);

      if (existing) {
        existing.qty += item.qty;
        existing.revenue += item.subtotal ?? transaction.total;
      } else {
        productMap.set(key, {
          name: item.name,
          qty: item.qty,
          revenue: item.subtotal ?? transaction.total,
        });
      }
    }
  }

  return Array.from(productMap.values())
    .map((item) => ({
      name: item.name,
      quantitySold: item.qty,
      revenue: item.revenue,
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold || b.revenue - a.revenue)
    .slice(0, limit);
}
