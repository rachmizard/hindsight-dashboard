import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  icon?: LucideIcon
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  const formattedValue =
    typeof value === 'number' ? new Intl.NumberFormat().format(value) : value

  return (
    <section className="metric-cell" aria-label={`${title}: ${formattedValue}`}>
      <div className="metric-label">
        <span>{title}</span>
        {Icon && (
          <span className="metric-icon" aria-hidden="true">
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <div className="metric-value">{formattedValue}</div>
      {description && <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>}
    </section>
  )
}
