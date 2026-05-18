'use client';

import { useAuthContext } from '@/lib/firebase/context';
import type { User, UserRole } from '@/types';

interface UseAuthReturn {
  user: User | null;
  userId: string | null;
  role: UserRole | null;
  email: string | null;
  name: string | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCoordinator: boolean;
  isYouthWorker: boolean;
  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
}

/**
 * Custom hook for accessing authentication state and user information
 * Provides user data, role information, and helper methods for role checking
 *
 * @example
 * const { user, role, isAdmin, isAuthenticated } = useAuth();
 * if (!isAuthenticated) return <LoginPage />;
 * if (isAdmin) return <AdminDashboard />;
 */
export const useAuth = (): UseAuthReturn => {
  const { firebaseUser, user, role, loading, error, isAuthenticated } =
    useAuthContext();

  const isAdmin = role === 'admin';
  const isCoordinator = role === 'coordinator';
  const isYouthWorker = role === 'youth_worker';

  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!role) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  };

  return {
    user,
    userId: firebaseUser?.uid || null,
    role,
    email: user?.email || null,
    name: user?.name || null,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isCoordinator,
    isYouthWorker,
    hasRole,
  };
};
