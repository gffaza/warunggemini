import type { Timestamp } from "firebase-admin/firestore";

export type TransactionType = "sale" | "expense";

export interface TransactionItem {
  name: string;
  normalizedName: string;
  qty: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  product: string;
  quantity: number;
  price: number;
  items: TransactionItem[];
  total: number;
  rawInput: string;
  source: "chat";
  chatMessageId?: string;
  createdAt: string;
  date: string;
}

export interface TransactionRecord extends Omit<Transaction, "createdAt"> {
  createdAt: Timestamp;
}
