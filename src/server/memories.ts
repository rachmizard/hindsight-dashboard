import { createServerFn } from '@tanstack/react-start'
import { getApiClient } from './api'
import type { MemoryListResponse, RecallResponse } from '@/lib/types'

export const getMemories = createServerFn({ method: 'GET' })
  .validator((params: { bankId: string; limit?: number; offset?: number }) => params)
  .handler(async ({ data: { bankId, limit = 50, offset = 0 } }) => {
    const client = getApiClient()
    const { data } = await client.get<MemoryListResponse>(
      `/v1/default/banks/${bankId}/memories/list`,
      { params: { limit, offset } }
    )
    return data
  })

export const recallMemories = createServerFn({ method: 'POST' })
  .validator((params: { bankId: string; query: string }) => params)
  .handler(async ({ data: { bankId, query } }) => {
    const client = getApiClient()
    const { data } = await client.post<RecallResponse>(
      `/v1/default/banks/${bankId}/memories/recall`,
      { query }
    )
    return data
  })
