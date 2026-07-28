export interface Bank {
  bank_id: string
  name: string
  fact_count: number
}

export interface BankListResponse {
  banks: Bank[]
}

export interface BankStats {
  total_nodes: number
  total_links: number
  total_documents: number
  total_observations: number
  nodes_by_fact_type: Record<string, number>
  links_by_link_type: Record<string, number>
}

export interface MemoryItem {
  id: string
  bank_id: string
  text: string
  type: 'fact' | 'link'
  tags: string[]
  source?: string
  created_at: string
  updated_at: string
}

export interface MemoryListResponse {
  items: MemoryItem[]
  total: number
}

export interface RecallResult {
  id: string
  text: string
  type: string
  scores: {
    final: number
    semantic: number
    keyword: number
  }
  tags: string[]
}

export interface RecallResponse {
  results: RecallResult[]
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
  total_entities: number
  nodes: EntityGraphNode[]
  edges: EntityGraphEdge[]
}
