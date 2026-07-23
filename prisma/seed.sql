-- Tsystem1 POS 系統初始化數據腳本
-- 執行方式：psql -U username -d database_name -f seed.sql

-- ============================================
-- 1. 插入測試用戶
-- ============================================
INSERT INTO users (id, username, password, role, "createdAt", "updatedAt") VALUES
  ('user_staff_01', 'staff001', '$2a$10$...', 'STAFF', NOW(), NOW()),
  ('user_staff_02', 'staff002', '$2a$10$...', 'STAFF', NOW(), NOW()),
  ('user_manager_01', 'manager001', '$2a$10$...', 'MANAGER', NOW(), NOW()),
  ('user_admin_01', 'admin001', '$2a$10$...', 'ADMIN', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. 插入測試會員
-- ============================================
INSERT INTO members (id, name, phone, balance, "creditLimit", "currentDebt", "createdAt", "updatedAt") VALUES
  ('member_001', '張三', '0912345678', 10000.00, 50000.00, 0.00, NOW(), NOW()),
  ('member_002', '李四', '0912345679', 5000.00, 30000.00, 2000.00, NOW(), NOW()),
  ('member_003', '王五', '0912345680', 20000.00, 100000.00, 5000.00, NOW(), NOW()),
  ('member_004', '劉六', '0912345681', 0.00, 10000.00, 10000.00, NOW(), NOW()),
  ('member_005', '陳七', '0912345682', 15000.00, 75000.00, 1500.00, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. 插入班次記錄（可選）
-- ============================================
INSERT INTO shift_logs (id, "managerId", "expectedCash", "actualCash", discrepancy, "isClosed", "createdAt", "closedAt") VALUES
  ('shift_001', 'user_manager_01', 50000.00, 49980.00, -20.00, false, NOW(), NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. 插入樣本交易記錄
-- ============================================
INSERT INTO transactions (id, "memberId", type, amount, "userId", "shiftId", "createdAt", "updatedAt") VALUES
  ('txn_001', 'member_001', 'CASH_BUY_IN', 5000.00, 'user_staff_01', 'shift_001', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  ('txn_002', 'member_002', 'CREDIT_SIGN_IN', 3000.00, 'user_staff_02', 'shift_001', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
  ('txn_003', 'member_003', 'CASH_OUT', 2000.00, 'user_staff_01', 'shift_001', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
  ('txn_004', 'member_004', 'DEBT_REPAY', 5000.00, 'user_staff_02', 'shift_001', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes'),
  ('txn_005', 'member_001', 'DEPOSIT', 1000.00, 'user_manager_01', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. 插入系統配置
-- ============================================
INSERT INTO system_configs (id, key, value, "createdAt", "updatedAt") VALUES
  ('cfg_001', 'company_name', '"T系統有限公司"'::jsonb, NOW(), NOW()),
  ('cfg_002', 'system_version', '"1.0.0"'::jsonb, NOW(), NOW()),
  ('cfg_003', 'currency', '"TWD"'::jsonb, NOW(), NOW()),
  ('cfg_004', 'default_credit_limit', '50000'::jsonb, NOW(), NOW()),
  ('cfg_005', 'transaction_timeout', '3600'::jsonb, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 驗證查詢（執行此部分檢查數據）
-- ============================================

-- 查詢用戶總數
SELECT COUNT(*) as "Users Count" FROM users;

-- 查詢會員總數
SELECT COUNT(*) as "Members Count" FROM members;

-- 查詢交易總數
SELECT COUNT(*) as "Transactions Count" FROM transactions;

-- 查詢會員詳情
SELECT id, name, balance, "creditLimit", "currentDebt" FROM members ORDER BY id;

-- 查詢交易記錄
SELECT t.id, m.name as "Member", t.type, t.amount, u.username as "Staff", t."createdAt"
FROM transactions t
JOIN members m ON t."memberId" = m.id
JOIN users u ON t."userId" = u.id
ORDER BY t."createdAt" DESC;

-- ============================================
-- 清理腳本（如需重置，取消注釋下面的行）
-- ============================================
/*
DELETE FROM transactions;
DELETE FROM shift_logs;
DELETE FROM members;
DELETE FROM users;
DELETE FROM system_configs;
*/
