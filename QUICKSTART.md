# Tsystem1 POS 系統 - 快速開始

## 📋 重構摘要

✅ **資料庫大一統** - 5 張核心表集中管理所有數據
✅ **POS 介面重構** - 極簡低調的實體收銀機操作界面  
✅ **權限防護完善** - middleware.ts 路由攔截與角色驗證
✅ **Server Actions** - 8 種交易類型後端 API

---

## 🚀 立即開始（3 步）

### 第 1 步：安裝 Prisma
```bash
npm install @prisma/client
npm install prisma --save-dev
```

### 第 2 步：同步資料庫 Schema
```bash
# 根據新 schema 創建/更新資料庫表
npx prisma migrate dev --name init

# 或直接推送 schema（開發環境）
npx prisma db push
```

### 第 3 步：啟動應用
```bash
npm run dev
```

---

## 🎯 測試 POS 系統

### 前置準備
1. **創建測試員工帳戶**（數據庫中）
   ```sql
   INSERT INTO users (id, username, password, role, "createdAt", "updatedAt")
   VALUES (
     'user_001',
     'staff_user',
     'hashed_password', -- 需要加密
     'STAFF',
     NOW(),
     NOW()
   );
   ```

2. **創建測試會員**
   ```sql
   INSERT INTO members (id, name, phone, balance, "creditLimit", "currentDebt", "createdAt", "updatedAt")
   VALUES (
     'member_001',
     '張三',
     '09123456789',
     10000,
     50000,
     0,
     NOW(),
     NOW()
   );
   ```

3. **設置登入 Cookie**（在瀏覽器開發者工具中）
   ```javascript
   // 在瀏覽器 Console 執行
   document.cookie = "userId=user_001; path=/; max-age=3600"
   document.cookie = "userRole=STAFF; path=/; max-age=3600"
   document.cookie = "isLoggedIn=true; path=/; max-age=3600"
   ```

4. **訪問儀表板**
   ```
   http://localhost:3000/dashboard
   ```

5. **點擊「💳 POS 系統」按鈕**

### 操作 POS 介面
1. **輸入會員 ID** → `member_001`
2. **選擇交易類型** → 點擊「現金買入」（綠色）
3. **輸入金額**
   - 可點擊快捷鍵：+100、+1K、+10K、+100K
   - 或手動按數字鍵
4. **點擊「確認交易」**

### 驗證交易結果
```sql
-- 查詢交易記錄
SELECT * FROM transactions WHERE "memberId" = 'member_001' ORDER BY "createdAt" DESC;

-- 查詢會員餘額
SELECT name, balance, "currentDebt" FROM members WHERE id = 'member_001';
```

---

## 📁 核心文件位置

| 文件 | 路徑 | 用途 |
|------|------|------|
| Prisma Schema | `/prisma/schema.prisma` | 資料庫結構定義 |
| POS 主介面 | `/app/components/staff-pos-dashboard.tsx` | 員工操作界面 |
| 數字鍵盤 | `/app/components/pos-numeric-keypad.tsx` | 金額輸入組件 |
| 交易 API | `/app/actions/pos-transactions.ts` | Server Actions |
| Dashboard | `/app/dashboard/page.tsx` | 整合切換點 |
| 中間件 | `/middleware.ts` | 權限防護 |
| Prisma Client | `/lib/prisma.ts` | 資料庫連接 |

---

## 🔐 角色與權限

### 3 種角色
| 角色 | 權限 |
|------|------|
| **STAFF** | ✓ 執行交易、查看交易記錄 |
| **MANAGER** | ✓ 所有 STAFF 權限 + 結班功能 |
| **ADMIN** | ✓ 全站管理、系統配置 |

### 登入流程
```
未登入 → /login
↓
登入成功 → 設置 Cookie (userId, userRole, isLoggedIn)
↓
訪問 /dashboard → middleware 檢查 → POS 系統
```

---

## 💡 POS 交易類型詳解

### 8 種交易類型與邏輯

| 類型 | 說明 | 會員餘額變化 | 欠款變化 |
|------|------|-----------|--------|
| **CASH_BUY_IN** | 現金買入 | +amount | - |
| **CREDIT_SIGN_IN** | 信用簽帳 | - | +amount |
| **CASH_OUT** | 現金取出 | -amount | - |
| **DEBT_REPAY** | 債務還款 | +amount | -amount |
| **VAULT_IN** | 金庫進帳 | - | - |
| **VAULT_OUT** | 金庫出帳 | - | - |
| **DEPOSIT** | 存款 | +amount | - |
| **WITHDRAWAL** | 提款 | -amount | - |

---

## 🔧 環境變數

在 `.env.local` 中配置：
```env
# 資料庫連接
DATABASE_URL="postgresql://user:password@localhost:5432/tsystem1"

# 應用設置
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## 📊 常用查詢

### 查看所有用戶
```sql
SELECT id, username, role FROM users;
```

### 查看今日交易
```sql
SELECT t.*, m.name, u.username
FROM transactions t
JOIN members m ON t."memberId" = m.id
JOIN users u ON t."userId" = u.id
WHERE DATE(t."createdAt") = CURRENT_DATE
ORDER BY t."createdAt" DESC;
```

### 統計會員結餘
```sql
SELECT id, name, balance, "currentDebt", (balance - "currentDebt") as net
FROM members
ORDER BY "currentDebt" DESC;
```

---

## ⚠️ 常見問題

### Q: POS 按鈕不出現？
A: 確認 `userRole` Cookie 值為 `STAFF`、`MANAGER` 或 `ADMIN`

### Q: 交易顯示「會員不存在」？
A: 檢查會員 ID 是否在數據庫中存在

### Q: 交易顯示「餘額不足」？
A: 該交易類型需要足夠的餘額，檢查會員當前結餘

### Q: 無法連接資料庫？
A: 
1. 確認 PostgreSQL 服務運行
2. 檢查 `DATABASE_URL` 環境變數
3. 運行 `npx prisma db push` 重新同步 schema

---

## 📞 技術支援

查看詳細文檔：[POS_INTEGRATION.md](./POS_INTEGRATION.md)

---

**祝使用愉快！** 🎉
