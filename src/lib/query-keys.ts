export const queryKeys = {
  banks: {
    all: ['banks'] as const,
    list: () => [...queryKeys.banks.all, 'list'] as const,
  },
  bankStats: {
    all: ['bank-stats'] as const,
    byId: (bankId: string) => [...queryKeys.bankStats.all, bankId] as const,
  },
  memories: {
    all: ['memories'] as const,
    list: (bankId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.memories.all, 'list', bankId, filters] as const,
  },
  recall: {
    all: ['recall'] as const,
    results: (bankId: string, query: string) =>
      [...queryKeys.recall.all, bankId, query] as const,
  },
  entityGraph: {
    all: ['entity-graph'] as const,
    byBank: (bankId: string, params?: Record<string, unknown>) =>
      [...queryKeys.entityGraph.all, bankId, params] as const,
  },
}
