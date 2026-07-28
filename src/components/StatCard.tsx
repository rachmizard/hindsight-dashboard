import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: number | string
  description?: string
}

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-[var(--sea-ink-soft)]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[var(--sea-ink)]">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
