import DebugEnv from "@/components/debug-env"

export default function DebugPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">調試頁面</h1>
      <DebugEnv />
    </div>
  )
}

