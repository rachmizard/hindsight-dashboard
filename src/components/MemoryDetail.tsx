import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { MemoryItem } from '@/lib/types'
import { MousePointerClick } from 'lucide-react'

interface MemoryDetailProps {
  memory: MemoryItem | null
}

export function MemoryDetail({ memory }: MemoryDetailProps) {
  if (!memory) {
    return (
      <div className="flex min-h-80 items-center justify-center p-8 text-center">
        <div className="max-w-xs">
          <MousePointerClick
            className="mx-auto size-7 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-semibold text-foreground">Select a memory</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Choose an item from the list to inspect its full content and provenance.
          </p>
        </div>
      </div>
    )
  }

  return (
    <article className="p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge
          variant={memory.fact_type === 'observation' ? 'default' : 'secondary'}
          className="rounded-md"
        >
          {memory.fact_type}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatDate(memory.date)}
        </span>
      </div>

      <p className="mb-5 whitespace-pre-wrap text-sm leading-7 text-foreground">
        {memory.text}
      </p>

      {memory.tags && memory.tags.length > 0 && (
        <>
          <Separator className="my-4" />
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-2">
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-md">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {memory.context ? (
        <>
          <Separator className="my-4" />
          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Context</p>
            <p className="m-0 break-words text-sm text-foreground">{memory.context}</p>
          </div>
        </>
      ) : null}
    </article>
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