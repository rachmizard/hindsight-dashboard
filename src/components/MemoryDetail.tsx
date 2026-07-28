import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { MemoryItem } from '@/lib/types'

interface MemoryDetailProps {
  memory: MemoryItem
}

export default function MemoryDetail({ memory }: MemoryDetailProps) {
  return (
    <div className="demo-panel">
      <div className="mb-3 flex items-center gap-2">
        <Badge variant={memory.type === 'fact' ? 'default' : 'secondary'}>
          {memory.type}
        </Badge>
        <span className="text-xs text-[var(--sea-ink-soft)]">
          {new Date(memory.created_at).toLocaleString()}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-[var(--sea-ink)]">
        {memory.content}
      </p>

      {memory.tags && memory.tags.length > 0 && (
        <>
          <Separator className="my-3" />
          <div className="mb-3">
            <p className="mb-1 text-xs font-semibold text-[var(--sea-ink-soft)] uppercase">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {memory.source && (
        <>
          <Separator className="my-3" />
          <div>
            <p className="mb-1 text-xs font-semibold text-[var(--sea-ink-soft)] uppercase">
              Source
            </p>
            <p className="text-sm text-[var(--sea-ink)]">{memory.source}</p>
          </div>
        </>
      )}

      {memory.metadata && Object.keys(memory.metadata).length > 0 && (
        <>
          <Separator className="my-3" />
          <div>
            <p className="mb-1 text-xs font-semibold text-[var(--sea-ink-soft)] uppercase">
              Metadata
            </p>
            <pre className="demo-code-block text-xs">
              {JSON.stringify(memory.metadata, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}
