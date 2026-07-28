import api from './api'
import type { MemoryItem, MemoryListResponse, RecallResponse } from '@/lib/types'

export async function getMemories(
  bankId: string,
  params?: { page?: number; per_page?: number; type?: string; tag?: string }
): Promise<MemoryListResponse> {
  const { data } = await api.get<MemoryListResponse>(`/banks/${bankId}/memories`, {
    params,
  })
  return data
}

export async function recallMemories(
  bankId: string,
  query: string,
  params?: { limit?: number }
): Promise<RecallResponse> {
  const { data } = await api.post<RecallResponse>(`/banks/${bankId}/recall`, {
    query,
    ...params,
  })
  return data
}
