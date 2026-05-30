import type {
  DailyInsight,
  HomeDashboardData,
  LowStockItem,
} from "@/domain/types/dashboard";
import type { Transaction } from "@/domain/types/transaction";
import {
  getJakartaDateDaysAgo,
  getJakartaDateString,
} from "@/lib/utils/dates";
import {
  computeTopProducts,
  filterTransactionsByTypeAndRange,
} from "@/lib/utils/transaction-stats";
import { findInventoryByUser } from "@/repositories/inventory.repository";
import { findTransactionsByUser } from "@/repositories/transaction.repository";

const WEEKLY_LOOKBACK_DAYS = 6;

function computeTodaySales(transactions: Transaction[], today: string) {
  const todaySales = transactions.filter(
    (transaction) => transaction.type === "sale" && transaction.date === today,
  );

  const revenue = todaySales.reduce(
    (sum, transaction) => sum + transaction.total,
    0,
  );

  const productCounts = new Map<string, number>();

  for (const transaction of todaySales) {
    for (const item of transaction.items) {
      productCounts.set(
        item.name,
        (productCounts.get(item.name) ?? 0) + item.qty,
      );
    }
  }

  let topItem: string | undefined;
  let topQty = 0;

  for (const [name, qty] of productCounts) {
    if (qty > topQty) {
      topQty = qty;
      topItem = name;
    }
  }

  return {
    revenue,
    transactionCount: todaySales.length,
    topItem,
  };
}

function mapLowStockItems(
  inventory: Awaited<ReturnType<typeof findInventoryByUser>>,
): LowStockItem[] {
  return inventory
    .filter((item) => item.status === "low" || item.status === "empty")
    .map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      status: item.status,
    }));
}

function buildRuleBasedInsight(
  saleTransactions: Transaction[],
  today: string,
  lowStock: LowStockItem[],
): DailyInsight | null {
  if (saleTransactions.length === 0) {
    return null;
  }

  const weekStart = getJakartaDateDaysAgo(WEEKLY_LOOKBACK_DAYS);
  const weeklySales = filterTransactionsByTypeAndRange(
    saleTransactions,
    "sale",
    weekStart,
    today,
  );
  const topProduct = computeTopProducts(weeklySales, 1)[0]?.name;
  const lowStockNames = lowStock.slice(0, 2).map((item) => item.name);

  let content: string;

  if (topProduct && lowStockNames.length > 0) {
    content = `${topProduct} paling laku minggu ini. Stok ${lowStockNames.join(" dan ")} menipis — pertimbangkan restock ya, Pak.`;
  } else if (topProduct) {
    content = `${topProduct} paling laku minggu ini. Terus catat jualan — nanti saya kasih saran lebih lengkap.`;
  } else if (saleTransactions.length === 1) {
    content =
      "Catatan pertama sudah masuk! Terus catat setiap jualan — omzet warung akan terpantau otomatis.";
  } else {
    content =
      "Bagus, warung sudah mulai tercatat. Catat setiap hari supaya laporan makin akurat.";
  }

  return {
    content,
    generatedAt: new Date().toISOString(),
  };
}

export async function getHomeDashboard(
  userId: string,
): Promise<HomeDashboardData> {
  const today = getJakartaDateString();

  const [transactions, inventory] = await Promise.all([
    findTransactionsByUser(userId),
    findInventoryByUser(userId),
  ]);

  const saleTransactions = transactions.filter(
    (transaction) => transaction.type === "sale",
  );

  const lowStock = mapLowStockItems(inventory);

  return {
    sales: computeTodaySales(saleTransactions, today),
    lowStock,
    insight: buildRuleBasedInsight(saleTransactions, today, lowStock),
    hasAnyTransactions: saleTransactions.length > 0,
    hasInventory: inventory.length > 0,
  };
}
