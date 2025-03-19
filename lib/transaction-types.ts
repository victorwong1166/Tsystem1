import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownRight,
  Users,
  Building,
  Laptop,
  Receipt,
  Briefcase,
  PiggyBank,
  RefreshCw,
} from "lucide-react"

// 交易類型定義
export const transactionTypes = [
  { id: "buy", name: "買碼", icon: DollarSign, category: "basic" },
  { id: "redeem", name: "兌碼", icon: CreditCard, category: "basic" },
  { id: "sign", name: "簽碼", icon: TrendingUp, category: "basic", color: "text-green-500" },
  { id: "return", name: "還碼", icon: TrendingDown, category: "basic", color: "text-red-500" },
  { id: "deposit", name: "存款", icon: ArrowUpCircle, category: "finance" },
  { id: "withdrawal", name: "取款", icon: ArrowDownRight, category: "finance" },
  { id: "labor", name: "人工", icon: Users, category: "basic" },
  { id: "rent", name: "場租", icon: Building, category: "basic" },
  { id: "system", name: "系統", icon: Laptop, category: "basic" },
  { id: "misc", name: "雜費", icon: Receipt, category: "basic" },
  // 新增資金類型
  { id: "accounting", name: "帳房", icon: Briefcase, category: "finance" },
  { id: "capital", name: "本金", icon: PiggyBank, category: "finance" },
  // 新增轉帳類型
  { id: "transfer", name: "轉帳", icon: RefreshCw, category: "finance" },
]

// 交易類型分類
export const transactionCategories = [
  { id: "basic", name: "基本交易及費用" },
  { id: "finance", name: "資金管理" },
  { id: "project", name: "項目交易" },
]

// 獲取交易類型的顯示名稱
export function getTransactionTypeName(typeId: string): string {
  const transaction = transactionTypes.find((t) => t.id === typeId)
  return transaction ? transaction.name : typeId
}

// 獲取交易類型的圖標
export function getTransactionTypeIcon(typeId: string) {
  const transaction = transactionTypes.find((t) => t.id === typeId)
  return transaction ? transaction.icon : Receipt
}

// 獲取交易類型的顏色
export function getTransactionTypeColor(typeId: string): string {
  const transaction = transactionTypes.find((t) => t.id === typeId)
  return transaction?.color || ""
}

