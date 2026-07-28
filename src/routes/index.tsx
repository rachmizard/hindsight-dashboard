import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getBankStats, getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import { StatCard } from '@/components/StatCard'
import { FactTypeChart } from '@/components/FactTypeChart'
import { LinkTypeChart } from '@/components/LinkTypeChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Overview,
  loader: async () => await getBanks(),
})

function Overview() {
  const banks = Route.useLoaderData()
  const search = useSearch({ strict: false }) as { bank?: string }
  const bankId = search.bank || banks.banks[0]?.bank_id || ''

  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.bankStats(bankId),
    queryFn: () => getBankStats({ data: bankId }),
    enabled: !!bankId,
  })

  if (isLoading || !stats) {
    return <div className="p-6 text-muted-foreground">Loading stats...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Overview — {bankId}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Nodes" value={stats.total_nodes} />
        <StatCard title="Total Links" value={stats.total_links} />
        <StatCard title="Documents" value={stats.total_documents} />
        <StatCard title="Observations" value={stats.total_observations} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Nodes by Fact Type</CardTitle></CardHeader>
          <CardContent><FactTypeChart data={stats.nodes_by_fact_type} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Links by Type</CardTitle></CardHeader>
          <CardContent><LinkTypeChart data={stats.links_by_link_type} /></CardContent>
        </Card>
      </div>
    </div>
  )
}
