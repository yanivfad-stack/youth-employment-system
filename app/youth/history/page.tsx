'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Download, Eye } from 'lucide-react';

interface WorkReport {
  id: string;
  date: string;
  clockInTime: string;
  clockOutTime: string;
  duration: string;
  notes: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);

  const workReports: WorkReport[] = [
    {
      id: '1',
      date: '2026-05-16',
      clockInTime: '08:30',
      clockOutTime: '16:45',
      duration: '8 שעות 15 דקות',
      notes: 'עבודה בתא הרכיבה - הרכבת 5 ערכות',
      status: 'approved',
      submittedAt: '2026-05-16 17:00',
      approvedBy: 'דוד כהן',
      approvedAt: '2026-05-16 17:30',
    },
    {
      id: '2',
      date: '2026-05-15',
      clockInTime: '09:00',
      clockOutTime: '17:00',
      duration: '8 שעות',
      notes: 'הדרכה חדשה במערכת - למדתי פעולות בטיחות',
      status: 'approved',
      submittedAt: '2026-05-15 17:30',
      approvedBy: 'שרה לוי',
      approvedAt: '2026-05-15 18:00',
    },
    {
      id: '3',
      date: '2026-05-14',
      clockInTime: '08:00',
      clockOutTime: '12:30',
      duration: '4 שעות 30 דקות',
      notes: 'עבודה בחלק הלוגיסטי - סידור חומרים',
      status: 'pending',
      submittedAt: '2026-05-14 13:00',
    },
    {
      id: '4',
      date: '2026-05-13',
      clockInTime: '07:30',
      clockOutTime: '15:00',
      duration: '7 שעות 30 דקות',
      notes: 'עבודה במחסן - ספירת מלאי',
      status: 'approved',
      submittedAt: '2026-05-13 15:30',
      approvedBy: 'יוסי ברק',
      approvedAt: '2026-05-13 16:00',
    },
    {
      id: '5',
      date: '2026-05-12',
      clockInTime: '09:00',
      clockOutTime: '17:00',
      duration: '8 שעות',
      notes: 'עבודה רגילה בתחזוקה',
      status: 'approved',
      submittedAt: '2026-05-12 17:30',
      approvedBy: 'דוד כהן',
      approvedAt: '2026-05-12 18:00',
    },
    {
      id: '6',
      date: '2026-05-11',
      clockInTime: '08:15',
      clockOutTime: '14:45',
      duration: '6 שעות 30 דקות',
      notes: 'עבודה חלקית - התנגדות מעבור',
      status: 'rejected',
      submittedAt: '2026-05-11 15:00',
      approvedBy: 'שרה לוי',
      approvedAt: '2026-05-11 15:30',
    },
  ];

  const filteredReports =
    filterStatus === 'all'
      ? workReports
      : workReports.filter((report) => report.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return '✓ אושר';
      case 'pending':
        return 'בהמתנה';
      case 'rejected':
        return '✗ דחוי';
      default:
        return 'לא ידוע';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📊 היסטוריית הדיווחים שלי</h1>
          <p className="text-slate-400">צפה בכל דיווחי השעות שלך</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
            <p className="text-blue-300 text-sm mb-2">סה״כ דיווחים</p>
            <p className="text-3xl font-bold text-white">{workReports.length}</p>
            <p className="text-xs text-slate-400 mt-2">דיווחים כוללים</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
            <p className="text-green-300 text-sm mb-2">אושרו</p>
            <p className="text-3xl font-bold text-white">{workReports.filter((r) => r.status === 'approved').length}</p>
            <p className="text-xs text-slate-400 mt-2">דיווחים מאושרים</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/30 rounded-lg p-6">
            <p className="text-yellow-300 text-sm mb-2">בהמתנה</p>
            <p className="text-3xl font-bold text-white">{workReports.filter((r) => r.status === 'pending').length}</p>
            <p className="text-xs text-slate-400 mt-2">ממתינים לאישור</p>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/30 rounded-lg p-6">
            <p className="text-red-300 text-sm mb-2">דחויים</p>
            <p className="text-3xl font-bold text-white">{workReports.filter((r) => r.status === 'rejected').length}</p>
            <p className="text-xs text-slate-400 mt-2">דיווחים שנדחו</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
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
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              filterStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            אושר
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            בהמתנה
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            דחוי
          </button>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">תאריך</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">התחברות</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">התנתקות</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">משך</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">הערות</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">סטטוס</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-3 text-sm text-slate-300">{report.date}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{report.clockInTime}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{report.clockOutTime}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{report.duration}</td>
                      <td className="px-6 py-3 text-sm text-slate-300 max-w-xs truncate">{report.notes}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                          {getStatusLabel(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                        >
                          <Eye size={16} />
                          צפייה
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-slate-400">
                      אין דיווחים עם הקריטריון שבחרת
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6">פרטי הדיווח</h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">תאריך</p>
                  <p className="text-white font-semibold">{selectedReport.date}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">סטטוס</p>
                  <p className={`font-semibold inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(selectedReport.status)}`}>
                    {getStatusLabel(selectedReport.status)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">התחברות</p>
                  <p className="text-white font-semibold">{selectedReport.clockInTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">התנתקות</p>
                  <p className="text-white font-semibold">{selectedReport.clockOutTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">משך</p>
                  <p className="text-white font-semibold">{selectedReport.duration}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">הערות</p>
                <p className="text-white">{selectedReport.notes}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">תאריך הגשה</p>
                <p className="text-white">{selectedReport.submittedAt}</p>
              </div>

              {selectedReport.approvedBy && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">אושר על ידי</p>
                    <p className="text-white font-semibold">{selectedReport.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">תאריך אישור</p>
                    <p className="text-white font-semibold">{selectedReport.approvedAt}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors font-medium"
              >
                סגור
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <Download size={18} />
                הורדת PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
