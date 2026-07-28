import { Badge } from '@/components/ui/badge'
import type { MemoryItem } from '@/lib/types'

interface MemoryListProps {
  memories: MemoryItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MemoryList({ memories, selectedId, onSelect }: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No memories found
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {memories.map((memory) => (
        <button
          key={memory.id}
          onClick={() => onSelect(memory.id)}
          className={`w-full cursor-pointer text-left transition rounded-lg border p-3 ${
            selectedId === memory.id
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
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
          <p className="line-clamp-2 text-sm">{memory.text}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(memory.created_at).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  )
}
