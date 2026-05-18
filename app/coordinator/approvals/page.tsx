'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface ApprovalRequest {
  id: string;
  workerName: string;
  date: string;
  clockInTime: string;
  clockOutTime: string;
  duration: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<'pending' | 'all'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: '1',
      workerName: 'משה כהן',
      date: '2026-05-16',
      clockInTime: '08:30',
      clockOutTime: '16:45',
      duration: '8 שעות 15 דקות',
      notes: 'עבודה בתא הרכיבה - הרכבת 5 ערכות',
      status: 'pending',
      submittedAt: '2026-05-16 17:00',
    },
    {
      id: '2',
      workerName: 'רחל לוי',
      date: '2026-05-15',
      clockInTime: '09:00',
      clockOutTime: '17:00',
      duration: '8 שעות',
      notes: 'הדרכה חדשה במערכת - למדתי פעולות בטיחות',
      status: 'pending',
      submittedAt: '2026-05-15 17:30',
    },
    {
      id: '3',
      workerName: 'יוסי ברק',
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
      workerName: 'משה כהן',
      date: '2026-05-13',
      clockInTime: '07:30',
      clockOutTime: '15:00',
      duration: '7 שעות 30 דקות',
      notes: 'עבודה במחסן - ספירת מלאי',
      status: 'approved',
      submittedAt: '2026-05-13 15:30',
    },
    {
      id: '5',
      workerName: 'רחל לוי',
      date: '2026-05-12',
      clockInTime: '09:00',
      clockOutTime: '17:00',
      duration: '8 שעות',
      notes: 'עבודה רגילה בתחזוקה',
      status: 'approved',
      submittedAt: '2026-05-12 17:30',
    },
    {
      id: '6',
      workerName: 'יוסי ברק',
      clockInTime: '08:15',
      clockOutTime: '14:45',
      duration: '6 שעות 30 דקות',
      date: '2026-05-11',
      notes: 'עבודה חלקית - התנגדות מעבור',
      status: 'rejected',
      submittedAt: '2026-05-11 15:00',
    },
  ]);

  const filteredRequests =
    filterStatus === 'all'
      ? requests
      : requests.filter((req) => req.status === filterStatus);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: 'approved' as const } : req
      )
    );
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: 'rejected' as const } : req
      )
    );
    setSelectedRequest(null);
    setShowRejectionModal(false);
    setRejectionReason('');
  };

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">✅ אישור דיווחים</h1>
          <p className="text-slate-400">בדוק ואשר דיווחי שעות של עובדים</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/30 rounded-lg p-6">
            <p className="text-yellow-300 text-sm mb-2">דיווחים בהמתנה</p>
            <p className="text-3xl font-bold text-white">{pendingCount}</p>
            <p className="text-xs text-slate-400 mt-2">ממתינים לאישור</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
            <p className="text-green-300 text-sm mb-2">אושרו</p>
            <p className="text-3xl font-bold text-white">{requests.filter((r) => r.status === 'approved').length}</p>
            <p className="text-xs text-slate-400 mt-2">דיווחים מאושרים</p>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/30 rounded-lg p-6">
            <p className="text-red-300 text-sm mb-2">דחויים</p>
            <p className="text-3xl font-bold text-white">{requests.filter((r) => r.status === 'rejected').length}</p>
            <p className="text-xs text-slate-400 mt-2">דיווחים שנדחו</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
            <p className="text-blue-300 text-sm mb-2">סה״כ דיווחים</p>
            <p className="text-3xl font-bold text-white">{requests.length}</p>
            <p className="text-xs text-slate-400 mt-2">דיווחים כוללים</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Clock className="inline-block ml-2" size={16} />
            בהמתנה בלבד
          </button>
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
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300">שם עובד</th>
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
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-3 text-sm text-white font-medium">{request.workerName}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{request.date}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{request.clockInTime}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{request.clockOutTime}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{request.duration}</td>
                      <td className="px-6 py-3 text-sm text-slate-300 max-w-xs truncate">{request.notes}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {request.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-400 hover:text-green-300 transition-colors"
                              title="אישור"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRejectionModal(true);
                              }}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="דחייה"
                            >
                              <XCircle size={18} />
                            </button>
                            <button
                              onClick={() => setSelectedRequest(request)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="צפייה"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="צפייה"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-slate-400">
                      אין דיווחים בהמתנה לאישור
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && !showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6">פרטי דיווח</h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">שם עובד</p>
                  <p className="text-white font-semibold">{selectedRequest.workerName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">סטטוס</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusLabel(selectedRequest.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">תאריך</p>
                  <p className="text-white font-semibold">{selectedRequest.date}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">זמן הגשה</p>
                  <p className="text-white font-semibold">{selectedRequest.submittedAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">התחברות</p>
                  <p className="text-white font-semibold">{selectedRequest.clockInTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">התנתקות</p>
                  <p className="text-white font-semibold">{selectedRequest.clockOutTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">משך</p>
                  <p className="text-white font-semibold">{selectedRequest.duration}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">הערות</p>
                <p className="text-white">{selectedRequest.notes}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors font-medium"
              >
                סגור
              </button>
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowRejectionModal(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <XCircle size={18} />
                    דחה
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    אשר
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-xl w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6">דחה דיווח</h2>
            <p className="text-slate-300 mb-4">
              האם אתה בטוח שברצונך לדחות את הדיווח של {selectedRequest.workerName}?
            </p>

            <div className="mb-6">
              <label className="block text-slate-300 text-sm mb-2">סיבת הדחייה (אופציונלי):</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="הסבר למה דוחה את הדיווח..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors font-medium"
              >
                ביטול
              </button>
              <button
                onClick={() => handleReject(selectedRequest.id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <XCircle size={18} />
                דחה דיווח
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
