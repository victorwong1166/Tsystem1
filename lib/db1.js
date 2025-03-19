// lib/db.js
import { neon } from "@neondatabase/serverless"

// 創建數據庫連接
export const sql = neon(process.env.DATABASE_URL)

