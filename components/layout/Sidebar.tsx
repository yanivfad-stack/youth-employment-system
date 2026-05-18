'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { clearTestUser } from '@/lib/firebase/test-auth';

export const Sidebar: React.FC = () => {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    clearTestUser();
    router.push('/');
    router.refresh();
  };

  if (loading || !user || !role) {
    return null;
  }

  // דפים לפי תפקיד
  const navigationItems = {
    youth_worker: [
      { label: 'דוח שעות עבודה', href: '/youth/clock-in', icon: '⏰' },
      { label: 'היסטוריה דיווחים', href: '/youth/history', icon: '📊' },
      { label: 'הפרופיל שלי', href: '/youth/profile', icon: '👤' },
    ],
    coordinator: [
      { label: 'ניהול עובדים', href: '/coordinator/workers', icon: '👥' },
      { label: 'אישור דיווחים', href: '/coordinator/approvals', icon: '✅' },
      { label: 'דוחות', href: '/coordinator/reports', icon: '📈' },
    ],
    admin: [
      { label: 'ניהול משתמשים', href: '/admin/workers', icon: '👨‍💼' },
      { label: 'דוחות מתקדמים', href: '/admin/reports', icon: '📊' },
      { label: 'הגדרות המערכת', href: '/admin/settings', icon: '⚙️' },
    ],
  };

  const items = navigationItems[role as keyof typeof navigationItems] || [];

  const roleLabels = {
    admin: 'מנהל',
    coordinator: 'מתאם',
    youth_worker: 'עובד צעיר',
  };

  const roleColors = {
    admin: 'bg-red-600',
    coordinator: 'bg-blue-600',
    youth_worker: 'bg-green-600',
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-700 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 right-0 h-screen w-64 bg-slate-900 text-white
          transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          flex flex-col border-l border-slate-700
        `}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400">📱 ניהול תעסוקה</h1>
          <p className="text-sm text-slate-400 mt-2">מערכת ניהול צעירים</p>
        </div>

        {/* User Info */}
        <div className="p-4 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${
                roleColors[role as keyof typeof roleColors]
              } flex items-center justify-center font-bold`}
            >
              {user.name?.charAt(0)}
            </div>
            <div className="flex-1 text-right">
              <p className="font-semibold text-sm">{user.name}</p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  role === 'admin'
                    ? 'bg-red-600/30 text-red-300'
                    : role === 'coordinator'
                    ? 'bg-blue-600/30 text-blue-300'
                    : 'bg-green-600/30 text-green-300'
                }`}
              >
                {roleLabels[role as keyof typeof roleLabels]}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="
                  block px-4 py-3 rounded-lg
                  hover:bg-slate-800 transition-colors
                  text-right text-sm font-medium
                  border-r-2 border-transparent hover:border-blue-400
                "
              >
                <span className="ml-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="
              w-full px-4 py-3 rounded-lg
              bg-red-600 hover:bg-red-700
              text-white font-medium
              flex items-center justify-center gap-2
              transition-colors
            "
          >
            <LogOut size={18} />
            התנתקות
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-700">
          <p>גרסה 1.0</p>
          <p>© 2026 כל הזכויות שמורות</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
