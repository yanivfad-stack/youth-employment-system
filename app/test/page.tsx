'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setTestUser, clearTestUser, getTestUsers, getTestUser } from '@/lib/firebase/test-auth';
import { Loader } from 'lucide-react';

interface TestUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'youth_worker';
}

export default function TestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const [testUsers, setTestUsers] = useState<TestUser[]>([]);
  const [userMapping] = useState<Record<string, string>>({
    admin: 'admin',
    coordinator: 'coordinator',
    worker1: 'worker1',
    worker2: 'worker2',
  });

  useEffect(() => {
    // Load current user if in test mode
    const user = getTestUser();
    if (user) {
      setCurrentUser(user as TestUser);
    }

    // Get test users
    const users = getTestUsers();
    setTestUsers(users as TestUser[]);
  }, []);

  const handleLoginAsUser = async (user: TestUser) => {
    setLoading(true);
    setError(null);

    try {
      // Find the key for this user
      const userKey = Object.entries(userMapping).find(
        ([_, value]) => value === user.id.split('_')[0]
      )?.[0] || 'worker1';

      // Set test user
      setTestUser(userKey);
      setCurrentUser(user);

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בהתחברות');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      clearTestUser();
      setCurrentUser(null);
      setError(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בהתחזרות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            דף בדיקה - מערכת ניהול תעסוקת צעירים
          </h1>
          <p className="text-slate-300 text-lg">
            בחר משתמש לבדיקת המערכת
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        {currentUser && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8 text-right">
            <h3 className="text-green-400 font-bold mb-2">
              התחברת בהצלחה!
            </h3>
            <p className="text-green-300 mb-2">
              <strong>שם:</strong> {currentUser.name}
            </p>
            <p className="text-green-300 mb-2">
              <strong>דוא״ל:</strong> {currentUser.email}
            </p>
            <p className="text-green-300 mb-4">
              <strong>תפקיד:</strong>{' '}
              {currentUser.role === 'admin'
                ? 'מנהל'
                : currentUser.role === 'coordinator'
                ? 'מתאם'
                : 'עובד צעיר'}
            </p>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'מתחזר...' : 'התחזר'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testUsers && testUsers.length > 0 ? (
            testUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLoginAsUser(user)}
                disabled={loading}
                className="p-6 rounded-lg border-2 border-blue-500/30 bg-slate-800/50 hover:bg-slate-700/50 hover:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-right"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin text-blue-400" />
                    <span className="text-blue-300">מתחבר...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {user.role === 'admin' ? (
                          <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-semibold">
                            מנהל
                          </span>
                        ) : user.role === 'coordinator' ? (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                            מתאם
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                            עובד צעיר
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      {user.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {user.email}
                    </p>
                    <div className="text-blue-400 font-semibold">
                      התחבר →
                    </div>
                  </>
                )}
              </button>
            ))
          ) : (
            <div className="col-span-2 text-center text-slate-400">
              טוען משתמשי בדיקה...
            </div>
          )}
        </div>

        <div className="mt-12 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h2 className="text-white font-bold mb-4 text-right">
            הוראות:
          </h2>
          <ul className="text-slate-300 space-y-2 text-right">
            <li>✓ בחר משתמש מהרשימה למעלה</li>
            <li>✓ תהיה מחובר אוטומטית לאחר בחירה</li>
            <li>✓ עבור בין משתמשים שונים כדי לבדוק ממשקים שונים</li>
            <li>✓ כל משתמש בעל תפקיד והרשאות שונים</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
