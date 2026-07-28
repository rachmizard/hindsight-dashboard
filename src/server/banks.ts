import api from './api'
import type { BankListResponse, BankStats } from '@/lib/types'

export async function getBanks(): Promise<BankListResponse> {
  const { data } = await api.get<BankListResponse>('/banks')
  return data
}

export async function getBankStats(bankId: string): Promise<BankStats> {
  const { data } = await api.get<BankStats>(`/banks/${bankId}/stats`)
  return data
}
