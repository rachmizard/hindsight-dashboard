import { createServerFn } from '@tanstack/react-start'
import { getApiClient } from './api'
import type { BankListResponse, BankStats } from '@/lib/types'

export const getBanks = createServerFn({ method: 'GET' }).handler(async () => {
  const client = getApiClient()
  const { data } = await client.get<BankListResponse>('/v1/default/banks')
  return data
})

export const getBankStats = createServerFn({ method: 'GET' })
  .validator((bankId: string) => bankId)
  .handler(async ({ data: bankId }) => {
    const client = getApiClient()
    const { data } = await client.get<BankStats>(`/v1/default/banks/${bankId}/stats`)
    return data
  })
