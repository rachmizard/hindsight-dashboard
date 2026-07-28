import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useState } from 'react'
import { AlertCircle, Database, RefreshCw, Search, X } from 'lucide-react'
import { getMemories } from '@/server/memories'
import { getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import { MemoryList } from '@/components/MemoryList'
import { MemoryDetail } from '@/components/MemoryDetail'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/memories')({
  beforeLoad: async () => {
    const { requireAuth } = await import('@/lib/auth-middleware')
    await requireAuth()
  },
  component: MemoriesPage,
  loader: async () => await getBanks(),
})

function MemoriesPage() {
  const banks = Route.useLoaderData()
  const search = useSearch({ strict: false }) as { bank?: string }
  const bankId = search.bank || banks.banks[0]?.bank_id || ''
  const bank = banks.banks.find((item) => item.bank_id === bankId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const deferredSearch = useDeferredValue(searchText.trim().toLowerCase())

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.memories(bankId, 100, 0),
    queryFn: () => getMemories({ data: { bankId, limit: 100, offset: 0 } }),
    enabled: Boolean(bankId),
  })

  const filtered =
    data?.items.filter((memory) =>
      deferredSearch
        ? memory.text.toLowerCase().includes(deferredSearch) ||
          memory.tags.some((tag) => tag.toLowerCase().includes(deferredSearch))
        : true
    ) || []

  const selected = data?.items.find((memory) => memory.id === selectedId) || null

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Memories</h1>
          <p>Browse stored facts and links, then inspect their source and metadata.</p>
        </div>
        <Badge variant="secondary" className="h-8 gap-2 rounded-md px-3">
          <Database className="size-3.5" aria-hidden="true" />
          {bank?.name || bankId || 'No bank'}
        </Badge>
      </div>

      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            aria-label="Filter memories"
            placeholder="Filter by content or tag"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="h-10 bg-card pr-10 pl-9 shadow-none"
          />
          {searchText && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 size-10 rounded-l-none text-muted-foreground"
              onClick={() => setSearchText('')}
              aria-label="Clear memory filter"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
        <p className="m-0 text-xs font-medium text-muted-foreground" aria-live="polite">
          {isLoading ? 'Loading memories…' : `${filtered.length} of ${data?.total ?? 0} shown`}
        </p>
      </div>

      {isError ? (
        <div className="section-surface flex min-h-64 items-center justify-center p-8 text-center">
          <div className="max-w-sm">
            <AlertCircle className="mx-auto size-7 text-destructive" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold">Memories could not be loaded</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Check the API connection, then try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Retry
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
          <div className="section-surface space-y-3 p-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-24 w-full" key={index} />
            ))}
          </div>
          <Skeleton className="min-h-80 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
          <section className="section-surface min-w-0 p-2" aria-label="Memory list">
            <MemoryList
              memories={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </section>
          <section className="section-surface min-w-0 lg:sticky lg:top-[4.5rem]">
            <MemoryDetail memory={selected} />
          </section>
        </div>
      )}
    </div>
  )
}
