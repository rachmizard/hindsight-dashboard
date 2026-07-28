import { HeadContent, Scripts, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Link, Outlet } from '@tanstack/react-router'
import BankSelector from '../components/BankSelector'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Hindsight Dashboard',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = router.options.context.queryClient

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 border-r border-[var(--line)] bg-[var(--surface)] p-4">
              <div className="mb-6">
                <h1 className="text-lg font-bold text-[var(--sea-ink)]">
                  Hindsight
                </h1>
                <p className="text-xs text-[var(--sea-ink-soft)]">Dashboard</p>
              </div>

              <nav className="mb-6 flex flex-col gap-1">
                <Link
                  to="/"
                  className="nav-link rounded-md px-3 py-2 text-sm hover:bg-[var(--chip-bg)]"
                  activeProps={{ className: 'is-active bg-[var(--chip-bg)]' }}
                >
                  Overview
                </Link>
                <Link
                  to="/memories"
                  className="nav-link rounded-md px-3 py-2 text-sm hover:bg-[var(--chip-bg)]"
                  activeProps={{ className: 'is-active bg-[var(--chip-bg)]' }}
                >
                  Memories
                </Link>
                <Link
                  to="/entities"
                  className="nav-link rounded-md px-3 py-2 text-sm hover:bg-[var(--chip-bg)]"
                  activeProps={{ className: 'is-active bg-[var(--chip-bg)]' }}
                >
                  Entity Graph
                </Link>
                <Link
                  to="/recall"
                  className="nav-link rounded-md px-3 py-2 text-sm hover:bg-[var(--chip-bg)]"
                  activeProps={{ className: 'is-active bg-[var(--chip-bg)]' }}
                >
                  Recall Search
                </Link>
              </nav>

              <div className="border-t border-[var(--line)] pt-4">
                <p className="mb-2 text-xs font-semibold text-[var(--sea-ink-soft)] uppercase tracking-wider">
                  Active Bank
                </p>
                <BankSelector />
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1">
              {children}
            </main>
          </div>

          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  )
}
