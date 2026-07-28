import { createFileRoute } from '@tanstack/react-router'
import { BrainCircuit, Database, Network, Search } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>About Hindsight</h1>
          <p>A focused operational interface for understanding what your systems remember.</p>
        </div>
      </div>

      <section className="section-surface overflow-hidden">
        <div className="max-w-3xl p-6 sm:p-8">
          <BrainCircuit className="size-8 text-primary" aria-hidden="true" />
          <h2 className="mt-5 text-xl font-semibold tracking-tight">
            A navigable view of machine memory
          </h2>
          <p className="mt-3 max-w-[68ch] text-sm leading-7 text-muted-foreground">
            This workspace connects to the Hindsight API so operators can inspect bank
            health, browse stored memories, evaluate recall quality, and understand the
            entity relationships behind accumulated knowledge.
          </p>
        </div>
        <div className="grid border-t sm:grid-cols-3">
          {[
            {
              icon: Database,
              title: 'Inspect',
              body: 'Browse facts, links, tags, and source context.',
            },
            {
              icon: Search,
              title: 'Recall',
              body: 'Test semantic and keyword retrieval together.',
            },
            {
              icon: Network,
              title: 'Understand',
              body: 'Explore the concepts and relationships in each bank.',
            },
          ].map((item, index) => (
            <div
              className={`p-5 ${index > 0 ? 'border-t sm:border-t-0 sm:border-l' : ''}`}
              key={item.title}
            >
              <item.icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
