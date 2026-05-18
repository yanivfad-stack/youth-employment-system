'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoginButton } from '@/components/auth/LoginButton';
import { UserMenu } from '@/components/auth/UserMenu';
import { Loader } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user, role, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800" dir="rtl">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">טוען...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-800" dir="rtl">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            מערכת ניהול תעסוקת צעירים
          </h1>
          {isAuthenticated && <UserMenu />}
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            ברוכים הבאים למערכת ניהול תעסוקת צעירים
          </h2>

          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="text-right">
                    <p className="text-slate-400 text-sm mb-1">שם</p>
                    <p className="text-lg font-semibold text-white">
                      {user?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm mb-1">דוא״ל</p>
                    <p className="text-lg font-semibold text-white">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-slate-400 text-sm mb-2">תפקיד</p>
                  <div>
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white">
                      {role === 'admin' ? 'מנהל' : role === 'coordinator' ? 'מתאם' : role === 'youth_worker' ? 'עובד צעירים' : 'משתמש'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-6 text-right">
                <h3 className="text-lg font-semibold text-white mb-3">
                  ✓ שילוב Firebase הושלם
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm text-right">
                  <li>✓ אימות Google מופעל</li>
                  <li>✓ ניהול הפעלה של המשתמש פעיל</li>
                  <li>✓ נתוני משתמש ב-Firestore הוחזרו</li>
                  <li>✓ בקרת גישה מבוססת תפקיד מוכנה</li>
                  <li>✓ ספקי Context אותחלו</li>
                </ul>
              </div>

              <p className="text-slate-400 text-right">
                התחברת בהצלחה! השתמש בקו ה-{' '}
                <code className="bg-slate-700 px-2 py-1 rounded text-blue-300">
                  useAuth
                </code>
                {' '}כדי לגשת לנתוני משתמש ומידע על תפקידים ברחבי האפליקציה שלך.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-lg text-slate-300 mb-8">
                התחבר כדי להתחיל ניהול תעסוקת צעירים
              </p>

              <LoginButton />

              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mt-8 text-right">
                <h3 className="text-lg font-semibold text-white mb-4">
                  תכונות המערכת:
                </h3>
                <ul className="space-y-3 text-slate-300 text-sm">
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>אימות Google Login</span>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>בקרת גישה מבוססת תפקיד (מנהל, מתאם, עובד צעירים)</span>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>ניהול הפעלה של המשתמש עם Firebase</span>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>שילוב מסד נתונים Firestore</span>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>העלאה וניהול מסמכים</span>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>ניטור הנוכחות שאומת ב-GPS</span>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>ניהול משכורות ושילוב תוכנת משכורות</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
