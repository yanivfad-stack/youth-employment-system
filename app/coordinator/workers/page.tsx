'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Users, Plus, Edit2, Trash2, Eye, Filter } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  totalHours: number;
  pendingReports: number;
  approvalRate: number;
}

export default function WorkersPage() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'on_leave'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: '1',
      name: 'משה כהן',
      email: 'moshe.cohen@company.com',
      phone: '050-1111111',
      status: 'active',
      joinDate: '2025-09-01',
      totalHours: 156.5,
      pendingReports: 2,
      approvalRate: 95,
    },
    {
      id: '2',
      name: 'רחל לוי',
      email: 'rachel.levy@company.com',
      phone: '050-2222222',
      status: 'active',
      joinDate: '2025-10-15',
      totalHours: 142.0,
      pendingReports: 0,
      approvalRate: 100,
    },
    {
      id: '3',
      name: 'יוסי ברק',
      email: 'yossi.barak@company.com',
      phone: '050-3333333',
      status: 'active',
      joinDate: '2025-08-20',
      totalHours: 178.5,
      pendingReports: 3,
      approvalRate: 92,
    },
    {
      id: '4',
      name: 'ירדן מור',
      email: 'jordan.mor@company.com',
      phone: '050-4444444',
      status: 'on_leave',
      joinDate: '2025-11-01',
      totalHours: 45.0,
      pendingReports: 0,
      approvalRate: 100,
    },
    {
      id: '5',
      name: 'עדי שלום',
      email: 'adi.shalom@company.com',
      phone: '050-5555555',
      status: 'inactive',
      joinDate: '2025-09-15',
      totalHours: 98.0,
      pendingReports: 0,
      approvalRate: 88,
    },
  ]);

  const filteredWorkers = workers
    .filter((w) => (filterStatus === 'all' ? true : w.status === filterStatus))
    .filter((w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300';
      case 'inactive':
        return 'bg-red-500/20 text-red-300';
      case 'on_leave':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '✓ פעיל';
      case 'inactive':
        return '✗ לא פעיל';
      case 'on_leave':
        return '⏸ בחופשה';
      default:
        return 'לא ידוע';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">👥 ניהול עובדים</h1>
            <p className="text-slate-400">ניהול ועקובה אחר צוות העובדים שלך</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            הוסף עובד חדש
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
            <p className="text-blue-300 text-sm mb-2">סה״כ עובדים</p>
            <p className="text-3xl font-bold text-white">{workers.length}</p>
            <p className="text-xs text-slate-400 mt-2">בניהול שלך</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
            <p className="text-green-300 text-sm mb-2">עובדים פעילים</p>
            <p className="text-3xl font-bold text-white">{workers.filter((w) => w.status === 'active').length}</p>
            <p className="text-xs text-slate-400 mt-2">עובדים פעילים כעת</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/30 rounded-lg p-6">
            <p className="text-yellow-300 text-sm mb-2">דיווחים בהמתנה</p>
            <p className="text-3xl font-bold text-white">
              {workers.reduce((sum, w) => sum + w.pendingReports, 0)}
            </p>
            <p className="text-xs text-slate-400 mt-2">ממתינים לאישור</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/30 rounded-lg p-6">
            <p className="text-purple-300 text-sm mb-2">סה״כ שעות</p>
            <p className="text-3xl font-bold text-white">{workers.reduce((sum, w) => sum + w.totalHours, 0).toFixed(1)}</p>
            <p className="text-xs text-slate-400 mt-2">שעות עבודה</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4 flex-col md:flex-row">
          <input
            type="text"
            placeholder="חיפוש לפי שם או דוא״ל..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 flex-wrap">
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
            <button
              onClick={() => setFilterStatus('on_leave')}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                filterStatus === 'on_leave'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              בחופשה
            </button>
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
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">סטטוס</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">שעות עבודה</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">דיווחים בהמתנה</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">שיעור אישור</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-3 text-sm text-white font-medium">{worker.name}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{worker.email}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{worker.phone}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(worker.status)}`}>
                          {getStatusLabel(worker.status)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-300">{worker.totalHours} שעות</td>
                      <td className="px-6 py-3 text-sm">
                        {worker.pendingReports > 0 ? (
                          <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                            {worker.pendingReports}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${worker.approvalRate}%` }}
                            />
                          </div>
                          <span className="text-slate-300 text-xs">{worker.approvalRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedWorker(worker)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="צפייה"
                          >
                            <Eye size={18} />
                          </button>
                          <button className="text-yellow-400 hover:text-yellow-300 transition-colors" title="עריכה">
                            <Edit2 size={18} />
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors" title="מחיקה">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-slate-400">
                      לא נמצאו עובדים עם הקריטריון שבחרת
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Worker Details Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6">פרטי עובד</h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">שם</p>
                  <p className="text-white font-semibold">{selectedWorker.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">סטטוס</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedWorker.status)}`}>
                    {getStatusLabel(selectedWorker.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">דוא״ל</p>
                  <p className="text-white font-semibold">{selectedWorker.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">טלפון</p>
                  <p className="text-white font-semibold">{selectedWorker.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <p className="text-slate-400 text-sm mb-1">סה״כ שעות</p>
                  <p className="text-white font-semibold">{selectedWorker.totalHours}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">דיווחים בהמתנה</p>
                  <p className="text-white font-semibold">{selectedWorker.pendingReports}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">שיעור אישור</p>
                  <p className="text-white font-semibold">{selectedWorker.approvalRate}%</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors font-medium"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
