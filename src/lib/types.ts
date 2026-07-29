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
  text: string
  context: string
  date: string
  fact_type: string
  document_id: string | null
  mentioned_at: string
  occurred_start: string | null
  occurred_end: string | null
  tags: string[]
  entities?: string
  chunk_id?: string | null
  proof_count?: number
  state?: string
  metadata?: Record<string, unknown>
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

// Entity graph API wraps everything in { data: { ... } }
export interface EntityGraphNodeData {
  id: string
  label: string
  mentionCount: number
  color: string
}

export interface EntityGraphNode {
  data: EntityGraphNodeData
}

export interface EntityGraphEdgeData {
  id: string
  source: string
  target: string
  linkType?: string
  weight?: number
  color?: string
  lineStyle?: string
  label?: string
}

export interface EntityGraphEdge {
  data: EntityGraphEdgeData
}

export interface EntityGraphResponse {
  total_entities: number
  nodes: EntityGraphNode[]
  edges: EntityGraphEdge[]
}