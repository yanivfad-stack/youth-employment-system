'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Users, Plus, Edit2, Trash2, Eye, Shield, Lock } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'coordinator' | 'youth_worker';
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
}

export default function AdminWorkersPage() {
  const { user } = useAuth();
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'coordinator' | 'youth_worker'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'דוד כהן',
      email: 'david.cohen@admin.com',
      phone: '050-0000000',
      role: 'admin',
      status: 'active',
      joinDate: '2025-01-15',
      lastLogin: '2026-05-17 08:30',
    },
    {
      id: '2',
      name: 'שרה לוי',
      email: 'sarah.levy@coordinator.com',
      phone: '050-6666666',
      role: 'coordinator',
      status: 'active',
      joinDate: '2025-06-01',
      lastLogin: '2026-05-17 09:15',
    },
    {
      id: '3',
      name: 'יוסי ברק',
      email: 'yossi.barak@coordinator.com',
      phone: '050-7777777',
      role: 'coordinator',
      status: 'active',
      joinDate: '2025-07-10',
      lastLogin: '2026-05-16 16:45',
    },
    {
      id: '4',
      name: 'משה כהן',
      email: 'moshe.cohen@company.com',
      phone: '050-1111111',
      role: 'youth_worker',
      status: 'active',
      joinDate: '2025-09-01',
      lastLogin: '2026-05-17 07:30',
    },
    {
      id: '5',
      name: 'רחל לוי',
      email: 'rachel.levy@company.com',
      phone: '050-2222222',
      role: 'youth_worker',
      status: 'active',
      joinDate: '2025-10-15',
      lastLogin: '2026-05-17 08:00',
    },
    {
      id: '6',
      name: 'אלי שמעוני',
      email: 'eli.smaoni@company.com',
      phone: '050-8888888',
      role: 'youth_worker',
      status: 'inactive',
      joinDate: '2025-08-20',
      lastLogin: '2026-04-10 15:30',
    },
  ]);

  const filteredUsers = users
    .filter((u) => (filterRole === 'all' ? true : u.role === filterRole))
    .filter((u) => (filterStatus === 'all' ? true : u.status === filterStatus))
    .filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-300';
      case 'coordinator':
        return 'bg-blue-500/20 text-blue-300';
      case 'youth_worker':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'מנהל';
      case 'coordinator':
        return 'מתאם';
      case 'youth_worker':
        return 'עובד צעיר';
      default:
        return 'לא ידוע';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👨‍💼';
      case 'coordinator':
        return '👥';
      case 'youth_worker':
        return '👤';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">👨‍💼 ניהול משתמשים</h1>
            <p className="text-slate-400">ניהול כל המשתמשים במערכת</p>
          </div>
          <button className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <Plus size={20} />
            הוסף משתמש חדש
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
            <p className="text-blue-300 text-sm mb-2">סה״כ משתמשים</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/30 rounded-lg p-6">
            <p className="text-red-300 text-sm mb-2">מנהלים</p>
            <p className="text-3xl font-bold text-white">{users.filter((u) => u.role === 'admin').length}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
            <p className="text-blue-300 text-sm mb-2">מתאמים</p>
            <p className="text-3xl font-bold text-white">{users.filter((u) => u.role === 'coordinator').length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
            <p className="text-green-300 text-sm mb-2">עובדים צעירים</p>
            <p className="text-3xl font-bold text-white">{users.filter((u) => u.role === 'youth_worker').length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/30 rounded-lg p-6">
            <p className="text-purple-300 text-sm mb-2">פעילים</p>
            <p className="text-3xl font-bold text-white">{users.filter((u) => u.status === 'active').length}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="חיפוש לפי שם או דוא״ל..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  filterRole === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                כל התפקידים
              </button>
              <button
                onClick={() => setFilterRole('admin')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  filterRole === 'admin'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                מנהלים
              </button>
              <button
                onClick={() => setFilterRole('coordinator')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  filterRole === 'coordinator'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                מתאמים
              </button>
              <button
                onClick={() => setFilterRole('youth_worker')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  filterRole === 'youth_worker'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                עובדים
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                הכל
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                פעילים
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  filterStatus === 'inactive'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                לא פעילים
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">שם</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">דוא״ל</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">טלפון</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">תפקיד</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">סטטוס</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">כניסה אחרונה</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((userItem) => (
                    <tr key={userItem.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-3 text-sm text-white font-medium">{userItem.name}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{userItem.email}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{userItem.phone}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(userItem.role)}`}>
                          {getRoleIcon(userItem.role)} {getRoleLabel(userItem.role)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {userItem.status === 'active' ? (
                          <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                            ✓ פעיל
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-semibold">
                            ✗ לא פעיל
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-300">{userItem.lastLogin}</td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedUser(userItem)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="צפייה"
                          >
                            <Eye size={18} />
                          </button>
                          <button className="text-yellow-400 hover:text-yellow-300 transition-colors" title="עריכה">
                            <Edit2 size={18} />
                          </button>
                          {userItem.role !== 'admin' && (
                            <button className="text-red-400 hover:text-red-300 transition-colors" title="מחיקה">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-slate-400">
                      לא נמצאו משתמשים עם הקריטריון שבחרת
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6">פרטי משתמש</h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">שם</p>
                  <p className="text-white font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">תפקיד</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(selectedUser.role)}`}>
                    {getRoleIcon(selectedUser.role)} {getRoleLabel(selectedUser.role)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">דוא״ל</p>
                  <p className="text-white font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">טלפון</p>
                  <p className="text-white font-semibold">{selectedUser.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <p className="text-slate-400 text-sm mb-1">תאריך הצטרפות</p>
                  <p className="text-white font-semibold">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">כניסה אחרונה</p>
                  <p className="text-white font-semibold">{selectedUser.lastLogin}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">סטטוס</p>
                <p className="text-white font-semibold">
                  {selectedUser.status === 'active' ? '✓ פעיל' : '✗ לא פעיל'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors font-medium"
              >
                סגור
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <Edit2 size={18} />
                ערוך
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
