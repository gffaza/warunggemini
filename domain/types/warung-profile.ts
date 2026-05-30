import type { WarungType } from "@/config/site";

export interface WarungProfile {
  uid: string;
  warungName: string;
  businessCategory?: WarungType;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveWarungProfileInput {
  warungName: string;
  businessCategory?: WarungType;
  location?: string;
}
