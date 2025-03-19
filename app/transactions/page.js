// app/transactions/page.js
import { getTransactionsByDate } from "@/lib/transactions"
import Link from "next/link"

export default async function TransactionsPage() {
  const transactionsByDate = await getTransactionsByDate()

  return (
    <div>
      <h1>交易記錄</h1>

      <div>
        <Link href="/transactions/new">
          <button>新增交易</button>
        </Link>
      </div>

      {transactionsByDate.map((dateGroup) => (
        <div key={dateGroup.date}>
          <h2>{dateGroup.date}</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>會員</th>
                <th>類型</th>
                <th>金額</th>
                <th>說明</th>
                <th>時間</th>
              </tr>
            </thead>
            <tbody>
              {dateGroup.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.member_name || "系統"}</td>
                  <td>{getTransactionTypeName(transaction.type)}</td>
                  <td style={{ color: getTransactionColor(transaction.type) }}>
                    {getTransactionPrefix(transaction.type)}${transaction.amount}
                  </td>
                  <td>{transaction.description || "-"}</td>
                  <td>{new Date(transaction.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

// 輔助函數
function getTransactionTypeName(type) {
  const typeMap = {
    buy: "買碼",
    redeem: "兌碼",
    sign: "簽碼",
    return: "還碼",
    deposit: "存款",
    withdrawal: "取款",
    labor: "人工",
    misc: "雜費",
  }
  return typeMap[type] || type
}

function getTransactionColor(type) {
  if (type === "sign") return "green"
  if (type === "return" || type === "withdrawal" || type === "labor" || type === "misc") return "red"
  return "inherit"
}

function getTransactionPrefix(type) {
  if (type === "sign" || type === "deposit") return "+"
  if (type === "return" || type === "withdrawal" || type === "labor" || type === "misc") return "-"
  return ""
}

