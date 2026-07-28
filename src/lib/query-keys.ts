export const queryKeys = {
  banks: ['banks'] as const,
  bankStats: (bankId: string) => ['banks', bankId, 'stats'] as const,
  memories: (bankId: string, limit: number, offset: number) =>
    ['banks', bankId, 'memories', { limit, offset }] as const,
  entityGraph: (bankId: string) => ['banks', bankId, 'entity-graph'] as const,
} as const
