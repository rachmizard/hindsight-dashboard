import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import {
  AlertCircle,
  Database,
  Search,
  Sparkles,
} from 'lucide-react'
import { recallMemories } from '@/server/memories'
import { getBanks } from '@/server/banks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { RecallResult } from '@/lib/types'

export const Route = createFileRoute('/recall')({
  beforeLoad: async () => {
    const { requireAuth } = await import('@/lib/auth-middleware')
    await requireAuth()
  },
  component: RecallPage,
  loader: async () => await getBanks(),
})

function RecallPage() {
  const banks = Route.useLoaderData()
  const search = useSearch({ strict: false }) as { bank?: string }
  const bankId = search.bank || banks.banks[0]?.bank_id || ''
  const bank = banks.banks.find((item) => item.bank_id === bankId)
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [results, setResults] = useState<RecallResult[]>([])

  const mutation = useMutation({
    mutationFn: (searchQuery: string) =>
      recallMemories({ data: { bankId, query: searchQuery } }),
    onSuccess: (data) => setResults(data.results),
  })

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const nextQuery = query.trim()

    if (!nextQuery || !bankId) {
      return
    }

    setSubmittedQuery(nextQuery)
    mutation.mutate(nextQuery)
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Recall search</h1>
          <p>Ask the active bank for the memories most relevant to a natural-language query.</p>
        </div>
        <Badge variant="secondary" className="h-8 gap-2 rounded-md px-3">
          <Database className="size-3.5" aria-hidden="true" />
          {bank?.name || bankId || 'No bank'}
        </Badge>
      </div>

      <section className="section-surface p-4 sm:p-5" aria-labelledby="recall-prompt">
        <div className="mb-4">
          <h2 id="recall-prompt" className="text-sm font-semibold">
            What should Hindsight remember?
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Results combine semantic relevance with keyword evidence.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              aria-label="Recall query"
              placeholder="e.g. What decisions were made about authentication?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 bg-background pl-9 shadow-none"
              disabled={mutation.isPending || !bankId}
            />
          </div>
          <Button
            type="submit"
            className="h-11 sm:min-w-28"
            disabled={mutation.isPending || !query.trim() || !bankId}
          >
            {mutation.isPending ? (
              <>
                <span
                  className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                Searching…
              </>
            ) : (
              <>
                <Search className="size-4" aria-hidden="true" />
                Search
              </>
            )}
          </Button>
        </form>
      </section>

      <div className="mt-5" aria-live="polite">
        {mutation.isPending ? (
          <div className="space-y-3" aria-label="Searching memories">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="section-surface p-5" key={index}>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-44" />
                </div>
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : mutation.isError ? (
          <div className="section-surface flex min-h-48 items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <AlertCircle className="mx-auto size-7 text-destructive" aria-hidden="true" />
              <h2 className="mt-3 text-base font-semibold">Recall search failed</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Check the Hindsight API connection, then submit the query again.
              </p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <section aria-labelledby="recall-results">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 id="recall-results" className="text-sm font-semibold">
                Results for “{submittedQuery}”
              </h2>
              <span className="text-xs text-muted-foreground">
                {results.length} {results.length === 1 ? 'memory' : 'memories'}
              </span>
            </div>
            <div className="section-surface divide-y divide-border overflow-hidden">
              {results.map((result, index) => (
                <RecallResultRow result={result} rank={index + 1} key={result.id} />
              ))}
            </div>
          </section>
        ) : submittedQuery ? (
          <div className="section-surface flex min-h-52 items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <Search className="mx-auto size-7 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-3 text-base font-semibold">No memories matched</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Try a broader phrase or describe the event in different words.
              </p>
            </div>
          </div>
        ) : (
          <div className="section-surface flex min-h-52 items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <Sparkles className="mx-auto size-7 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-base font-semibold">Search your operational memory</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                Ask about a decision, incident, person, or topic to surface the strongest evidence.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RecallResultRow({ result, rank }: { result: RecallResult; rank: number }) {
  return (
    <article className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={result.type === 'fact' ? 'default' : 'secondary'} className="rounded-md">
              {result.type}
            </Badge>
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              Relevance {Math.round(result.scores.final * 100)}%
            </span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{result.text}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
            <span className="tabular-nums">Semantic {result.scores.semantic.toFixed(3)}</span>
            <span className="tabular-nums">Keyword {result.scores.keyword.toFixed(3)}</span>
            {result.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-md text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
