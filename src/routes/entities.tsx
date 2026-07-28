import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBanks } from '@/server/banks'
import { getEntityGraph } from '@/server/entities'
import { queryKeys } from '@/lib/query-keys'
import BankSelector from '@/components/BankSelector'
import EntityGraph from '@/components/EntityGraph'
import EntityList from '@/components/EntityList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/entities')({ component: EntitiesPage })

function EntitiesPage() {
  const { data: banksData } = useQuery({
    queryKey: queryKeys.banks.list(),
    queryFn: getBanks,
  })

  const [selectedBankId, setSelectedBankId] = useState<string>('')

  const bankId = selectedBankId || banksData?.banks?.[0]?.id || ''

  const { data: graphData, isLoading } = useQuery({
    queryKey: queryKeys.entityGraph.byBank(bankId),
    queryFn: () => getEntityGraph(bankId),
    enabled: !!bankId,
  })

  const nodes = graphData?.nodes ?? []
  const edges = graphData?.edges ?? []

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
          Entity Graph
        </h1>
        <div className="w-56">
          <BankSelector
            value={selectedBankId}
            onValueChange={setSelectedBankId}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
          Loading entity graph...
        </div>
      ) : (
        <Tabs defaultValue="graph">
          <TabsList className="mb-4">
            <TabsTrigger value="graph">Graph View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="graph">
            <EntityGraph nodes={nodes} edges={edges} />
          </TabsContent>

          <TabsContent value="table">
            <EntityList nodes={nodes} edges={edges} />
          </TabsContent>
        </Tabs>
      )}
    </main>
  )
}
