'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, AlertCircle, CheckCircle, Loader, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import {
  createAttendanceLog,
  clockOutAttendanceLog,
  getActiveAttendanceLog,
} from '@/lib/firebase/firestore';
import type { AttendanceLog } from '@/types';

interface AttendanceState {
  activeLog: AttendanceLog | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const AttendanceClockInOut: React.FC = () => {
  const { user, userId } = useAuth();
  const { coordinates, error: geoError, loading: geoLoading, getCurrentPosition, clearError } = useGeolocation();

  const [state, setState] = useState<AttendanceState>({
    activeLog: null,
    loading: false,
    error: null,
    successMessage: null,
  });

  const [isManualMode, setIsManualMode] = useState(false);
  const [manualCoordinates, setManualCoordinates] = useState({
    latitude: '',
    longitude: '',
  });
  const [selectedJobTypeId, setSelectedJobTypeId] = useState('');
  const [notes, setNotes] = useState('');

  // Load active attendance log on mount
  useEffect(() => {
    const loadActiveLog = async () => {
      if (!userId) return;

      try {
        const log = await getActiveAttendanceLog(userId);
        setState((prev) => ({ ...prev, activeLog: log }));
      } catch (error) {
        console.error('Error loading active log:', error);
      }
    };

    loadActiveLog();
  }, [userId]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (state.successMessage) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, successMessage: null }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.successMessage]);

  const handleClockIn = async () => {
    if (!userId) {
      setState((prev) => ({ ...prev, error: 'המשתמש לא נמצא' }));
      return;
    }

    if (!selectedJobTypeId) {
      setState((prev) => ({ ...prev, error: 'בחר סוג עבודה' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let latitude: number;
      let longitude: number;
      let accuracy: number = 0;

      if (isManualMode) {
        // Manual entry mode
        if (!manualCoordinates.latitude || !manualCoordinates.longitude) {
          throw new Error('הזן קו רוחב וקו אורך');
        }
        latitude = parseFloat(manualCoordinates.latitude);
        longitude = parseFloat(manualCoordinates.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error('קו רוחב או קו אורך לא חוקיים');
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          throw new Error('הקואורדינטות מחוץ לטווח החוקי');
        }
      } else {
        // GPS mode
        const position = await getCurrentPosition();
        if (!position) {
          throw new Error(geoError || 'כישלון בהשגת קואורדינטות GPS');
        }
        latitude = position.latitude;
        longitude = position.longitude;
        accuracy = position.accuracy;
      }

      const logId = await createAttendanceLog(
        userId,
        selectedJobTypeId,
        latitude,
        longitude,
        accuracy,
        isManualMode,
        notes
      );

      const newLog = await getActiveAttendanceLog(userId);
      setState((prev) => ({
        ...prev,
        activeLog: newLog,
        successMessage: isManualMode
          ? 'הכניסה הידנית נרשמה. בהמתנה לאישור המתאם.'
          : 'נכנסת בהצלחה',
        error: null,
      }));

      // Reset manual mode
      setIsManualMode(false);
      setManualCoordinates({ latitude: '', longitude: '' });
      setNotes('');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'כישלון בכניסה',
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleClockOut = async () => {
    if (!state.activeLog) {
      setState((prev) => ({ ...prev, error: 'לא נמצאה כניסה פעילה' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let latitude: number;
      let longitude: number;
      let accuracy: number = 0;

      if (isManualMode) {
        if (!manualCoordinates.latitude || !manualCoordinates.longitude) {
          throw new Error('הזן קו רוחב וקו אורך');
        }
        latitude = parseFloat(manualCoordinates.latitude);
        longitude = parseFloat(manualCoordinates.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error('קו רוחב או קו אורך לא חוקיים');
        }
      } else {
        const position = await getCurrentPosition();
        if (!position) {
          throw new Error(geoError || 'כישלון בהשגת קואורדינטות GPS');
        }
        latitude = position.latitude;
        longitude = position.longitude;
        accuracy = position.accuracy;
      }

      await clockOutAttendanceLog(state.activeLog.id, latitude, longitude, accuracy);

      setState((prev) => ({
        ...prev,
        activeLog: null,
        successMessage: 'יצאת בהצלחה',
        error: null,
      }));

      setIsManualMode(false);
      setManualCoordinates({ latitude: '', longitude: '' });
      setNotes('');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'כישלון ביציאה',
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('he-IL', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          נוכחות
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.name}
        </p>
      </div>

      {/* Success Message */}
      {state.successMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300">{state.successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {(state.error || geoError) && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700 dark:text-red-300">{state.error || geoError}</p>
            {(state.error || geoError) && (
              <button
                onClick={() => {
                  setState((prev) => ({ ...prev, error: null }));
                  clearError();
                }}
                className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                סגור
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Clock-In Status */}
      {state.activeLog && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="flex items-center gap-2 flex-row-reverse">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-900 dark:text-blue-100">
                כנסת
              </span>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(state.activeLog.clockInTime)}
            </span>
          </div>

          <div className="text-sm text-blue-700 dark:text-blue-300 text-right">
            <p className="font-medium">
              כנסת בתאריך: {formatDate(state.activeLog.clockInTime)}
            </p>
            <p className="text-blue-600 dark:text-blue-400 mt-1">
              קואורדינטות: {state.activeLog.clockInLatitude.toFixed(4)},
              {' '}
              {state.activeLog.clockInLongitude.toFixed(4)}
            </p>
          </div>
        </div>
      )}

      {/* Manual/GPS Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex-row-reverse">
        <div className="flex items-center gap-2 flex-row-reverse">
          <MapPin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {isManualMode ? 'מצב הזנה ידני' : 'מיקום GPS'}
          </span>
        </div>
        <button
          onClick={() => setIsManualMode(!isManualMode)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          style={{
            backgroundColor: isManualMode ? '#3b82f6' : '#d1d5db',
          }}
        >
          <span
            className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            style={{
              transform: isManualMode ? 'translateX(22px)' : 'translateX(2px)',
            }}
          />
        </button>
      </div>

      {/* Manual Entry Form */}
      {isManualMode && (
        <div className="space-y-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-right">
          <div className="flex items-start gap-2 flex-row-reverse">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              הזנות ידניות דורשות אישור מתאם
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
                קו רוחב
              </label>
              <input
                type="number"
                step="0.0001"
                placeholder="32.0853"
                min="-90"
                max="90"
                value={manualCoordinates.latitude}
                onChange={(e) =>
                  setManualCoordinates((prev) => ({
                    ...prev,
                    latitude: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
                קו אורך
              </label>
              <input
                type="number"
                step="0.0001"
                placeholder="34.7818"
                min="-180"
                max="180"
                value={manualCoordinates.longitude}
                onChange={(e) =>
                  setManualCoordinates((prev) => ({
                    ...prev,
                    longitude: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
                הערות (אופציונאלי)
              </label>
              <textarea
                placeholder="למה אתה מזין זאת ידנית?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* GPS Status */}
      {!isManualMode && (
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-2 text-right">
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              מצב GPS
            </span>
            {geoLoading ? (
              <Loader className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            ) : coordinates ? (
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {coordinates && (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-right">
              <p>קו רוחב: {coordinates.latitude.toFixed(6)}</p>
              <p>קו אורך: {coordinates.longitude.toFixed(6)}</p>
              <p>דיוק: ±{coordinates.accuracy.toFixed(0)}m</p>
            </div>
          )}
        </div>
      )}

      {/* Job Type Selection */}
      {!state.activeLog && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
            סוג עבודה
          </label>
          <select
            value={selectedJobTypeId}
            onChange={(e) => setSelectedJobTypeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
          >
            <option value="">בחר סוג עבודה...</option>
            <option value="job-type-1">עבודה סטנדרטית (לשעה)</option>
            <option value="job-type-2">עבודה מומחה (לשעה)</option>
            <option value="job-type-3">מפקח (לשעה)</option>
          </select>
        </div>
      )}

      {/* Action Buttons */}
      {!state.activeLog ? (
        <button
          onClick={handleClockIn}
          disabled={state.loading || geoLoading}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 flex-row-reverse"
        >
          {state.loading || geoLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              מושך מיקום...
            </>
          ) : (
            <>
              <Clock className="w-5 h-5" />
              כניסה
            </>
          )}
        </button>
      ) : (
        <button
          onClick={handleClockOut}
          disabled={state.loading || geoLoading}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 flex-row-reverse"
        >
          {state.loading || geoLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              מושך מיקום...
            </>
          ) : (
            <>
              <Clock className="w-5 h-5" />
              יציאה
            </>
          )}
        </button>
      )}
    </div>
  );
};
