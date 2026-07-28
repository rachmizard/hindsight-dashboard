import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { MemoryItem } from '@/lib/types'

interface MemoryDetailProps {
  memory: MemoryItem | null
}

export function MemoryDetail({ memory }: MemoryDetailProps) {
  if (!memory) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Select a memory to view details
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center gap-2">
        <Badge variant={memory.type === 'fact' ? 'default' : 'secondary'}>
          {memory.type}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {new Date(memory.created_at).toLocaleString()}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed">{memory.text}</p>

      {memory.tags && memory.tags.length > 0 && (
        <>
          <Separator className="my-3" />
          <div className="mb-3">
            <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {memory.source && (
        <>
          <Separator className="my-3" />
          <div>
            <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase">Source</p>
            <p className="text-sm">{memory.source}</p>
          </div>
        </>
      )}
    </div>
  )
}
