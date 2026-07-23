'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { PosNumericKeypad } from './pos-numeric-keypad'
import { createPosTransaction } from '@/app/actions/pos-transactions'
import { TransactionType } from '@prisma/client'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { toast } from 'sonner'

interface StaffPosDashboardProps {
  userId: string
  shiftId?: string
}

type TransactionAction = {
  type: TransactionType
  label: string
  color: string
}

const TRANSACTION_ACTIONS: TransactionAction[] = [
  { type: 'CASH_BUY_IN', label: '現金買入', color: 'bg-green-600' },
  { type: 'CREDIT_SIGN_IN', label: '信用簽帳', color: 'bg-blue-600' },
  { type: 'CASH_OUT', label: '現金取出', color: 'bg-orange-600' },
  { type: 'DEBT_REPAY', label: '債務還款', color: 'bg-purple-600' },
  { type: 'VAULT_IN', label: '金庫進帳', color: 'bg-indigo-600' },
  { type: 'VAULT_OUT', label: '金庫出帳', color: 'bg-red-600' },
  { type: 'DEPOSIT', label: '存款', color: 'bg-teal-600' },
  { type: 'WITHDRAWAL', label: '提款', color: 'bg-yellow-600' },
]

export function StaffPosDashboard({ userId, shiftId }: StaffPosDashboardProps) {
  const [memberId, setMemberId] = useState('')
  const [amount, setAmount] = useState(0)
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'idle'
    message: string
  }>({ type: 'idle', message: '' })
  const memberInputRef = useRef<HTMLInputElement>(null)

  const handleTransactionClick = (type: TransactionType) => {
    setSelectedType(type)
    setStatus({ type: 'idle', message: '' })
  }

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount)
  }

  const handleSubmit = async () => {
    if (!memberId || !selectedType || amount === 0) {
      setStatus({
        type: 'error',
        message: '請填寫會員編號、選擇交易類型並輸入金額',
      })
      return
    }

    setLoading(true)
    try {
      const result = await createPosTransaction({
        memberId,
        type: selectedType,
        amount,
        userId,
        shiftId,
      })

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message,
        })
        toast.success(result.message)

        // 重置表單
        setTimeout(() => {
          setMemberId('')
          setAmount(0)
          setSelectedType(null)
          setStatus({ type: 'idle', message: '' })
          memberInputRef.current?.focus()
        }, 1500)
      } else {
        setStatus({
          type: 'error',
          message: result.message,
        })
        toast.error(result.message)
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: '交易失敗，請稍後重試',
      })
      toast.error('交易失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 標題 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">POS 交易系統</h1>
        <p className="text-sm text-gray-500 mt-1">基層員工交易介面</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：交易類型和會員 */}
        <div className="space-y-4">
          {/* 會員編號輸入 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              會員編號
            </label>
            <Input
              ref={memberInputRef}
              type="text"
              placeholder="輸入會員 ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              disabled={loading}
              className="w-full h-10 border-gray-300"
            />
          </div>

          {/* 交易類型選擇 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              交易類型
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TRANSACTION_ACTIONS.map((action) => (
                <Button
                  key={action.type}
                  onClick={() => handleTransactionClick(action.type)}
                  disabled={loading}
                  className={`h-12 text-white font-semibold transition-all ${
                    selectedType === action.type
                      ? `${action.color} ring-2 ring-offset-2 ring-gray-400`
                      : `${action.color} opacity-75 hover:opacity-100`
                  }`}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 狀態提示 */}
          {status.type !== 'idle' && (
            <div
              className={`p-3 rounded-lg flex items-start gap-2 ${
                status.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    status.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {status.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 右側：數字鍵盤 */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            金額輸入
          </label>
          <PosNumericKeypad
            onAmountChange={handleAmountChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* 提交按鈕 */}
      <div className="mt-6 flex gap-3 justify-end">
        <Button
          onClick={() => {
            setMemberId('')
            setAmount(0)
            setSelectedType(null)
            setStatus({ type: 'idle', message: '' })
          }}
          disabled={loading}
          variant="outline"
          className="h-10 px-6"
        >
          重置
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            loading ||
            !memberId ||
            !selectedType ||
            amount === 0
          }
          className="h-10 px-8 bg-gray-900 text-white hover:bg-gray-800 font-semibold flex items-center gap-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? '處理中...' : '確認交易'}
        </Button>
      </div>

      {/* 交易金額顯示 */}
      {selectedType && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase">交易類型</p>
              <p className="text-lg font-bold text-gray-900">
                {TRANSACTION_ACTIONS.find((a) => a.type === selectedType)?.label}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">會員</p>
              <p className="text-lg font-bold text-gray-900">
                {memberId || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">金額</p>
              <p className="text-lg font-bold text-green-600">${amount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
