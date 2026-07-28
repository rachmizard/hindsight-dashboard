import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { BankSelector } from "@/components/BankSelector"
import { authClient } from "@/lib/auth-client"
import {
  LayoutDashboard,
  Database,
  Share2,
  Search,
  LogOut,
  BrainCircuit,
} from "lucide-react"

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/memories", label: "Memories", icon: Database },
  { to: "/entities", label: "Entities", icon: Share2 },
  { to: "/recall", label: "Recall Search", icon: Search },
] as const

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authClient.signOut()
    navigate({ to: "/login" })
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-3">
        <Link
          to="/"
          className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-sidebar-foreground no-underline"
          aria-label="Hindsight overview"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BrainCircuit className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">Hindsight</span>
            <span className="block truncate text-[11px] text-sidebar-foreground/65">
              Memory workspace
            </span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-2">
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold normal-case tracking-normal text-sidebar-foreground/55">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    className="h-11 gap-3 rounded-lg px-3 font-medium"
                  >
                    <Link to={item.to} search={(current) => current}>
                      <item.icon className="size-[18px]" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarGroup className="gap-1 rounded-lg bg-sidebar-accent/45 p-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="px-1 py-1">
                  <p className="mb-2 px-1 text-[11px] font-semibold text-sidebar-foreground/60">
                    Active Bank
                  </p>
                  <BankSelector />
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="mt-1 h-11 rounded-lg px-3 text-sidebar-foreground/75 hover:text-sidebar-foreground"
                >
                  <LogOut className="size-[18px]" aria-hidden="true" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
