import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getBankStats, getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import { StatCard } from '@/components/StatCard'
import { FactTypeChart } from '@/components/FactTypeChart'
import { LinkTypeChart } from '@/components/LinkTypeChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearch } from '@tanstack/react-router'
import { BarChart3, Link, FileText, Eye } from 'lucide-react'

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
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
              <CardContent><Skeleton className="h-48 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Overview — {bankId}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Nodes" value={stats.total_nodes} icon={BarChart3} />
        <StatCard title="Total Links" value={stats.total_links} icon={Link} />
        <StatCard title="Documents" value={stats.total_documents} icon={FileText} />
        <StatCard title="Observations" value={stats.total_observations} icon={Eye} />
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
