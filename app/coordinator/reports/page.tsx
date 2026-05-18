'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';

interface MonthlyData {
  month: string;
  hours: number;
  reports: number;
  approvalRate: number;
}

interface WorkerStats {
  name: string;
  hours: number;
  reports: number;
  approvalRate: number;
  lastReport: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('month');

  const monthlyData: MonthlyData[] = [
    { month: 'ינואר', hours: 180, reports: 18, approvalRate: 95 },
    { month: 'פברואר', hours: 165, reports: 17, approvalRate: 92 },
    { month: 'מרץ', hours: 190, reports: 19, approvalRate: 97 },
    { month: 'אפריל', hours: 175, reports: 18, approvalRate: 94 },
    { month: 'מאי', hours: 156, reports: 16, approvalRate: 90 },
  ];

  const workerStats: WorkerStats[] = [
    {
      name: 'משה כהן',
      hours: 156.5,
      reports: 16,
      approvalRate: 95,
      lastReport: '2026-05-16',
    },
    {
      name: 'רחל לוי',
      hours: 142.0,
      reports: 14,
      approvalRate: 100,
      lastReport: '2026-05-15',
    },
    {
      name: 'יוסי ברק',
      hours: 178.5,
      reports: 18,
      approvalRate: 92,
      lastReport: '2026-05-14',
    },
    {
      name: 'ירדן מור',
      hours: 45.0,
      reports: 5,
      approvalRate: 100,
      lastReport: '2026-05-10',
    },
    {
      name: 'עדי שלום',
      hours: 98.0,
      reports: 10,
      approvalRate: 88,
      lastReport: '2026-05-12',
    },
  ];

  const maxHours = Math.max(...monthlyData.map((d) => d.hours));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📈 דוחות וסטטיסטיקות</h1>
          <p className="text-slate-400">צפה בדוחות וסטטיסטיקות על צוות העובדים שלך</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
            <p className="text-blue-300 text-sm mb-2">סה״כ שעות</p>
            <p className="text-3xl font-bold text-white">866</p>
            <p className="text-xs text-slate-400 mt-2">בחודש זה</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
            <p className="text-green-300 text-sm mb-2">סה״כ דיווחים</p>
            <p className="text-3xl font-bold text-white">82</p>
            <p className="text-xs text-slate-400 mt-2">דיווחים מאושרים</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/30 rounded-lg p-6">
            <p className="text-yellow-300 text-sm mb-2">שיעור אישור ממוצע</p>
            <p className="text-3xl font-bold text-white">93.6%</p>
            <p className="text-xs text-slate-400 mt-2">דיווחים מאושרים</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/30 rounded-lg p-6">
            <p className="text-purple-300 text-sm mb-2">מספר עובדים</p>
            <p className="text-3xl font-bold text-white">5</p>
            <p className="text-xs text-slate-400 mt-2">עובדים פעילים</p>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 size={24} />
              דיווחים חודשיים
            </h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="month">חודש אחרון</option>
              <option value="quarter">רבעון אחרון</option>
              <option value="year">שנה אחרונה</option>
            </select>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{data.month}</span>
                  <div className="text-right space-y-1">
                    <p className="text-slate-300 text-sm">
                      <span className="text-white font-bold">{data.hours}</span> שעות
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-end">
                  <div className="flex-1 bg-slate-700 rounded-lg h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all"
                      style={{ width: `${(data.hours / maxHours) * 100}%` }}
                    />
                  </div>
                  <div className="text-right min-w-fit text-xs text-slate-400">
                    <p>{data.reports} דיווחים</p>
                    <p className="text-green-400">{data.approvalRate}% אושרו</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worker Statistics Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={24} />
              סטטיסטיקות עובדים
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">שם</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">סה״כ שעות</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">דיווחים</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">שיעור אישור</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">דיווח אחרון</th>
                </tr>
              </thead>
              <tbody>
                {workerStats.map((worker, index) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-3 text-sm text-white font-medium">{worker.name}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{worker.hours}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{worker.reports}</td>
                    <td className="px-6 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${worker.approvalRate}%` }}
                          />
                        </div>
                        <span className="text-slate-300 text-xs">{worker.approvalRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-300">{worker.lastReport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Section */}
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
      </div>
    </div>
  );
}
