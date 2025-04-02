"use client"

export default function RelationsDiagram() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">数据库表关系图</h1>

      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* 核心表 */}
            <div className="border rounded-lg p-4 bg-blue-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">User</h3>
              <ul className="text-sm">
                <li className="mb-1">id (PK)</li>
                <li className="mb-1">name</li>
                <li className="mb-1">email</li>
                <li className="mb-1">password</li>
                <li className="mb-1">role</li>
                <li className="mb-1">...</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-green-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">Post</h3>
              <ul className="text-sm">
                <li className="mb-1">id (PK)</li>
                <li className="mb-1">title</li>
                <li className="mb-1">content</li>
                <li className="mb-1">published</li>
                <li className="mb-1">authorId (FK)</li>
                <li className="mb-1">...</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-yellow-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">Comment</h3>
              <ul className="text-sm">
                <li className="mb-1">id (PK)</li>
                <li className="mb-1">content</li>
                <li className="mb-1">postId (FK)</li>
                <li className="mb-1">authorId (FK)</li>
                <li className="mb-1">...</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* 关联表 */}
            <div className="border rounded-lg p-4 bg-purple-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">Category</h3>
              <ul className="text-sm">
                <li className="mb-1">id (PK)</li>
                <li className="mb-1">name</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-indigo-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">CategoryOnPost</h3>
              <ul className="text-sm">
                <li className="mb-1">postId (PK, FK)</li>
                <li className="mb-1">categoryId (PK, FK)</li>
                <li className="mb-1">assignedAt</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-pink-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">Tag</h3>
              <ul className="text-sm">
                <li className="mb-1">id (PK)</li>
                <li className="mb-1">name</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-red-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">TagOnPost</h3>
              <ul className="text-sm">
                <li className="mb-1">postId (PK, FK)</li>
                <li className="mb-1">tagId (PK, FK)</li>
                <li className="mb-1">assignedAt</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* 其他表 */}
            <div className="border rounded-lg p-4 bg-orange-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">Transaction</h3>
              <ul className="text-sm">
                <li className="mb-1">id (PK)</li>
                <li className="mb-1">amount</li>
                <li className="mb-1">type</li>
                <li className="mb-1">status</li>
                <li className="mb-1">userId (FK)</li>
                <li className="mb-1">...</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-teal-50 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">Notification</h3>
              <ul className="text-sm">
                <li className="mb-1">id (PK)</li>
                <li className="mb-1">title</li>
                <li className="mb-1">content</li>
                <li className="mb-1">type</li>
                <li className="mb-1">userId (FK)</li>
                <li className="mb-1">...</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-gray-100 shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-center">Setting</h3>
              <ul className="text-sm">
                <li className="mb-1">id (PK)</li>
                <li className="mb-1">key</li>
                <li className="mb-1">value</li>
              </ul>
            </div>
          </div>

          {/* 关系线 - 使用 SVG 绘制 */}
          <svg className="w-full h-[500px] mt-8" viewBox="0 0 1000 500">
            {/* User -> Post */}
            <path d="M200,100 L400,100" stroke="#4B5563" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <text x="300" y="90" textAnchor="middle" fontSize="12">
              1:N
            </text>

            {/* User -> Comment */}
            <path
              d="M200,120 C300,180 500,180 600,120"
              stroke="#4B5563"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
            <text x="400" y="170" textAnchor="middle" fontSize="12">
              1:N
            </text>

            {/* Post -> Comment */}
            <path d="M500,100 L600,100" stroke="#4B5563" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <text x="550" y="90" textAnchor="middle" fontSize="12">
              1:N
            </text>

            {/* Post -> CategoryOnPost */}
            <path d="M450,150 L350,250" stroke="#4B5563" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <text x="380" y="200" textAnchor="middle" fontSize="12">
              1:N
            </text>

            {/* Category -> CategoryOnPost */}
            <path d="M250,250 L300,250" stroke="#4B5563" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <text x="275" y="240" textAnchor="middle" fontSize="12">
              1:N
            </text>

            {/* Post -> TagOnPost */}
            <path d="M500,150 L650,250" stroke="#4B5563" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <text x="580" y="200" textAnchor="middle" fontSize="12">
              1:N
            </text>

            {/* Tag -> TagOnPost */}
            <path d="M550,250 L600,250" stroke="#4B5563" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <text x="575" y="240" textAnchor="middle" fontSize="12">
              1:N
            </text>

            {/* User -> Transaction */}
            <path d="M150,150 L150,350" stroke="#4B5563" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <text x="130" y="250" textAnchor="middle" fontSize="12">
              1:N
            </text>

            {/* User -> Notification */}
            <path
              d="M200,150 C300,300 400,300 500,350"
              stroke="#4B5563"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
            <text x="350" y="300" textAnchor="middle" fontSize="12">
              1:N
            </text>
          </svg>
        </div>
      </div>

      <div className="mt-8 border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">表关系说明</h2>

        <ul className="space-y-2">
          <li>
            <span className="font-medium">User 与 Post</span>：一对多关系，一个用户可以创建多篇文章
          </li>
          <li>
            <span className="font-medium">User 与 Comment</span>：一对多关系，一个用户可以发表多条评论
          </li>
          <li>
            <span className="font-medium">Post 与 Comment</span>：一对多关系，一篇文章可以有多条评论
          </li>
          <li>
            <span className="font-medium">Post 与 Category</span>：多对多关系，通过 CategoryOnPost 表关联
          </li>
          <li>
            <span className="font-medium">Post 与 Tag</span>：多对多关系，通过 TagOnPost 表关联
          </li>
          <li>
            <span className="font-medium">User 与 Transaction</span>：一对多关系，一个用户可以有多笔交易
          </li>
          <li>
            <span className="font-medium">User 与 Notification</span>：一对多关系，一个用户可以有多条通知
          </li>
        </ul>
      </div>
    </div>
  )
}

