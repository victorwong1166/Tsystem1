import SchemaDiagram from "../schema-diagram"
import RelationsDiagram from "../relations-diagram"

export default function DatabaseTablesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">数据库表结构</h1>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">表结构详情</h2>
        <SchemaDiagram />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">表关系图</h2>
        <RelationsDiagram />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">数据库设计说明</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-medium mb-2">设计原则</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>遵循数据库规范化原则，减少数据冗余</li>
              <li>使用外键约束确保数据完整性</li>
              <li>使用索引优化查询性能</li>
              <li>使用枚举类型规范状态值</li>
              <li>使用关联表处理多对多关系</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-medium mb-2">主要功能模块</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">用户管理</span>：User 表存储用户信息，支持多种角色
              </li>
              <li>
                <span className="font-medium">内容管理</span>：Post、Comment、Category、Tag 表组成内容管理系统
              </li>
              <li>
                <span className="font-medium">交易系统</span>：Transaction 表记录用户交易
              </li>
              <li>
                <span className="font-medium">通知系统</span>：Notification 表存储用户通知
              </li>
              <li>
                <span className="font-medium">系统配置</span>：Setting 表存储全局配置
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-medium mb-2">索引策略</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>所有主键自动创建索引</li>
              <li>所有外键字段创建索引，优化关联查询</li>
              <li>常用查询字段创建索引，如 User.email、Post.published</li>
              <li>多字段联合查询创建复合索引</li>
              <li>避免过度索引，平衡查询性能和写入性能</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-medium mb-2">扩展性考虑</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>使用 UUID/CUID 作为主键，便于分布式系统</li>
              <li>预留扩展字段，如 metadata JSON 字段</li>
              <li>使用软删除机制，保留历史数据</li>
              <li>设计支持分表分库的可能性</li>
              <li>考虑未来国际化需求</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

