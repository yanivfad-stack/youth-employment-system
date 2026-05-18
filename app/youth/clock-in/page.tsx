'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Clock, Pause, Play } from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string;
  clockInTime: string;
  clockOutTime: string | null;
  duration: string;
  notes: string;
  status: 'in_progress' | 'completed' | 'pending_approval';
}

export default function ClockInPage() {
  const { user } = useAuth();
  const [isClocked, setIsClocked] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [currentSessionDuration, setCurrentSessionDuration] = useState('00:00:00');
  const [notes, setNotes] = useState('');
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      date: '2026-05-16',
      clockInTime: '08:30',
      clockOutTime: '16:45',
      duration: '8 שעות 15 דקות',
      notes: 'עבודה בתא הרכיבה',
      status: 'completed',
    },
    {
      id: '2',
      date: '2026-05-15',
      clockInTime: '09:00',
      clockOutTime: '17:00',
      duration: '8 שעות',
      notes: 'הדרכה חדשה במערכת',
      status: 'completed',
    },
  ]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClocked && clockInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const clockIn = new Date(clockInTime);
        const diff = now.getTime() - clockIn.getTime();

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        setCurrentSessionDuration(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClocked, clockInTime]);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now.toISOString());
    setIsClocked(true);
    setNotes('');
  };

  const handleClockOut = () => {
    if (clockInTime) {
      const newEntry: TimeEntry = {
        id: String(recentEntries.length + 1),
        date: new Date().toISOString().split('T')[0],
        clockInTime: new Date(clockInTime).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        clockOutTime: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        duration: currentSessionDuration,
        notes: notes || 'עבודה רגילה',
        status: 'pending_approval',
      };

      setRecentEntries([newEntry, ...recentEntries]);
      setIsClocked(false);
      setClockInTime(null);
      setCurrentSessionDuration('00:00:00');
      setNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⏰ דיווח שעות עבודה</h1>
          <p className="text-slate-400">
            היום: {new Date().toLocaleDateString('he-IL', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Clock In/Out Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-6xl font-bold text-white font-mono">{currentSessionDuration}</div>

            {isClocked && clockInTime && (
              <div className="text-center">
                <p className="text-slate-300 mb-2">התחברת בשעה:</p>
                <p className="text-2xl text-green-400 font-bold">
                  {new Date(clockInTime).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}

            <div className="w-full space-y-4">
              {!isClocked ? (
                <button
                  onClick={handleClockIn}
                  className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:to-green-800 text-white font-bold text-lg transition-all hover:shadow-lg hover:shadow-green-600/30 flex items-center justify-center gap-2"
                >
                  <Play size={24} />
                  התחברות לעבודה
                </button>
              ) : (
                <button
                  onClick={handleClockOut}
                  className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:to-red-800 text-white font-bold text-lg transition-all hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  <Pause size={24} />
                  התנתקות מעבודה
                </button>
              )}
            </div>

            {isClocked && (
              <div className="w-full mt-4">
                <label className="block text-slate-300 text-sm mb-2">הערות על העבודה:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="הוסף הערות על המשימות שביצעת..."
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
            <p className="text-blue-300 text-sm mb-2">סה״כ שעות השבוע</p>
            <p className="text-3xl font-bold text-white">18.5</p>
            <p className="text-xs text-slate-400 mt-2">מתוך 20 שעות</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
            <p className="text-green-300 text-sm mb-2">דיווחים בהמתנה</p>
            <p className="text-3xl font-bold text-white">3</p>
            <p className="text-xs text-slate-400 mt-2">ממתינים לאישור</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/30 rounded-lg p-6">
            <p className="text-yellow-300 text-sm mb-2">דיווחים אושרו</p>
            <p className="text-3xl font-bold text-white">8</p>
            <p className="text-xs text-slate-400 mt-2">אושרו בחודש זה</p>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock size={24} />
              הדיווחים האחרונים שלי
            </h2>
          </div>

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
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-3 text-sm text-slate-300">{entry.date}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{entry.clockInTime}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{entry.clockOutTime}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{entry.duration}</td>
                    <td className="px-6 py-3 text-sm text-slate-300">{entry.notes}</td>
                    <td className="px-6 py-3 text-sm">
                      {entry.status === 'completed' ? (
                        <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                          ✓ אושר
                        </span>
                      ) : entry.status === 'pending_approval' ? (
                        <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                          בהמתנה
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                          בתהליך
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
