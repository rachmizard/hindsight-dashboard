'use client'

import { useEffect, useRef } from 'react'
import type { EntityGraphResponse } from '@/lib/types'

interface EntityGraphProps {
  data: EntityGraphResponse
}

export function EntityGraph({ data }: EntityGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<{
    destroy: () => void
    redraw: () => void
    setOptions: (options: object) => void
  } | null>(null)
  const rawNodes = data.nodes
  const rawEdges = data.edges

  useEffect(() => {
    if (!containerRef.current || rawNodes.length === 0) return

    let cancelled = false
    let themeObserver: MutationObserver | null = null

    async function init() {
      const vis = await import('vis-network/standalone')
      if (cancelled || !containerRef.current) return

      const palette = readGraphPalette()

      const visNodes = new vis.DataSet(
        rawNodes.map((n) => ({
          id: n.data.id,
          label: n.data.label,
          size: Math.max(12, Math.min(40, (n.data.mentionCount ?? 1) * 3)),
          color: n.data.color,
        }))
      )

      const visEdges = new vis.DataSet(
        rawEdges.map((e) => ({
          from: e.data.source,
          to: e.data.target,
          label: e.data.linkType ?? '',
          width: e.data.weight ?? 1,
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
          color: {
            color: palette.edge,
            highlight: palette.accent,
            hover: palette.accent,
          },
          font: {
            size: 10,
            color: palette.muted,
          },
        },
        nodes: {
          shape: 'dot',
          color: {
            background: palette.node,
            border: palette.nodeBorder,
            highlight: {
              background: palette.accentSoft,
              border: palette.accent,
            },
            hover: {
              background: palette.accentSoft,
              border: palette.accent,
            },
          },
          font: {
            size: 12,
            color: palette.text,
          },
          borderWidth: 2,
          shadow: false,
        },
      }

      networkRef.current = new vis.Network(containerRef.current!, { nodes: visNodes, edges: visEdges }, options)

      themeObserver = new MutationObserver(() => {
        const nextPalette = readGraphPalette()
        networkRef.current?.setOptions({
          nodes: {
            color: {
              background: nextPalette.node,
              border: nextPalette.nodeBorder,
              highlight: {
                background: nextPalette.accentSoft,
                border: nextPalette.accent,
              },
              hover: {
                background: nextPalette.accentSoft,
                border: nextPalette.accent,
              },
            },
            font: { color: nextPalette.text },
          },
          edges: {
            color: {
              color: nextPalette.edge,
              highlight: nextPalette.accent,
              hover: nextPalette.accent,
            },
            font: { color: nextPalette.muted },
          },
        })
        networkRef.current?.redraw()
      })
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      })
    }

    init()

    return () => {
      cancelled = true
      themeObserver?.disconnect()
      if (networkRef.current) {
        networkRef.current.destroy()
        networkRef.current = null
      }
    }
  }, [rawNodes, rawEdges])

  if (rawNodes.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
        No entity graph data available
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="h-[32rem] w-full rounded-lg bg-[var(--surface-sunken)]"
      role="img"
      aria-label={`Entity relationship graph with ${rawNodes.length} entities and ${rawEdges.length} connections. Drag to pan and scroll to zoom.`}
    />
  )
}

function readGraphPalette() {
  const styles = getComputedStyle(document.documentElement)

  return {
    text: styles.getPropertyValue('--foreground').trim(),
    muted: styles.getPropertyValue('--muted-foreground').trim(),
    node: styles.getPropertyValue('--secondary').trim(),
    nodeBorder: styles.getPropertyValue('--border').trim(),
    edge: styles.getPropertyValue('--input').trim(),
    accent: styles.getPropertyValue('--primary').trim(),
    accentSoft: styles.getPropertyValue('--accent').trim(),
  }
}