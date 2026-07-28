import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getEntityGraph } from '@/server/entities'
import { getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import { EntityGraph } from '@/components/EntityGraph'
import { EntityList } from '@/components/EntityList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
      <h2 className="text-xl font-semibold">Entities — {bankId}</h2>
      {isLoading || !data ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : data.total_entities === 0 ? (
        <p className="text-muted-foreground text-sm">No entities found</p>
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
