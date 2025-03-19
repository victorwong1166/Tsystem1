// app/sign-table/page.js
import { getSignTableData } from "@/lib/transactions"
import Link from "next/link"

export default async function SignTablePage() {
  const signTableData = await getSignTableData()

  // 計算總盈虧
  const totalSign = signTableData
    .filter((t) => t.type === "sign")
    .reduce((total, t) => total + Number.parseFloat(t.amount), 0)

  const totalReturn = signTableData
    .filter((t) => t.type === "return")
    .reduce((total, t) => total + Number.parseFloat(t.amount), 0)

  const totalProfit = totalSign - totalReturn

  // 按會員分組
  const memberSummary = {}

  signTableData.forEach((transaction) => {
    if (!memberSummary[transaction.member_id]) {
      memberSummary[transaction.member_id] = {
        member_id: transaction.member_id,
        member_name: transaction.member_name,
        sign_amount: 0,
        return_amount: 0,
        net_profit: 0,
      }
    }

    if (transaction.type === "sign") {
      memberSummary[transaction.member_id].sign_amount += Number.parseFloat(transaction.amount)
      memberSummary[transaction.member_id].net_profit += Number.parseFloat(transaction.amount)
    } else if (transaction.type === "return") {
      memberSummary[transaction.member_id].return_amount += Number.parseFloat(transaction.amount)
      memberSummary[transaction.member_id].net_profit -= Number.parseFloat(transaction.amount)
    }
  })

  return (
    <div>
      <h1>簽碼表</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            flex: 1,
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f0fff0",
          }}
        >
          <h2>簽碼總額</h2>
          <p style={{ fontSize: "24px", color: "green" }}>+${totalSign}</p>
        </div>

        <div
          style={{
            flex: 1,
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#fff0f0",
          }}
        >
          <h2>還碼總額</h2>
          <p style={{ fontSize: "24px", color: "red" }}>-${totalReturn}</p>
        </div>

        <div
          style={{
            flex: 1,
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: totalProfit >= 0 ? "#f0f8ff" : "#fff8f0",
          }}
        >
          <h2>淨盈虧</h2>
          <p style={{ fontSize: "24px", color: totalProfit >= 0 ? "blue" : "orange" }}>
            {totalProfit >= 0 ? "+" : "-"}${Math.abs(totalProfit)}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>會員簽碼摘要</h2>
        <table>
          <thead>
            <tr>
              <th>會員</th>
              <th>簽碼金額</th>
              <th>還碼金額</th>
              <th>淨盈虧</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(memberSummary).map((summary) => (
              <tr key={summary.member_id}>
                <td>
                  <Link href={`/members/${summary.member_id}`}>{summary.member_name}</Link>
                </td>
                <td style={{ color: "green" }}>+${summary.sign_amount}</td>
                <td style={{ color: "red" }}>-${summary.return_amount}</td>
                <td style={{ color: summary.net_profit >= 0 ? "green" : "red" }}>
                  {summary.net_profit >= 0 ? "+" : "-"}${Math.abs(summary.net_profit)}
                </td>
                <td>
                  <Link href={`/members/${summary.member_id}`}>
                    <button>詳情</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>總計</td>
              <td style={{ color: "green" }}>+${totalSign}</td>
              <td style={{ color: "red" }}>-${totalReturn}</td>
              <td style={{ color: totalProfit >= 0 ? "green" : "red" }}>
                {totalProfit >= 0 ? "+" : "-"}${Math.abs(totalProfit)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div>
        <h2>交易明細</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>會員</th>
              <th>類型</th>
              <th>金額</th>
              <th>日期</th>
              <th>說明</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {signTableData.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>
                  <Link href={`/members/${transaction.member_id}`}>{transaction.member_name}</Link>
                </td>
                <td>{transaction.type === "sign" ? "簽碼" : "還碼"}</td>
                <td style={{ color: transaction.type === "sign" ? "green" : "red" }}>
                  {transaction.type === "sign" ? "+" : "-"}${transaction.amount}
                </td>
                <td>{new Date(transaction.created_at).toLocaleString()}</td>
                <td>{transaction.description || "-"}</td>
                <td>
                  <Link href={`/transactions/${transaction.id}`}>
                    <button>查看</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

