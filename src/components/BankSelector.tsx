import { useQuery } from '@tanstack/react-query'
import { getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BankSelectorProps {
  value?: string
  onValueChange?: (value: string) => void
}

export default function BankSelector({ value, onValueChange }: BankSelectorProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.banks.list(),
    queryFn: getBanks,
  })

  if (isLoading) {
    return (
      <div className="h-9 w-full animate-pulse rounded-md bg-[var(--chip-bg)]" />
    )
  }

  const banks = data?.banks ?? []

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a bank..." />
      </SelectTrigger>
      <SelectContent>
        {banks.map((bank) => (
          <SelectItem key={bank.id} value={bank.id}>
            {bank.name}
          </SelectItem>
        ))}
        {banks.length === 0 && (
          <SelectItem value="__none__" disabled>
            No banks available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
