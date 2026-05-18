'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, Download, PieChart, TrendingUp } from 'lucide-react';

interface SystemStats {
  totalHours: number;
  totalReports: number;
  approvalRate: number;
  activeUsers: number;
  totalUsers: number;
}

interface CoordinatorStats {
  name: string;
  team: number;
  hours: number;
  pendingReports: number;
  approvalRate: number;
}

export default function AdminReportsPage() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('system');

  const systemStats: SystemStats = {
    totalHours: 3428.5,
    totalReports: 278,
    approvalRate: 94.2,
    activeUsers: 28,
    totalUsers: 35,
  };

  const coordinatorStats: CoordinatorStats[] = [
    {
      name: 'שרה לוי',
      team: 12,
      hours: 866,
      pendingReports: 5,
      approvalRate: 95,
    },
    {
      name: 'יוסי ברק',
      team: 15,
      hours: 1024,
      pendingReports: 8,
      approvalRate: 92,
    },
    {
      name: 'דוד כהן',
      team: 10,
      hours: 684,
      pendingReports: 3,
      approvalRate: 97,
    },
    {
      name: 'מרים גולדברג',
      team: 8,
      hours: 855,
      pendingReports: 2,
      approvalRate: 94,
    },
  ];

  const monthlySystemData = [
    { month: 'ינואר', hours: 650, reports: 52, users: 22 },
    { month: 'פברואר', hours: 720, reports: 58, users: 24 },
    { month: 'מרץ', hours: 780, reports: 63, users: 26 },
    { month: 'אפריל', hours: 720, reports: 58, users: 27 },
    { month: 'מאי', hours: 858, reports: 69, users: 28 },
  ];

  const maxHours = Math.max(...monthlySystemData.map((d) => d.hours));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📊 דוחות מתקדמים</h1>
          <p className="text-slate-400">צפה בדוחות מפורטים על מערכת כוללה</p>
        </div>

        {/* Report Type Selector */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setReportType('system')}
            className={`px-6 py-3 rounded-lg transition-colors font-medium ${
              reportType === 'system'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <BarChart3 className="inline-block ml-2" size={18} />
            דוח מערכת
          </button>
          <button
            onClick={() => setReportType('coordinators')}
            className={`px-6 py-3 rounded-lg transition-colors font-medium ${
              reportType === 'coordinators'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <TrendingUp className="inline-block ml-2" size={18} />
            דוח מתאמים
          </button>
        </div>

        {reportType === 'system' && (
          <>
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
                <p className="text-blue-300 text-sm mb-2">סה״כ שעות עבודה</p>
                <p className="text-3xl font-bold text-white">{systemStats.totalHours.toFixed(1)}</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
                <p className="text-green-300 text-sm mb-2">סה״כ דיווחים</p>
                <p className="text-3xl font-bold text-white">{systemStats.totalReports}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/30 rounded-lg p-6">
                <p className="text-purple-300 text-sm mb-2">שיעור אישור</p>
                <p className="text-3xl font-bold text-white">{systemStats.approvalRate}%</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/30 rounded-lg p-6">
                <p className="text-yellow-300 text-sm mb-2">משתמשים פעילים</p>
                <p className="text-3xl font-bold text-white">{systemStats.activeUsers}</p>
              </div>

              <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/30 rounded-lg p-6">
                <p className="text-red-300 text-sm mb-2">סה״כ משתמשים</p>
                <p className="text-3xl font-bold text-white">{systemStats.totalUsers}</p>
              </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 size={24} />
                טרנד חודשי
              </h2>

              <div className="space-y-4">
                {monthlySystemData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">{data.month}</span>
                      <div className="text-right text-sm text-slate-300">
                        <span className="text-white font-bold">{data.hours}</span> שעות •
                        <span className="text-white font-bold ml-2">{data.reports}</span> דיווחים •
                        <span className="text-white font-bold ml-2">{data.users}</span> משתמשים
                      </div>
                    </div>
                    <div className="flex gap-2 h-8">
                      <div className="flex-1 bg-slate-700 rounded-lg overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                          style={{ width: `${(data.hours / maxHours) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export */}
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <Download size={20} />
                הורדת דוח PDF
              </button>
              <button className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                <Download size={20} />
                הורדת Excel
              </button>
            </div>
          </>
        )}

        {reportType === 'coordinators' && (
          <>
            {/* Coordinators Table */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">דוח מתאמים</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-700/50">
                      <th className="px-6 py-3 text-sm font-semibold text-slate-300">שם מתאם</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-300">גודל צוות</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-300">סה״כ שעות</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-300">דיווחים בהמתנה</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-300">שיעור אישור</th>
                      <th className="px-6 py-3 text-sm font-semibold text-slate-300">ביצועים</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coordinatorStats.map((coordinator, index) => (
                      <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-3 text-sm text-white font-medium">{coordinator.name}</td>
                        <td className="px-6 py-3 text-sm text-slate-300">{coordinator.team}</td>
                        <td className="px-6 py-3 text-sm text-slate-300">{coordinator.hours}</td>
                        <td className="px-6 py-3 text-sm">
                          {coordinator.pendingReports > 0 ? (
                            <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                              {coordinator.pendingReports}
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${coordinator.approvalRate}%` }}
                              />
                            </div>
                            <span className="text-slate-300 text-xs">{coordinator.approvalRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {coordinator.approvalRate >= 95 ? (
                            <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                              ⭐ מעולה
                            </span>
                          ) : coordinator.approvalRate >= 90 ? (
                            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                              ✓ טוב
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                              ⚠ בעבודה
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export */}
            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <Download size={20} />
                הורדת דוח PDF
              </button>
              <button className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                <Download size={20} />
                הורדת Excel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
