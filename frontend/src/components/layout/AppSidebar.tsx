import { Users, Building, Wrench, AlertTriangle, ClipboardList, UserCheck, MapPin,
  FileText, Package, Bell, BarChart3, Settings, User, LayoutDashboard, Shield } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, roles: ['admin', 'operator', 'relawan'] },
  { title: 'Data Relawan', url: '/relawan', icon: Users, roles: ['admin', 'operator'] },
  { title: 'Data Organisasi', url: '/organisasi', icon: Building, roles: ['admin', 'operator'] },
  { title: 'Data Keahlian', url: '/keahlian', icon: Wrench, roles: ['admin'] },
  { title: 'Kejadian Bencana', url: '/bencana', icon: AlertTriangle, roles: ['admin', 'operator', 'relawan'] },
  { title: 'Permintaan Relawan', url: '/permintaan', icon: ClipboardList, roles: ['admin', 'operator'] },
  { title: 'Penugasan Relawan', url: '/penugasan', icon: UserCheck, roles: ['admin', 'operator'] },
  { title: 'Monitoring Relawan', url: '/monitoring', icon: MapPin, roles: ['admin', 'operator'] },
  { title: 'Laporan Kegiatan', url: '/laporan', icon: FileText, roles: ['admin', 'operator', 'relawan'] },
  { title: 'Manajemen Logistik', url: '/logistik', icon: Package, roles: ['admin', 'operator'] },
  { title: 'Notifikasi', url: '/notifikasi', icon: Bell, roles: ['admin', 'operator', 'relawan'] },
  { title: 'Laporan & Statistik', url: '/statistik', icon: BarChart3, roles: ['admin', 'operator'] },
  { title: 'Manajemen Pengguna', url: '/pengguna', icon: Settings, roles: ['admin'] },
  { title: 'Profil', url: '/profil', icon: User, roles: ['admin', 'operator', 'relawan'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const role = useAuthStore((s) => s.role);

  const filteredItems = menuItems.filter((item) =>
    role ? item.roles.includes(role) : true
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">BPBD</span>
              <span className="text-[10px] text-muted-foreground">Desk Relawan</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="text-[10px] text-muted-foreground text-center">
            Sistem Desk Relawan v1.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
