import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadgeMap: Record<string, string> = {
    admin: 'Admin',
    operator: 'Operator Desk',
    relawan: 'Relawan',
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-semibold text-foreground hidden sm:inline">
                Sistem Desk Relawan BPBD
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifikasi')}>
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emergency text-[10px] text-emergency-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-foreground font-medium">{user?.nama || 'User'}</span>
                <span className="status-badge bg-primary/10 text-primary">
                  {roleBadgeMap[role || ''] || role}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
