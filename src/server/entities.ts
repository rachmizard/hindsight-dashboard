import api from './api'
import type { EntityGraphResponse } from '@/lib/types'

export async function getEntityGraph(
  bankId: string,
  params?: { depth?: number; limit?: number }
): Promise<EntityGraphResponse> {
  const { data } = await api.get<EntityGraphResponse>(`/banks/${bankId}/entities/graph`, {
    params,
  })
  return data
}
