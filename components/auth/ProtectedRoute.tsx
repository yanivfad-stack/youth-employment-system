'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Component to protect routes based on authentication and role
 *
 * @example
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 *
 * <ProtectedRoute requiredRole={['admin', 'coordinator']}>
 *   <ManagementPanel />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen" dir="rtl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              נדרשת אימות זהות
            </h1>
            <p className="text-gray-600 mb-8">
              אנא התחבר כדי לגשת לעמוד זה
            </p>
          </div>
        </div>
      )
    );
  }

  if (requiredRole) {
    const hasRole = Array.isArray(requiredRole)
      ? requiredRole.includes(role as UserRole)
      : role === requiredRole;

    if (!hasRole) {
      return (
        fallback || (
          <div className="flex items-center justify-center min-h-screen" dir="rtl">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                גישה נדחתה
              </h1>
              <p className="text-gray-600">
                אין לך הרשאה לגשת לעמוד זה
              </p>
            </div>
          </div>
        )
      );
    }
  }

  return <>{children}</>;
};
