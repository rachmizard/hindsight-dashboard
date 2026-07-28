import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getMemories } from '@/server/memories'
import { getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import { MemoryList } from '@/components/MemoryList'
import { MemoryDetail } from '@/components/MemoryDetail'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/memories')({
  component: MemoriesPage,
  loader: async () => await getBanks(),
})

function MemoriesPage() {
  const banks = Route.useLoaderData()
  const search = useSearch({ strict: false }) as { bank?: string }
  const bankId = search.bank || banks.banks[0]?.bank_id || ''
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.memories(bankId, 100, 0),
    queryFn: () => getMemories({ data: { bankId, limit: 100, offset: 0 } }),
    enabled: !!bankId,
  })

  const filtered = data?.items.filter((m) =>
    searchText
      ? m.text.toLowerCase().includes(searchText.toLowerCase()) ||
        m.tags.some((t) => t.toLowerCase().includes(searchText.toLowerCase()))
      : true
  ) || []

  const selected = filtered.find((m) => m.id === selectedId) || null

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Memories — {bankId}</h2>
      <Input
        placeholder="Filter memories..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="max-w-sm"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <MemoryList memories={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </div>
        <MemoryDetail memory={selected} />
      </div>
    </div>
  )
}
