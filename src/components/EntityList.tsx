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

interface EntityListProps {
  data: EntityGraphResponse
}

export function EntityList({ data }: EntityListProps) {
  const { nodes, edges } = data

  if (nodes.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No entities found
      </div>
    )
  }

  return (
    <div>
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
                    <span className="text-muted-foreground">—</span>
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
