import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (data: { user: User; token: string; role: UserRole }) => void;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
      setAuth: ({ user, token, role }) =>
        set({ user, token, role, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, role: null, isAuthenticated: false }),
      hasPermission: (requiredRoles: UserRole[]) => {
        const { role } = get();
        if (!role) return false;
        return requiredRoles.includes(role);
      },
    }),
    { name: 'bpbd-auth' }
  )
);
