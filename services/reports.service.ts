import type { ReportsData } from "@/domain/types/reports";
import {
  formatReportPeriodLabel,
  getJakartaDateDaysAgo,
  getJakartaDateString,
} from "@/lib/utils/dates";
import {
  computeTopProducts,
  filterTransactionsByTypeAndRange,
  sumTransactionTotals,
} from "@/lib/utils/transaction-stats";
import { findTransactionsByUser } from "@/repositories/transaction.repository";

const WEEKLY_LOOKBACK_DAYS = 6;

function emptyReportsData(today: string, weekStart: string): ReportsData {
  return {
    hasTransactions: false,
    todaySales: { revenue: 0, transactionCount: 0 },
    weeklySales: {
      revenue: 0,
      transactionCount: 0,
      periodLabel: formatReportPeriodLabel(weekStart, today),
    },
    topProducts: [],
    estimatedProfit: {
      amount: 0,
      weeklyRevenue: 0,
      weeklyExpenses: 0,
      hasExpenseRecords: false,
    },
  };
}

export async function getReports(userId: string): Promise<ReportsData> {
  const today = getJakartaDateString();
  const weekStart = getJakartaDateDaysAgo(WEEKLY_LOOKBACK_DAYS);

  const transactions = await findTransactionsByUser(userId);
  const saleTransactions = transactions.filter(
    (transaction) => transaction.type === "sale",
  );

  if (saleTransactions.length === 0) {
    return emptyReportsData(today, weekStart);
  }

  const todaySalesList = filterTransactionsByTypeAndRange(
    saleTransactions,
    "sale",
    today,
    today,
  );

  const weeklySalesList = filterTransactionsByTypeAndRange(
    saleTransactions,
    "sale",
    weekStart,
    today,
  );

  const weeklyExpensesList = filterTransactionsByTypeAndRange(
    transactions,
    "expense",
    weekStart,
    today,
  );

  const weeklyRevenue = sumTransactionTotals(weeklySalesList);
  const weeklyExpenses = sumTransactionTotals(weeklyExpensesList);

  return {
    hasTransactions: true,
    todaySales: {
      revenue: sumTransactionTotals(todaySalesList),
      transactionCount: todaySalesList.length,
    },
    weeklySales: {
      revenue: weeklyRevenue,
      transactionCount: weeklySalesList.length,
      periodLabel: formatReportPeriodLabel(weekStart, today),
    },
    topProducts: computeTopProducts(weeklySalesList),
    estimatedProfit: {
      amount: weeklyRevenue - weeklyExpenses,
      weeklyRevenue,
      weeklyExpenses,
      hasExpenseRecords: weeklyExpensesList.length > 0,
    },
  };
}
