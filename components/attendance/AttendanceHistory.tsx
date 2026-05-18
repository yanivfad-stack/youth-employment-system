'use client';

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getUserAttendanceLogs } from '@/lib/firebase/firestore';
import type { AttendanceLog } from '@/types';

export const AttendanceHistory: React.FC = () => {
  const { userId } = useAuth();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const attendanceLogs = await getUserAttendanceLogs(userId, days);
        setLogs(attendanceLogs.sort((a, b) =>
          new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime()
        ));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load attendance history');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userId, days]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('he-IL', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTotalHours = () => {
    return logs
      .reduce((total, log) => total + (log.hoursWorked || 0), 0)
      .toFixed(2);
  };

  const getStatusColor = (status: string, approvalStatus?: string) => {
    if (approvalStatus === 'manual-pending-approval') {
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    }
    if (status === 'completed') {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    }
    if (status === 'in_progress') {
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
    return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
  };

  const getStatusText = (status: string, approvalStatus?: string) => {
    if (approvalStatus === 'manual-pending-approval') {
      return 'בהמתנה לאישור';
    }
    if (status === 'completed') {
      return 'הושלם';
    }
    if (status === 'in_progress') {
      return 'בתהליך';
    }
    return 'בוטל';
  };

  const getStatusTextColor = (status: string, approvalStatus?: string) => {
    if (approvalStatus === 'manual-pending-approval') {
      return 'text-yellow-700 dark:text-yellow-300';
    }
    if (status === 'completed') {
      return 'text-green-700 dark:text-green-300';
    }
    if (status === 'in_progress') {
      return 'text-blue-700 dark:text-blue-300';
    }
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-right">
          היסטוריית נוכחות
        </h2>

        {/* Stats */}
        {!loading && logs.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">סה״כ שעות</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getTotalHours()}h
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">רשומות</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {logs.length}
              </p>
            </div>
          </div>
        )}

        {/* Time Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-row-reverse">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-colors ${
                days === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {d} ימים אחרונים
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">טוען היסטוריה...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && logs.length === 0 && !error && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">לא נמצאו רשומות נוכחות</p>
        </div>
      )}

      {/* Logs List */}
      {!loading && logs.length > 0 && (
        <div className="space-y-3">
          {logs.map((log) => {
            const approvalStatus = (log as any)?.metadata?.approvalStatus;
            const isManual = (log as any)?.metadata?.isManualEntry;

            return (
              <div
                key={log.id}
                className={`border rounded-lg p-4 ${getStatusColor(log.status, approvalStatus)}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 flex-row-reverse text-right">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(log.clockInTime)}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusTextColor(
                        log.status,
                        approvalStatus
                      )}`}
                    >
                      {getStatusText(log.status, approvalStatus)}
                    </span>
                    {isManual && (
                      <span className="inline-block mr-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300">
                        הזנה ידנית
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatTime(log.clockInTime)}
                    </p>
                    {log.clockOutTime && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        עד {formatTime(log.clockOutTime)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm text-right">
                  {/* Hours Worked */}
                  {log.hoursWorked && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">שעות</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {log.hoursWorked.toFixed(2)}h
                      </p>
                    </div>
                  )}

                  {/* Location */}
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1 flex-row-reverse justify-end">
                      <MapPin className="w-3 h-3" /> מיקום
                    </p>
                    <p className="font-mono text-xs text-gray-900 dark:text-white">
                      {log.clockInLatitude.toFixed(4)}, {log.clockInLongitude.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {log.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400">הערות</p>
                    <p className="text-sm text-gray-900 dark:text-white">{log.notes}</p>
                  </div>
                )}

                {/* Rejection Reason */}
                {approvalStatus === 'rejected' && (
                  <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800 text-right">
                    <p className="text-xs text-red-600 dark:text-red-400">סיבת דחייה</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {(log as any)?.metadata?.rejectionReason || 'לא צוין'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
