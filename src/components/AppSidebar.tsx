import { useLocation, useNavigate } from "@tanstack/react-router"
import {
  Sidebar,
  SidebarContent,
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
} from "lucide-react"

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/memories", label: "Memories", icon: Database },
  { to: "/entities", label: "Entities", icon: Share2 },
  { to: "/recall", label: "Recall Search", icon: Search },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authClient.signOut()
    navigate({ to: "/login" })
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hindsight Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                  >
                    <a href={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="px-3 py-2">
                  <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Active Bank
                  </p>
                  <BankSelector />
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
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
