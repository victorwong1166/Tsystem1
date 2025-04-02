// 这个脚本用于安装所有缺少的依赖
// 运行方式: npx ts-node scripts/install-deps.ts

import { execSync } from "child_process"

console.log("开始安装缺少的依赖...")

const dependencies = ["@vercel/postgres", "idb", "pg", "drizzle-orm", "bcryptjs", "web-push"]

try {
  console.log(`安装依赖: ${dependencies.join(", ")}`)
  execSync(`npm install ${dependencies.join(" ")}`, { stdio: "inherit" })
  console.log("依赖安装完成！")
} catch (error) {
  console.error("安装依赖时出错:", error)
  process.exit(1)
}

