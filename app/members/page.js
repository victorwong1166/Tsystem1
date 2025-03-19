// app/members/page.js
import { getAllMembers } from "@/lib/members"
import Link from "next/link"

export default async function MembersPage() {
  const members = await getAllMembers()

  return (
    <div>
      <h1>會員列表</h1>

      <Link href="/members/new">
        <button>新增會員</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>類別</th>
            <th>電話</th>
            <th>結餘</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>
                {member.category === "shareholder" && "股東"}
                {member.category === "agent" && "代理"}
                {member.category === "regular" && "普通會員"}
              </td>
              <td>{member.phone}</td>
              <td style={{ color: member.balance < 0 ? "red" : "inherit" }}>${member.balance}</td>
              <td>
                <Link href={`/members/${member.id}`}>
                  <button>查看</button>
                </Link>
                <Link href={`/members/${member.id}/edit`}>
                  <button>編輯</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

