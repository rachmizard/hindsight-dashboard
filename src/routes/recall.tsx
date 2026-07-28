import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { recallMemories } from '@/server/memories'
import { getBanks } from '@/server/banks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Sparkles } from 'lucide-react'
import type { RecallResult } from '@/lib/types'

export const Route = createFileRoute('/recall')({
  component: RecallPage,
  loader: async () => await getBanks(),
})

function RecallPage() {
  const banks = Route.useLoaderData()
  const search = useSearch({ strict: false }) as { bank?: string }
  const bankId = search.bank || banks.banks[0]?.bank_id || ''
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<RecallResult[]>([])

  const mutation = useMutation({
    mutationFn: (searchQuery: string) =>
      recallMemories({ data: { bankId, query: searchQuery } }),
    onSuccess: (data) => setResults(data.results),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) mutation.mutate(query.trim())
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Recall Search — {bankId}</h2>
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <Input
          placeholder="Search memories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" disabled={mutation.isPending || !query.trim()}>
          {mutation.isPending ? (
            <>
              <Search className="h-4 w-4 animate-pulse" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </form>

      <div className="space-y-3">
        {mutation.isPending && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!mutation.isPending && results.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{result.type}</Badge>
                <span className="text-xs text-muted-foreground">
                  Score: {result.scores.final.toFixed(3)} (semantic: {result.scores.semantic.toFixed(3)}, keyword: {result.scores.keyword.toFixed(3)})
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.text}</p>
              {result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {result.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {!mutation.isPending && results.length === 0 && !query && (
          <Card>
            <CardContent className="flex h-48 items-center justify-center">
              <div className="text-center">
                <Sparkles className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Enter a query above to search through memories
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!mutation.isPending && results.length === 0 && query && (
          <Card>
            <CardContent className="flex h-48 items-center justify-center">
              <p className="text-sm text-muted-foreground">No results. Try a different query.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}