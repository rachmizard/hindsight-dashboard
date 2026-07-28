import { createServerFn } from '@tanstack/react-start'
import { getApiClient } from './api'
import type { EntityGraphResponse } from '@/lib/types'

export const getEntityGraph = createServerFn({ method: 'GET' })
  .validator((bankId: string) => bankId)
  .handler(async ({ data: bankId }) => {
    const client = getApiClient()
    const { data } = await client.get<EntityGraphResponse>(
      `/v1/default/banks/${bankId}/entities/graph`
    )
    return data
  })
