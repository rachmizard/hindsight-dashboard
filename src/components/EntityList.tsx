import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { EntityGraphNode, EntityGraphEdge } from '@/lib/types'

interface EntityListProps {
  nodes: EntityGraphNode[]
  edges: EntityGraphEdge[]
}

export default function EntityList({ nodes, edges }: EntityListProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
        No entities found
      </div>
    )
  }

  return (
    <div className="demo-table-shell">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entity</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Connections</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.map((node) => {
            const connectionCount = edges.filter(
              (e) => e.from === node.id || e.to === node.id
            ).length
            return (
              <TableRow key={node.id}>
                <TableCell className="font-medium">{node.label}</TableCell>
                <TableCell>
                  {node.group ? (
                    <Badge variant="outline">{node.group}</Badge>
                  ) : (
                    <span className="text-[var(--sea-ink-soft)]">—</span>
                  )}
                </TableCell>
                <TableCell>{connectionCount}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
