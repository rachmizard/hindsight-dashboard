import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  BarChart3,
  Database,
  Eye,
  FileText,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react'
import { getBankStats, getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import { StatCard } from '@/components/StatCard'
import { FactTypeChart } from '@/components/FactTypeChart'
import { LinkTypeChart } from '@/components/LinkTypeChart'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/')({
  component: Overview,
  loader: async () => await getBanks(),
})

function Overview() {
  const banks = Route.useLoaderData()
  const search = useSearch({ strict: false }) as { bank?: string }
  const bankId = search.bank || banks.banks[0]?.bank_id || ''
  const bank = banks.banks.find((item) => item.bank_id === bankId)

  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.bankStats(bankId),
    queryFn: () => getBankStats({ data: bankId }),
    enabled: Boolean(bankId),
  })

  if (!bankId) {
    return (
      <div className="dashboard-content">
        <div className="section-surface flex min-h-72 items-center justify-center p-8 text-center">
          <div className="max-w-sm">
            <Database className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <h1 className="mt-4 text-lg font-semibold">No memory banks available</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a bank in Hindsight, then refresh this workspace.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Overview</h1>
          <p>A compact read on the knowledge stored in your active memory bank.</p>
        </div>
        <Badge variant="secondary" className="h-8 gap-2 rounded-md px-3">
          <Database className="size-3.5" aria-hidden="true" />
          {bank?.name || bankId}
        </Badge>
      </div>

      {isError ? (
        <div className="section-surface flex min-h-56 items-center justify-center p-8 text-center">
          <div className="max-w-sm">
            <AlertCircle className="mx-auto size-7 text-destructive" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold">Stats could not be loaded</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Check the Hindsight API connection and try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Retry
            </Button>
          </div>
        </div>
      ) : isLoading || !stats ? (
        <OverviewSkeleton />
      ) : (
        <div className="space-y-5">
          <div className="metric-band">
            <StatCard title="Total nodes" value={stats.total_nodes} icon={BarChart3} />
            <StatCard title="Total links" value={stats.total_links} icon={LinkIcon} />
            <StatCard title="Documents" value={stats.total_documents} icon={FileText} />
            <StatCard title="Observations" value={stats.total_observations} icon={Eye} />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <section className="section-surface min-w-0 p-5">
              <div className="mb-5">
                <h2 className="text-sm font-semibold">Knowledge by fact type</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Distribution of stored nodes across fact categories.
                </p>
              </div>
              <FactTypeChart data={stats.nodes_by_fact_type} />
            </section>
            <section className="section-surface min-w-0 p-5">
              <div className="mb-5">
                <h2 className="text-sm font-semibold">Connections by link type</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  The relationship vocabulary connecting this bank.
                </p>
              </div>
              <LinkTypeChart data={stats.links_by_link_type} />
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="space-y-5" aria-label="Loading overview">
      <div className="metric-band">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="metric-cell" key={index}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="section-surface p-5" key={index}>
            <Skeleton className="h-4 w-44" />
            <Skeleton className="mt-5 h-56 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
