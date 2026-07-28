import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getBanks } from '@/server/banks'
import { queryKeys } from '@/lib/query-keys'

export function BankSelector() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { bank?: string }
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.banks,
    queryFn: () => getBanks(),
  })

  const activeBank = search.bank || data?.banks[0]?.bank_id || ''

  return (
    <Select
      value={activeBank}
      onValueChange={(value) => navigate({ search: { bank: value } })}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select bank..." />
      </SelectTrigger>
      <SelectContent>
        {data?.banks.map((bank) => (
          <SelectItem key={bank.bank_id} value={bank.bank_id}>
            {bank.name} ({bank.fact_count})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
