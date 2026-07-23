'use server'

import { prisma } from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

export type PosTransactionInput = {
  memberId: string
  type: TransactionType
  amount: number
  userId: string
  shiftId?: string
}

export type PosTransactionResult = {
  success: boolean
  message: string
  transaction?: any
  error?: string
}

/**
 * 執行 POS 交易
 * 支援 8 種交易類型：
 * - CASH_BUY_IN: 現金買入
 * - CREDIT_SIGN_IN: 信用簽帳
 * - CASH_OUT: 現金取出
 * - DEBT_REPAY: 債務還款
 * - VAULT_IN: 金庫進帳
 * - VAULT_OUT: 金庫出帳
 * - DEPOSIT: 存款
 * - WITHDRAWAL: 提款
 */
export async function createPosTransaction(
  input: PosTransactionInput
): Promise<PosTransactionResult> {
  try {
    // 驗證必要欄位
    if (!input.memberId || !input.type || !input.amount || !input.userId) {
      return {
        success: false,
        message: '缺少必要的交易資訊',
        error: 'Missing required fields',
      }
    }

    // 驗證金額
    if (input.amount <= 0) {
      return {
        success: false,
        message: '交易金額必須大於 0',
        error: 'Invalid amount',
      }
    }

    // 查詢會員
    const member = await prisma.member.findUnique({
      where: { id: input.memberId },
    })

    if (!member) {
      return {
        success: false,
        message: '會員不存在',
        error: 'Member not found',
      }
    }

    // 根據交易類型執行不同的邏輯
    let updatedMember = member

    switch (input.type) {
      case 'CASH_BUY_IN':
        // 現金買入：增加會員餘額
        updatedMember = await prisma.member.update({
          where: { id: input.memberId },
          data: {
            balance: {
              increment: input.amount,
            },
          },
        })
        break

      case 'CREDIT_SIGN_IN':
        // 信用簽帳：增加當期債務
        updatedMember = await prisma.member.update({
          where: { id: input.memberId },
          data: {
            currentDebt: {
              increment: input.amount,
            },
          },
        })
        break

      case 'CASH_OUT':
        // 現金取出：減少會員餘額
        if (member.balance < input.amount) {
          return {
            success: false,
            message: '餘額不足',
            error: 'Insufficient balance',
          }
        }
        updatedMember = await prisma.member.update({
          where: { id: input.memberId },
          data: {
            balance: {
              decrement: input.amount,
            },
          },
        })
        break

      case 'DEBT_REPAY':
        // 債務還款：減少當期債務、增加餘額
        updatedMember = await prisma.member.update({
          where: { id: input.memberId },
          data: {
            currentDebt: {
              decrement: Math.min(input.amount, member.currentDebt),
            },
            balance: {
              increment: input.amount,
            },
          },
        })
        break

      case 'VAULT_IN':
        // 金庫進帳：系統記錄，不直接影響會員
        break

      case 'VAULT_OUT':
        // 金庫出帳：系統記錄，不直接影響會員
        break

      case 'DEPOSIT':
        // 存款：增加會員餘額
        updatedMember = await prisma.member.update({
          where: { id: input.memberId },
          data: {
            balance: {
              increment: input.amount,
            },
          },
        })
        break

      case 'WITHDRAWAL':
        // 提款：減少會員餘額
        if (member.balance < input.amount) {
          return {
            success: false,
            message: '餘額不足',
            error: 'Insufficient balance',
          }
        }
        updatedMember = await prisma.member.update({
          where: { id: input.memberId },
          data: {
            balance: {
              decrement: input.amount,
            },
          },
        })
        break
    }

    // 建立交易記錄
    const transaction = await prisma.transaction.create({
      data: {
        memberId: input.memberId,
        type: input.type,
        amount: input.amount,
        userId: input.userId,
        shiftId: input.shiftId,
      },
      include: {
        member: true,
        user: true,
      },
    })

    return {
      success: true,
      message: `${input.type} 交易成功`,
      transaction,
    }
  } catch (error) {
    console.error('[POS] Transaction error:', error)
    return {
      success: false,
      message: '交易失敗，請稍後重試',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 快速查詢會員資訊
 */
export async function getMemberInfo(memberId: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!member) {
      return {
        success: false,
        message: '會員不存在',
      }
    }

    return {
      success: true,
      member,
    }
  } catch (error) {
    console.error('[POS] Get member error:', error)
    return {
      success: false,
      message: '查詢會員失敗',
    }
  }
}
