import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getBanks, getBankStats } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import StatCard from '@/components/StatCard'
import FactTypeChart from '@/components/FactTypeChart'
import LinkTypeChart from '@/components/LinkTypeChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { data: banksData } = useQuery({
    queryKey: queryKeys.banks.list(),
    queryFn: getBanks,
  })

  const firstBankId = banksData?.banks?.[0]?.id

  const { data: stats } = useQuery({
    queryKey: queryKeys.bankStats.byId(firstBankId ?? ''),
    queryFn: () => getBankStats(firstBankId!),
    enabled: !!firstBankId,
  })

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
        Overview
      </h1>

      {/* Stat Cards */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Memories"
          value={stats?.total_memories ?? 0}
          description="Across all banks"
        />
        <StatCard
          title="Total Facts"
          value={stats?.total_facts ?? 0}
          description="Fact-type memories"
        />
        <StatCard
          title="Total Links"
          value={stats?.total_links ?? 0}
          description="Link-type memories"
        />
        <StatCard
          title="Banks"
          value={banksData?.total ?? banksData?.banks?.length ?? 0}
          description="Available banks"
        />
      </section>

      {/* Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
              Fact Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FactTypeChart data={stats?.fact_types ?? {}} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
              Link Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LinkTypeChart data={stats?.link_types ?? {}} />
          </CardContent>
        </Card>
      </section>

      {/* Top Tags */}
      {stats?.top_tags && stats.top_tags.length > 0 && (
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
                Top Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.top_tags.map(({ tag, count }) => (
                  <span
                    key={tag}
                    className="demo-pill"
                  >
                    {tag}
                    <span className="ml-1 rounded-full bg-[var(--lagoon)] px-1.5 py-0.5 text-xs text-white">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  )
}
