import { useQuery } from '@tanstack/react-query'
import { getMemories } from '@/server/memories'
import { queryKeys } from '@/lib/query-keys'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { MemoryItem } from '@/lib/types'

interface MemoryListProps {
  bankId: string
  page?: number
  type?: string
  tag?: string
  onSelect?: (memory: MemoryItem) => void
}

export default function MemoryList({ bankId, page = 1, type, tag, onSelect }: MemoryListProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.memories.list(bankId, { page, type, tag }),
    queryFn: () => getMemories(bankId, { page, type, tag }),
    enabled: !!bankId,
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  const memories = data?.memories ?? []

  if (memories.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
        No memories found
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {memories.map((memory) => (
        <button
          key={memory.id}
          onClick={() => onSelect?.(memory)}
          className="demo-list-item w-full cursor-pointer text-left transition hover:border-[var(--lagoon-deep)]"
        >
          <div className="mb-1 flex items-center gap-2">
            <Badge variant={memory.type === 'fact' ? 'default' : 'secondary'}>
              {memory.type}
            </Badge>
            {memory.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="line-clamp-2 text-sm text-[var(--sea-ink)]">
            {memory.content}
          </p>
          <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
            {new Date(memory.created_at).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  )
}
