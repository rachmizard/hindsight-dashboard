import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { EntityGraphResponse } from '@/lib/types'
import { useMemo } from 'react'

interface EntityListProps {
  data: EntityGraphResponse
}

export function EntityList({ data }: EntityListProps) {
  const { nodes, edges } = data
  const connectionCounts = useMemo(() => {
    const counts = new Map<string, number>()

    for (const edge of edges) {
      const src = edge.data.source
      const tgt = edge.data.target
      counts.set(src, (counts.get(src) ?? 0) + 1)
      counts.set(tgt, (counts.get(tgt) ?? 0) + 1)
    }

    return counts
  }, [edges])

  if (nodes.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No entities found
      </div>
    )
  }

  return (
    <div className="max-h-[36rem] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/70 hover:bg-muted/70">
            <TableHead>Entity</TableHead>
            <TableHead className="text-right">Connections</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.map((node) => {
            const connectionCount = connectionCounts.get(node.data.id) ?? 0
            return (
              <TableRow key={node.data.id}>
                <TableCell className="max-w-sm font-medium">
                  <span className="line-clamp-2">{node.data.label}</span>
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  {connectionCount}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}