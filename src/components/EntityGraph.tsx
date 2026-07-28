'use client'

import { useEffect, useRef } from 'react'
import type { EntityGraphNode, EntityGraphEdge } from '@/lib/types'

interface EntityGraphProps {
  nodes: EntityGraphNode[]
  edges: EntityGraphEdge[]
}

export default function EntityGraph({ nodes, edges }: EntityGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return

    let cancelled = false

    async function init() {
      const vis = await import('vis-network')
      if (cancelled || !containerRef.current) return

      const visNodes = new vis.DataSet(
        nodes.map((n) => ({
          id: n.id,
          label: n.label,
          group: n.group,
          size: n.size ?? 20,
          color: n.color,
        }))
      )

      const visEdges = new vis.DataSet(
        edges.map((e) => ({
          from: e.from,
          to: e.to,
          label: e.label,
          width: e.weight ?? 1,
          arrows: 'to',
        }))
      )

      const options = {
        physics: {
          stabilization: true,
          barnesHut: {
            gravitationalConstant: -3000,
            springConstant: 0.04,
            springLength: 120,
          },
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragView: true,
        },
        edges: {
          smooth: {
            type: 'curvedCW',
            roundness: 0.2,
          },
          font: {
            size: 10,
            color: 'var(--sea-ink-soft)',
          },
        },
        nodes: {
          font: {
            size: 12,
            color: 'var(--sea-ink)',
          },
          borderWidth: 2,
          shadow: true,
        },
      }

      networkRef.current = new vis.Network(containerRef.current!, { nodes: visNodes, edges: visEdges }, options)
    }

    init()

    return () => {
      cancelled = true
      if (networkRef.current) {
        ;(networkRef.current as { destroy: () => void }).destroy()
        networkRef.current = null
      }
    }
  }, [nodes, edges])

  if (nodes.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
        No entity graph data available
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="h-96 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)]"
    />
  )
}
