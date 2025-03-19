// 導入推送通知按鈕組件
import PushNotificationButton from "@/components/push-notification-button"

const MainNav = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <div className="text-lg font-bold">Your App Name</div>
      {/* 在導航欄的適當位置添加按鈕
      例如，在用戶菜單或其他操作按鈕旁邊 */}
      <div className="flex items-center gap-2">
        <PushNotificationButton />
        {/* 其他導航項目 */}
      </div>
    </nav>
  )
}

export default MainNav

