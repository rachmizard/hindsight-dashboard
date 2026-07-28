'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface FactTypeChartProps {
  data: Record<string, number>
}

export function FactTypeChart({ data }: FactTypeChartProps) {
  const chartData = Object.entries(data ?? {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    )
  }

  const summary = chartData.map((item) => `${item.name}: ${item.value}`).join(', ')

  return (
    <div role="img" aria-label={`Knowledge by fact type. ${summary}`}>
      <ResponsiveContainer width="100%" height={Math.max(220, chartData.length * 34)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 20, bottom: 0, left: 4 }}
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={96}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          />
          <Tooltip
            cursor={{ fill: 'var(--muted)' }}
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              boxShadow: 'var(--shadow-medium)',
              color: 'var(--popover-foreground)',
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 5, 5, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
