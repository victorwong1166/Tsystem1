import { pgTable, serial, text, varchar, timestamp, boolean, integer, decimal, pgEnum } from "drizzle-orm/pg-core"

// 枚舉定義
export const userRoleEnum = pgEnum("user_role", ["admin", "user"])
export const userStatusEnum = pgEnum("user_status", ["active", "inactive"])
export const memberTypeEnum = pgEnum("member_type", ["shareholder", "agent", "regular"])
export const transactionTypeEnum = pgEnum("transaction_type", ["buy_chips", "sell_chips", "sign_table", "dividend"])
export const paymentMethodEnum = pgEnum("payment_method", ["cash", "bank", "wechat", "alipay"])
export const buttonTypeEnum = pgEnum("button_type", ["transaction", "payment", "other"])

// 用戶表 (系統用戶)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  role: userRoleEnum("role").notNull().default("user"),
  status: userStatusEnum("status").notNull().default("active"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 會員表 (客戶)
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  type: memberTypeEnum("type").notNull().default("regular"),
  agentId: integer("agent_id").references(() => members.id),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 交易表
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 20 }).notNull().unique(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method"),
  notes: text("notes"),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 自定義按鈕表
export const customButtons = pgTable("custom_buttons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  buttonType: buttonTypeEnum("button_type").notNull(),
  value: varchar("value", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).default("#3b82f6"), // 默認藍色
  icon: varchar("icon", { length: 50 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 簽單表
export const signTables = pgTable("sign_tables", {
  id: serial("id").primaryKey(),
  tableId: varchar("table_id", { length: 20 }).notNull(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  settledAt: timestamp("settled_at"),
  transactionId: integer("transaction_id").references(() => transactions.id),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 分紅表
export const dividends = pgTable("dividends", {
  id: serial("id").primaryKey(),
  dividendId: varchar("dividend_id", { length: 20 }).notNull().unique(),
  totalProfit: decimal("total_profit", { precision: 10, scale: 2 }).notNull(),
  totalShares: decimal("total_shares", { precision: 5, scale: 2 }).notNull(),
  shareUnit: decimal("share_unit", { precision: 3, scale: 2 }).notNull(),
  dividendPerUnit: decimal("dividend_per_unit", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// 分紅分配表
export const dividendAllocations = pgTable("dividend_allocations", {
  id: serial("id").primaryKey(),
  dividendId: integer("dividend_id")
    .references(() => dividends.id)
    .notNull(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  shares: decimal("shares", { precision: 5, scale: 2 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// 系統設置表
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: integer("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 系統日誌表
export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 50 }).notNull(),
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Telegram綁定表
export const telegramBindings = pgTable("telegram_bindings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  chatId: varchar("chat_id", { length: 50 }).notNull().unique(),
  bindCode: varchar("bind_code", { length: 10 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 網站表
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  domain: varchar("domain", { length: 100 }).notNull().unique(),
  template: varchar("template", { length: 50 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  settings: text("settings"),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 結算表
export const settlements = pgTable("settlements", {
  id: serial("id").primaryKey(),
  settlementId: varchar("settlement_id", { length: 20 }).notNull().unique(),
  periodNumber: integer("period_number").notNull(), // 期數
  date: timestamp("date").notNull(),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).notNull(),
  totalExpenses: decimal("total_expenses", { precision: 10, scale: 2 }).notNull(),
  netProfit: decimal("net_profit", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// 結算詳情表
export const settlementDetails = pgTable("settlement_details", {
  id: serial("id").primaryKey(),
  settlementId: integer("settlement_id")
    .references(() => settlements.id)
    .notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 例如: revenue_gaming, expense_staff 等
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
})

// 結算賬戶變動表
export const settlementAccounts = pgTable("settlement_accounts", {
  id: serial("id").primaryKey(),
  settlementId: integer("settlement_id")
    .references(() => settlements.id)
    .notNull(),
  accountType: varchar("account_type", { length: 50 }).notNull(), // 例如: cash, bank, receivables
  openingBalance: decimal("opening_balance", { precision: 10, scale: 2 }).notNull(),
  closingBalance: decimal("closing_balance", { precision: 10, scale: 2 }).notNull(),
})

// 文章表
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

