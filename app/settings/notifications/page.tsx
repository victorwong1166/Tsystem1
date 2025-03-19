import PushNotificationButton from "@/components/push-notification-button"

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">通知設置</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">推送通知</h2>
            <p className="text-gray-600">接收重要交易和結算的通知</p>
          </div>
          <PushNotificationButton />
        </div>
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-500 mb-2">啟用推送通知後，您將收到以下類型的通知：</p>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
            <li>新交易記錄</li>
            <li>結算完成提醒</li>
            <li>系統重要更新</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

