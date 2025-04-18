export default function LoadingCard() {
  return (
    <div className="border rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  )
}

