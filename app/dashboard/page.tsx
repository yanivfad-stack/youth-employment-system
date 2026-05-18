'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, role } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'בוקר טוב';
    if (hour < 18) return 'אחר הצהריים טובים';
    return 'ערב טוב';
  };

  const getRoleContent = () => {
    switch (role) {
      case 'youth_worker':
        return (
          <div className="space-y-6" dir="rtl">
            <h2 className="text-2xl font-bold text-white">דיווח שעות עבודה</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
                <p className="text-green-300 text-sm mb-2">שעות השבוע</p>
                <p className="text-3xl font-bold text-white">18.5</p>
                <p className="text-xs text-slate-400 mt-2">מתוך 20 שעות</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
                <p className="text-blue-300 text-sm mb-2">ממוצע שעות יומי</p>
                <p className="text-3xl font-bold text-white">4.6</p>
                <p className="text-xs text-slate-400 mt-2">שעות ביום</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/30 rounded-lg p-6">
                <p className="text-purple-300 text-sm mb-2">דיווחים חודשיים</p>
                <p className="text-3xl font-bold text-white">8</p>
                <p className="text-xs text-slate-400 mt-2">דיווחים שאושרו</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/youth/clock-in"
                className="bg-gradient-to-br from-green-600 to-green-700 hover:to-green-800 text-white rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-green-600/30"
              >
                <div className="text-3xl mb-2">⏰</div>
                <h3 className="text-lg font-bold mb-2">דיווח שעות עבודה</h3>
                <p className="text-sm text-green-100">דווח על שעות העבודה שלך</p>
              </Link>

              <Link
                href="/youth/history"
                className="bg-gradient-to-br from-blue-600 to-blue-700 hover:to-blue-800 text-white rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-blue-600/30"
              >
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-lg font-bold mb-2">היסטוריית דיווחים</h3>
                <p className="text-sm text-blue-100">צפה בכל הדיווחים שלך</p>
              </Link>
            </div>
          </div>
        );

      case 'coordinator':
        return (
          <div className="space-y-6" dir="rtl">
            <h2 className="text-2xl font-bold text-white">ניהול צוות</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
                <p className="text-blue-300 text-sm mb-2">עובדים פעילים</p>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-xs text-slate-400 mt-2">בניהול שלך</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-600/30 rounded-lg p-6">
                <p className="text-yellow-300 text-sm mb-2">דיווחים בהמתנה</p>
                <p className="text-3xl font-bold text-white">5</p>
                <p className="text-xs text-slate-400 mt-2">בחמתנה לאישור</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
                <p className="text-green-300 text-sm mb-2">שעות בשבוע</p>
                <p className="text-3xl font-bold text-white">246</p>
                <p className="text-xs text-slate-400 mt-2">שעות מדווחות</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/coordinator/workers"
                className="bg-gradient-to-br from-blue-600 to-blue-700 hover:to-blue-800 text-white rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-blue-600/30"
              >
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-lg font-bold mb-2">ניהול עובדים</h3>
                <p className="text-sm text-blue-100">ערוך ונהל את רשימת העובדים</p>
              </Link>

              <Link
                href="/coordinator/approvals"
                className="bg-gradient-to-br from-yellow-600 to-yellow-700 hover:to-yellow-800 text-white rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-yellow-600/30"
              >
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-lg font-bold mb-2">אישור דיווחים</h3>
                <p className="text-sm text-yellow-100">אשר דיווחי שעות</p>
              </Link>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-6" dir="rtl">
            <h2 className="text-2xl font-bold text-white">ממשק מנהל</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/30 rounded-lg p-6">
                <p className="text-red-300 text-sm mb-2">סה״כ עובדים</p>
                <p className="text-3xl font-bold text-white">48</p>
                <p className="text-xs text-slate-400 mt-2">בכל המערכת</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 rounded-lg p-6">
                <p className="text-blue-300 text-sm mb-2">מתאמים</p>
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-xs text-slate-400 mt-2">מנהלי צוות</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-600/30 rounded-lg p-6">
                <p className="text-green-300 text-sm mb-2">שעות חודש</p>
                <p className="text-3xl font-bold text-white">2,156</p>
                <p className="text-xs text-slate-400 mt-2">שעות עבודה</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-600/30 rounded-lg p-6">
                <p className="text-purple-300 text-sm mb-2">עומס מערכת</p>
                <p className="text-3xl font-bold text-white">87%</p>
                <p className="text-xs text-slate-400 mt-2">שימוש במשאבים</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/workers"
                className="bg-gradient-to-br from-red-600 to-red-700 hover:to-red-800 text-white rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-red-600/30"
              >
                <div className="text-3xl mb-2">👨‍💼</div>
                <h3 className="text-lg font-bold mb-2">ניהול משתמשים</h3>
                <p className="text-sm text-red-100">ניהול כל המשתמשים במערכת</p>
              </Link>

              <Link
                href="/admin/reports"
                className="bg-gradient-to-br from-green-600 to-green-700 hover:to-green-800 text-white rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-green-600/30"
              >
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-lg font-bold mb-2">דוחות מתקדמים</h3>
                <p className="text-sm text-green-100">צפה בדוחות מפורטים</p>
              </Link>

              <Link
                href="/admin/settings"
                className="bg-gradient-to-br from-purple-600 to-purple-700 hover:to-purple-800 text-white rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-purple-600/30"
              >
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="text-lg font-bold mb-2">הגדרות המערכת</h3>
                <p className="text-sm text-purple-100">קביעת הפעלה בסיסית</p>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {getWelcomeMessage()}, {user?.name}! 👋
          </h1>
          <p className="text-slate-400">
            {new Date().toLocaleDateString('he-IL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Role-specific content */}
        {getRoleContent()}
      </div>
    </div>
  );
}
