'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthActions } from '@/hooks/useAuthActions';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { user, role, isAuthenticated } = useAuth();
  const { signOut } = useAuthActions();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || !user) return null;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      setOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'coordinator':
        return 'bg-blue-100 text-blue-800';
      case 'youth_worker':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'מנהל';
      case 'coordinator':
        return 'מתאם';
      case 'youth_worker':
        return 'עובד צעירים';
      default:
        return role?.replace('_', ' ').toUpperCase();
    }
  };

  return (
    <div className="relative" dir="rtl">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-row-reverse"
        aria-label="תפריט משתמש"
      >
        {user.profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profileImageUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <UserIcon className="w-5 h-5" />
        )}
        <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
        {open ? (
          <X className="w-4 h-4" />
        ) : (
          <Menu className="w-4 h-4" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden" dir="rtl">
          <div className="p-4 border-b text-right">
            <div className="flex items-center gap-3 mb-3 flex-row-reverse">
              {user.profileImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                role || ''
              )}`}
            >
              {getRoleLabel(role || '')}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 flex-row-reverse justify-end"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">{loading ? 'מתחזרות...' : 'התחזרות'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
