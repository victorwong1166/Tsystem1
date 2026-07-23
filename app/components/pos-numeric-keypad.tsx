'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PosNumericKeypadProps {
  onAmountChange: (amount: number) => void
  disabled?: boolean
}

export function PosNumericKeypad({
  onAmountChange,
  disabled = false,
}: PosNumericKeypadProps) {
  const [displayValue, setDisplayValue] = useState('0')

  const handleNumberClick = (num: string) => {
    setDisplayValue((prev) => {
      if (prev === '0') return num
      return prev + num
    })
  }

  const handleQuickAdd = (multiplier: number) => {
    const current = parseInt(displayValue) || 0
    const newValue = current + multiplier
    setDisplayValue(newValue.toString())
    onAmountChange(newValue)
  }

  const handleClear = () => {
    setDisplayValue('0')
    onAmountChange(0)
  }

  const handleConfirm = () => {
    const amount = parseInt(displayValue) || 0
    onAmountChange(amount)
  }

  const handleBackspace = () => {
    setDisplayValue((prev) => {
      if (prev.length === 1) return '0'
      return prev.slice(0, -1)
    })
  }

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
      {/* 顯示欄 */}
      <div className="bg-white border border-gray-300 rounded p-3 text-right">
        <div className="text-sm text-gray-500 mb-1">金額</div>
        <div className="text-3xl font-mono font-bold text-gray-900">
          ${displayValue}
        </div>
      </div>

      {/* 快速鍵 */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          onClick={() => handleQuickAdd(100)}
          disabled={disabled}
          className="h-12 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-semibold"
          variant="outline"
        >
          +100
        </Button>
        <Button
          onClick={() => handleQuickAdd(1000)}
          disabled={disabled}
          className="h-12 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-semibold"
          variant="outline"
        >
          +1K
        </Button>
        <Button
          onClick={() => handleQuickAdd(10000)}
          disabled={disabled}
          className="h-12 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-semibold"
          variant="outline"
        >
          +10K
        </Button>
        <Button
          onClick={() => handleQuickAdd(100000)}
          disabled={disabled}
          className="h-12 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-semibold"
          variant="outline"
        >
          +100K
        </Button>
      </div>

      {/* 數字鍵盤 */}
      <div className="grid grid-cols-4 gap-2">
        {[7, 8, 9, '/'].map((key) => (
          <Button
            key={key}
            onClick={() => key !== '/' && handleNumberClick(key.toString())}
            disabled={disabled}
            className="h-12 bg-white border border-gray-300 hover:bg-gray-100 text-lg font-semibold"
            variant="outline"
          >
            {key}
          </Button>
        ))}

        {[4, 5, 6, '*'].map((key) => (
          <Button
            key={key}
            onClick={() => key !== '*' && handleNumberClick(key.toString())}
            disabled={disabled}
            className="h-12 bg-white border border-gray-300 hover:bg-gray-100 text-lg font-semibold"
            variant="outline"
          >
            {key}
          </Button>
        ))}

        {[1, 2, 3, '-'].map((key) => (
          <Button
            key={key}
            onClick={() => key !== '-' && handleNumberClick(key.toString())}
            disabled={disabled}
            className="h-12 bg-white border border-gray-300 hover:bg-gray-100 text-lg font-semibold"
            variant="outline"
          >
            {key}
          </Button>
        ))}

        <Button
          onClick={() => handleNumberClick('0')}
          disabled={disabled}
          className="h-12 bg-white border border-gray-300 hover:bg-gray-100 text-lg font-semibold"
          variant="outline"
        >
          0
        </Button>
        <Button
          onClick={handleBackspace}
          disabled={disabled}
          className="h-12 col-span-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold"
          variant="outline"
        >
          ⌫ 退格
        </Button>
        <Button
          onClick={handleClear}
          disabled={disabled}
          className="h-12 bg-red-100 text-red-700 hover:bg-red-200 font-semibold"
          variant="outline"
        >
          C
        </Button>
      </div>

      {/* 確認按鈕 */}
      <Button
        onClick={handleConfirm}
        disabled={disabled || parseInt(displayValue) === 0}
        className="w-full h-12 bg-green-600 text-white hover:bg-green-700 font-bold text-lg rounded"
      >
        確認金額
      </Button>
    </div>
  )
}
