import {
  BarChart3,
  Home,
  MessageSquare,
  Package,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Disabled until feature ships */
  available: boolean;
}

export const bottomNavItems: NavItem[] = [
  { label: "Beranda", href: "/home", icon: Home, available: true },
  { label: "Catat", href: "/chat", icon: MessageSquare, available: true },
  { label: "Stok", href: "/inventory", icon: Package, available: true },
  { label: "Laporan", href: "/reports", icon: BarChart3, available: false },
];
