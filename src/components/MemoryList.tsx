import { Badge } from '@/components/ui/badge'
import type { MemoryItem } from '@/lib/types'
import { FileSearch } from 'lucide-react'

interface MemoryListProps {
  memories: MemoryItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MemoryList({ memories, selectedId, onSelect }: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center p-6 text-center">
        <div className="max-w-xs">
          <FileSearch className="mx-auto size-7 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-foreground">No matching memories</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Adjust the filter or choose a different memory bank.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {memories.map((memory) => (
        <button
          type="button"
          key={memory.id}
          onClick={() => onSelect(memory.id)}
          aria-pressed={selectedId === memory.id}
          className={`w-full cursor-pointer rounded-lg px-3 py-3.5 text-left outline-none ${
            selectedId === memory.id
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-muted/75'
          }`}
        >
          <div className="mb-2 flex min-w-0 items-center gap-2">
            <Badge
              variant={memory.fact_type === 'observation' ? 'default' : 'secondary'}
              className="rounded-md"
            >
              {memory.fact_type}
            </Badge>
            {memory.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="max-w-28 truncate rounded-md text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="line-clamp-2 text-sm leading-6">{memory.text}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDate(memory.date)}
          </p>
        </button>
      ))}
    </div>
  )
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return '—'
  }
}