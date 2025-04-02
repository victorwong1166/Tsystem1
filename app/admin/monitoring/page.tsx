import { Suspense } from "react"
import SystemOverview from "./components/system-overview"
import PerformanceMetrics from "./components/performance-metrics"
import RequestLogs from "./components/request-logs"
import ErrorMonitoring from "./components/error-monitoring"
import UserActivity from "./components/user-activity"
import LoadingCard from "./components/loading-card"

export default function MonitoringPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">系统监控</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">系统状态概览</h2>
        <Suspense fallback={<LoadingCard />}>
          <SystemOverview />
        </Suspense>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">性能指标</h2>
        <Suspense fallback={<LoadingCard />}>
          <PerformanceMetrics />
        </Suspense>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">请求日志</h2>
        <Suspense fallback={<LoadingCard />}>
          <RequestLogs />
        </Suspense>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">错误监控</h2>
        <Suspense fallback={<LoadingCard />}>
          <ErrorMonitoring />
        </Suspense>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">用户活动</h2>
        <Suspense fallback={<LoadingCard />}>
          <UserActivity />
        </Suspense>
      </div>
    </div>
  )
}

