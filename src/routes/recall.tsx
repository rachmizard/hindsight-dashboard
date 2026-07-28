import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBanks } from '@/server/banks'
import { recallMemories } from '@/server/memories'
import { queryKeys } from '@/lib/query-keys'
import BankSelector from '@/components/BankSelector'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/recall')({ component: RecallPage })

function RecallPage() {
  const { data: banksData } = useQuery({
    queryKey: queryKeys.banks.list(),
    queryFn: getBanks,
  })

  const [selectedBankId, setSelectedBankId] = useState<string>('')
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const bankId = selectedBankId || banksData?.banks?.[0]?.id || ''

  const { data: recallData, isLoading } = useQuery({
    queryKey: queryKeys.recall.results(bankId, submittedQuery),
    queryFn: () => recallMemories(bankId, submittedQuery),
    enabled: !!bankId && !!submittedQuery,
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setSubmittedQuery(query.trim())
    }
  }

  const results = recallData?.results ?? []

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
          Recall Search
        </h1>
        <div className="w-56">
          <BankSelector
            value={selectedBankId}
            onValueChange={setSelectedBankId}
          />
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="Search memories by semantic similarity..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!query.trim() || isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {!submittedQuery && (
        <div className="flex h-48 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
          Enter a query above to search memories
        </div>
      )}

      {isLoading && (
        <div className="flex h-48 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
          Searching...
        </div>
      )}

      {!isLoading && submittedQuery && results.length === 0 && (
        <div className="flex h-48 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
          No results found for &ldquo;{submittedQuery}&rdquo;
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <section>
          <p className="mb-3 text-sm text-[var(--sea-ink-soft)]">
            {recallData?.total ?? results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{submittedQuery}&rdquo;
          </p>
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className="demo-list-item">
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="outline">
                    Score: {result.score.toFixed(3)}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--sea-ink)]">
                  {result.content}
                </p>
                {result.metadata && Object.keys(result.metadata).length > 0 && (
                  <pre className="mt-2 text-xs text-[var(--sea-ink-soft)]">
                    {JSON.stringify(result.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
