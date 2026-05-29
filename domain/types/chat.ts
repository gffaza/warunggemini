export type ChatRole = "user" | "assistant";

export type ChatIntent =
  | "record_sale"
  | "record_expense"
  | "clarify"
  | "chitchat";

export interface ChatMessage {
  id: string;
  userId: string;
  role: ChatRole;
  content: string;
  transactionId?: string;
  intent?: ChatIntent;
  createdAt: string;
}

export interface ParsedSaleData {
  product: string;
  quantity: number;
  price: number;
  unitPrice?: number;
}
