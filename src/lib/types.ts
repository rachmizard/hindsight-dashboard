export interface Bank {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
  memory_count?: number
}

export interface BankListResponse {
  banks: Bank[]
  total: number
}

export interface BankStats {
  total_memories: number
  total_facts: number
  total_links: number
  fact_types: Record<string, number>
  link_types: Record<string, number>
  top_tags: { tag: string; count: number }[]
}

export interface MemoryItem {
  id: string
  bank_id: string
  content: string
  type: 'fact' | 'link'
  metadata?: Record<string, unknown>
  tags?: string[]
  source?: string
  created_at: string
  updated_at: string
}

export interface MemoryListResponse {
  memories: MemoryItem[]
  total: number
  page: number
  per_page: number
}

export interface RecallResult {
  id: string
  content: string
  score: number
  metadata?: Record<string, unknown>
}

export interface RecallResponse {
  results: RecallResult[]
  query: string
  total: number
}

export interface EntityGraphNode {
  id: string
  label: string
  group?: string
  size?: number
  color?: string
}

export interface EntityGraphEdge {
  from: string
  to: string
  label?: string
  weight?: number
}

export interface EntityGraphResponse {
  nodes: EntityGraphNode[]
  edges: EntityGraphEdge[]
}
