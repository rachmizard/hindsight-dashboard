'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface FactTypeChartProps {
  data: Record<string, number>
}

export default function FactTypeChart({ data }: FactTypeChartProps) {
  const chartData = Object.entries(data ?? {}).map(([name, value]) => ({
    name,
    value,
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--sea-ink-soft)]">
        No fact type data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: 'var(--sea-ink-soft)' }}
        />
        <YAxis tick={{ fontSize: 12, fill: 'var(--sea-ink-soft)' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--surface-strong)',
            border: '1px solid var(--line)',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="value" fill="var(--lagoon-deep)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
