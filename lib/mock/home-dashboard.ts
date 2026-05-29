import type { HomeDashboardData } from "@/domain/types/dashboard";

/**
 * Placeholder data until chat, inventory, and insights APIs ship.
 * Replace with GET /api/reports/daily + GET /api/insights/daily.
 */
export async function fetchHomeDashboardMock(): Promise<HomeDashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    sales: {
      revenue: 287_000,
      transactionCount: 12,
      topItem: "Indomie Goreng",
    },
    lowStock: [
      { id: "1", name: "Indomie Goreng", qty: 4, status: "low" },
      { id: "2", name: "Kopi Kapal Api", qty: 3, status: "low" },
      { id: "3", name: "Aqua 600ml", qty: 0, status: "empty" },
    ],
    insight: {
      content:
        "Mie instan paling laku minggu ini. Stok Indomie tinggal 4 — pertimbangkan restock besok pagi, Pak.",
      generatedAt: new Date().toISOString(),
    },
  };
}
