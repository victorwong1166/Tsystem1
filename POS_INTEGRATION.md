# POS 系統整合文檔

## 概述
Tsystem1 POS 系統大一統重構完成。將所有數據集中到 PostgreSQL 資料庫的 5 張核心表中。

## 數據庫結構

### 1. **Users 表** (用戶帳戶)
```
- id: 唯一識別符
- username: 登入名
- password: 密碼 (已加密)
- role: 用戶角色 (STAFF/MANAGER/ADMIN)
- createdAt, updatedAt
```

### 2. **Members 表** (會員/客戶)
```
- id: 唯一識別符
- name: 會員名稱
- phone: 電話號碼
- balance: 當前結餘
- creditLimit: 信用額度
- currentDebt: 當期欠款
- createdAt, updatedAt
```

### 3. **Transactions 表** (交易記錄)
```
- id: 交易編號
- memberId: 會員 ID (外鍵)
- type: 交易類型 (8 種)
- amount: 交易金額
- userId: 操作員 ID (外鍵)
- shiftId: 班次 ID (外鍵，可空)
- createdAt, updatedAt

交易類型：
  • CASH_BUY_IN: 現金買入
  • CREDIT_SIGN_IN: 信用簽帳
  • CASH_OUT: 現金取出
  • DEBT_REPAY: 債務還款
  • VAULT_IN: 金庫進帳
  • VAULT_OUT: 金庫出帳
  • DEPOSIT: 存款
  • WITHDRAWAL: 提款
```

### 4. **ShiftLogs 表** (班次記錄)
```
- id: 班次編號
- managerId: 經理 ID (外鍵)
- expectedCash: 預計現金
- actualCash: 實際現金
- discrepancy: 差異
- isClosed: 是否結班
- createdAt, closedAt
```

### 5. **SystemConfigs 表** (系統配置)
```
- id: 配置 ID
- key: 配置鍵 (唯一)
- value: 配置值 (JSON 格式)
- createdAt, updatedAt
```

---

## POS 介面功能

### 基層員工界面 (`StaffPosDashboard`)

#### 組成部分：
1. **會員編號輸入框** - 輸入會員 ID
2. **交易類型選擇** - 8 個顏色按鈕快速選擇
3. **數字鍵盤** (`PosNumericKeypad`)
   - 快捷鍵：+100、+1K、+10K、+100K
   - 數字鍵盤 0-9
   - 退格、清除、確認

#### 交易流程：
1. 輸入會員編號 → 2. 選擇交易類型 → 3. 輸入金額 → 4. 點擊「確認交易」

---

## API 端點 (Server Actions)

### `createPosTransaction(input)`
執行 POS 交易

**參數：**
```typescript
{
  memberId: string      // 會員 ID
  type: TransactionType // 交易類型
  amount: number        // 交易金額
  userId: string        // 操作員 ID
  shiftId?: string      // 班次 ID (可選)
}
```

**返回值：**
```typescript
{
  success: boolean
  message: string
  transaction?: Transaction  // 交易記錄對象
  error?: string
}
```

### `getMemberInfo(memberId)`
查詢會員資訊

**參數：**
```typescript
memberId: string  // 會員 ID
```

**返回值：**
```typescript
{
  success: boolean
  member?: Member  // 會員對象含最近 5 筆交易
}
```

---

## 權限防護 (Middleware)

### 角色定義：
- **STAFF** - 基層員工 (可進行交易)
- **MANAGER** - 經理 (可結班、查看報表)
- **ADMIN** - 管理員 (全權限)

### 路由防護規則：
- `/dashboard` - 需登入 + STAFF/MANAGER/ADMIN 角色
- 未登入 → 重定向到 `/login`
- 無權限 → 重定向到 `/`

### Cookie 設置：
```javascript
// 登入後設置以下 Cookie
document.cookie = "userId=xxx; path=/"
document.cookie = "userRole=STAFF; path=/"
document.cookie = "isLoggedIn=true; path=/"
```

---

## 使用步驟

### 1. 安裝依賴
```bash
npm install @prisma/client
npm install prisma --save-dev
```

### 2. 初始化資料庫
```bash
# 生成 Prisma client
npx prisma generate

# 運行遷移
npx prisma migrate dev --name init
```

### 3. 測試連接
```bash
npx prisma db execute --stdin <<< "SELECT 1"
```

### 4. 啟動應用
```bash
npm run dev
```

### 5. 訪問 POS 系統
- 登入系統 (設置 STAFF/MANAGER/ADMIN 角色)
- 進入 `/dashboard`
- 點擊「💳 POS 系統」按鈕切換介面

---

## 會員交易邏輯

### CASH_BUY_IN (現金買入)
```
member.balance += amount
```

### CREDIT_SIGN_IN (信用簽帳)
```
member.currentDebt += amount
```

### CASH_OUT (現金取出)
```
if (member.balance >= amount) {
  member.balance -= amount
}
```

### DEBT_REPAY (債務還款)
```
member.currentDebt -= min(amount, member.currentDebt)
member.balance += amount
```

### VAULT_IN / VAULT_OUT
```
// 系統記錄，不直接影響會員
```

### DEPOSIT / WITHDRAWAL
```
// 存款：balance += amount
// 提款：balance -= amount (需檢查餘額)
```

---

## 數據遷移 (如需要)

### 從舊系統遷移數據：
```typescript
// 例如遷移會員數據
await prisma.member.createMany({
  data: oldMembers.map(m => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    balance: m.balance,
    creditLimit: m.creditLimit,
    currentDebt: m.currentDebt,
  }))
})
```

---

## 故障排除

### 問題：無法連接資料庫
- 檢查 `DATABASE_URL` 環境變數
- 確認 PostgreSQL 服務運行
- 運行 `npx prisma db push`

### 問題：POS 按鈕不顯示
- 確認 `userRole` 為 STAFF/MANAGER/ADMIN
- 檢查 localStorage 中的 `userRole` 值
- 刷新頁面

### 問題：交易失敗
- 檢查會員 ID 是否存在
- 檢查金額是否大於 0
- 查看控制台錯誤信息

---

## 文件位置

```
/app
  ├── actions/
  │   └── pos-transactions.ts       # POS 交易 Server Actions
  ├── components/
  │   ├── staff-pos-dashboard.tsx  # POS 主介面
  │   └── pos-numeric-keypad.tsx   # 數字鍵盤組件
  ├── dashboard/
  │   └── page.tsx                 # 整合了 POS 切換
  └── layout.tsx

/lib
  └── prisma.ts                    # Prisma Client 初始化

/prisma
  └── schema.prisma                # 資料庫 Schema (已更新)

middleware.ts                       # 路由防護與角色驗證
```

---

## 下一步

1. ✅ 數據庫遷移完成
2. ✅ POS 介面完成
3. ✅ 權限防護完成
4. ⏳ 連接真實認證系統 (推薦使用 Better Auth 或 NextAuth.js)
5. ⏳ 添加交易報表和統計功能
6. ⏳ 集成支付閘道 (Stripe)

---

**最後更新：** 2026-07-24
**版本：** 1.0
