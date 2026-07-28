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
      counts.set(edge.from, (counts.get(edge.from) ?? 0) + 1)
      counts.set(edge.to, (counts.get(edge.to) ?? 0) + 1)
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
            <TableHead>Group</TableHead>
            <TableHead className="text-right">Connections</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.map((node) => {
            const connectionCount = connectionCounts.get(node.id) ?? 0
            return (
              <TableRow key={node.id}>
                <TableCell className="max-w-sm font-medium">
                  <span className="line-clamp-2">{node.label}</span>
                </TableCell>
                <TableCell>
                  {node.group ? (
                    <Badge variant="outline" className="rounded-md">
                      {node.group}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
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
