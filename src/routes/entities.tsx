import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Database, Network, RefreshCw } from 'lucide-react'
import { getEntityGraph } from '@/server/entities'
import { getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import { EntityGraph } from '@/components/EntityGraph'
import { EntityList } from '@/components/EntityList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/entities')({
  component: EntitiesPage,
  loader: async () => await getBanks(),
})

function EntitiesPage() {
  const banks = Route.useLoaderData()
  const search = useSearch({ strict: false }) as { bank?: string }
  const bankId = search.bank || banks.banks[0]?.bank_id || ''
  const bank = banks.banks.find((item) => item.bank_id === bankId)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.entityGraph(bankId),
    queryFn: () => getEntityGraph({ data: bankId }),
    enabled: Boolean(bankId),
  })

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Entities</h1>
          <p>Explore the people, systems, and concepts connected across this memory bank.</p>
        </div>
        <Badge variant="secondary" className="h-8 gap-2 rounded-md px-3">
          <Database className="size-3.5" aria-hidden="true" />
          {bank?.name || bankId || 'No bank'}
        </Badge>
      </div>

      {isError ? (
        <div className="section-surface flex min-h-64 items-center justify-center p-8 text-center">
          <div className="max-w-sm">
            <AlertCircle className="mx-auto size-7 text-destructive" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold">Entity graph could not be loaded</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Check the API connection, then try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Retry
            </Button>
          </div>
        </div>
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-[32rem] w-full rounded-xl" />
        </div>
      ) : data.total_entities === 0 ? (
        <div className="section-surface flex min-h-64 items-center justify-center p-8 text-center">
          <div className="max-w-sm">
            <Network className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold">No entities in this bank</h2>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              Entities appear after Hindsight extracts named concepts from stored memories.
            </p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="graph">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <TabsList className="h-10">
              <TabsTrigger value="graph" className="min-w-24">
                Graph
              </TabsTrigger>
              <TabsTrigger value="list" className="min-w-24">
                List
              </TabsTrigger>
            </TabsList>
            <p className="m-0 text-xs text-muted-foreground">
              {new Intl.NumberFormat().format(data.total_entities)} entities ·{' '}
              {new Intl.NumberFormat().format(data.edges.length)} connections
            </p>
          </div>
          <TabsContent value="graph" className="section-surface mt-0 overflow-hidden p-2">
            <EntityGraph data={data} />
          </TabsContent>
          <TabsContent value="list" className="section-surface mt-0 overflow-hidden">
            <EntityList data={data} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
