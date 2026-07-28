import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import MemoryList from '@/components/MemoryList'
import MemoryDetail from '@/components/MemoryDetail'
import BankSelector from '@/components/BankSelector'
import type { MemoryItem } from '@/lib/types'

export const Route = createFileRoute('/memories')({ component: MemoriesPage })

function MemoriesPage() {
  const { data: banksData } = useQuery({
    queryKey: queryKeys.banks.list(),
    queryFn: getBanks,
  })

  const [selectedBankId, setSelectedBankId] = useState<string>('')
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null)

  const bankId = selectedBankId || banksData?.banks?.[0]?.id || ''

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
          Memories
        </h1>
        <div className="w-56">
          <BankSelector
            value={selectedBankId}
            onValueChange={(v) => {
              setSelectedBankId(v)
              setSelectedMemory(null)
            }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="demo-section-title mb-3">Memory List</h2>
          <MemoryList
            bankId={bankId}
            onSelect={(memory) => setSelectedMemory(memory)}
          />
        </section>

        <section>
          <h2 className="demo-section-title mb-3">Detail</h2>
          {selectedMemory ? (
            <MemoryDetail memory={selectedMemory} />
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
              Select a memory to view details
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
