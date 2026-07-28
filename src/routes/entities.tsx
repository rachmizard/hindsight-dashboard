import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getEntityGraph } from '@/server/entities'
import { getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import { EntityGraph } from '@/components/EntityGraph'
import { EntityList } from '@/components/EntityList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Network } from 'lucide-react'

export const Route = createFileRoute('/entities')({
  component: EntitiesPage,
  loader: async () => await getBanks(),
})

function EntitiesPage() {
  const banks = Route.useLoaderData()
  const search = useSearch({ strict: false }) as { bank?: string }
  const bankId = search.bank || banks.banks[0]?.bank_id || ''

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.entityGraph(bankId),
    queryFn: () => getEntityGraph({ data: bankId }),
    enabled: !!bankId,
  })

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Entities — {bankId}</h2>
      {isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardContent className="p-6">
              <div className="flex h-64 items-center justify-center">
                <Network className="h-12 w-12 text-muted-foreground animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : data.total_entities === 0 ? (
        <Card>
          <CardContent className="flex h-48 items-center justify-center">
            <div className="text-center">
              <Network className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No entities found in this bank</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="graph">
          <TabsList>
            <TabsTrigger value="graph">Graph View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="graph">
            <EntityGraph data={data} />
          </TabsContent>
          <TabsContent value="list">
            <EntityList data={data} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}