import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import ThemeToggle from '@/components/ThemeToggle'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var root=document.documentElement;var mode=localStorage.getItem('theme')||'light';var dark=mode==='dark'||(mode==='auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches);root.classList.toggle('dark',dark);root.setAttribute('data-theme',mode);root.style.colorScheme=dark?'dark':'light';}catch(e){}})();`

const pageNames: Record<string, string> = {
  '/': 'Overview',
  '/memories': 'Memories',
  '/entities': 'Entities',
  '/recall': 'Recall search',
  '/about': 'About',
}

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
  const location = useLocation()
  const queryClient = router.options.context.queryClient
  const isAuthRoute = location.pathname === '/login'

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        <QueryClientProvider client={queryClient}>
          {isAuthRoute ? (
            children
          ) : (
            <TooltipProvider>
              <a className="skip-link" href="#main-content">
                Skip to main content
              </a>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="min-w-0 bg-background">
                  <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-[var(--header-bg)] px-4 backdrop-blur-md md:px-6">
                    <SidebarTrigger
                      className="size-11"
                      aria-label="Toggle navigation"
                    />
                    <div className="h-5 w-px bg-border" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {pageNames[location.pathname] ?? 'Hindsight'}
                      </p>
                      <p className="hidden text-xs text-muted-foreground sm:block">
                        Memory operations workspace
                      </p>
                    </div>
                    <div className="ml-auto">
                      <ThemeToggle />
                    </div>
                  </header>
                  <main id="main-content" className="min-w-0 flex-1" tabIndex={-1}>
                    {children}
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          )}

          {!isAuthRoute && (
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'TanStack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          )}
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  )
}
