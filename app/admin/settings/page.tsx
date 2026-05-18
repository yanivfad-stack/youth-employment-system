'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saveMessage, setSaveMessage] = useState<'success' | 'error' | null>(null);

  const [settings, setSettings] = useState({
    general: {
      systemName: 'מערכת ניהול תעסוקת צעירים',
      systemEmail: 'info@youth-employment.org',
      timezone: 'UTC+2',
      language: 'he',
    },
    working: {
      defaultWorkingHoursPerDay: '8',
      defaultWorkingDaysPerWeek: '5',
      minimumBreakMinutes: '30',
      overtimeMultiplier: '1.5',
      maxWorkingHoursPerDay: '12',
    },
    security: {
      passwordMinLength: '8',
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: true,
      sessionTimeoutMinutes: '30',
      enableTwoFactor: false,
    },
    notifications: {
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      notifyOnPendingApproval: true,
      notifyOnReportSubmission: true,
      dailyReportEmail: true,
    },
    backup: {
      autoBackupEnabled: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retentionDays: '90',
    },
  });

  const handleChange = (tab: string, field: string, value: any) => {
    setSettings({
      ...settings,
      [tab]: {
        ...settings[tab as keyof typeof settings],
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    // Simulate save
    setSaveMessage('success');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚙️ הגדרות המערכת</h1>
          <p className="text-slate-400">ערוך הגדרות מערכת וקביעות הפעלה</p>
        </div>

        {/* Alert */}
        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              saveMessage === 'success'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            {saveMessage === 'success' ? (
              <CheckCircle2 className="text-green-400" size={20} />
            ) : (
              <AlertCircle className="text-red-400" size={20} />
            )}
            <p className={saveMessage === 'success' ? 'text-green-400' : 'text-red-400'}>
              {saveMessage === 'success'
                ? 'ההגדרות נשמרו בהצלחה'
                : 'אירעה שגיאה בשמירת ההגדרות'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <div className="p-4 space-y-2">
                {[
                  { id: 'general', label: 'הגדרות כלליות', icon: '⚙️' },
                  { id: 'working', label: 'הגדרות עבודה', icon: '⏰' },
                  { id: 'security', label: 'אבטחה', icon: '🔒' },
                  { id: 'notifications', label: 'התראות', icon: '🔔' },
                  { id: 'backup', label: 'גיבוי ושחזור', icon: '💾' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="ml-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-8">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">⚙️ הגדרות כלליות</h2>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">שם המערכת</label>
                    <input
                      type="text"
                      value={settings.general.systemName}
                      onChange={(e) => handleChange('general', 'systemName', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">דוא״ל המערכת</label>
                    <input
                      type="email"
                      value={settings.general.systemEmail}
                      onChange={(e) => handleChange('general', 'systemEmail', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">אזור זמן</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option>UTC+2</option>
                      <option>UTC+3</option>
                      <option>UTC+1</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">שפה ברירת מחדל</label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => handleChange('general', 'language', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="he">עברית</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'working' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">⏰ הגדרות עבודה</h2>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-300 text-sm mb-2">שעות עבודה ליום (ברירת מחדל)</label>
                      <input
                        type="number"
                        value={settings.working.defaultWorkingHoursPerDay}
                        onChange={(e) => handleChange('working', 'defaultWorkingHoursPerDay', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm mb-2">ימי עבודה בשבוע</label>
                      <input
                        type="number"
                        value={settings.working.defaultWorkingDaysPerWeek}
                        onChange={(e) => handleChange('working', 'defaultWorkingDaysPerWeek', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm mb-2">הפסקה מינימלית (דקות)</label>
                      <input
                        type="number"
                        value={settings.working.minimumBreakMinutes}
                        onChange={(e) => handleChange('working', 'minimumBreakMinutes', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm mb-2">מכפיל שעות נוספות</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.working.overtimeMultiplier}
                        onChange={(e) => handleChange('working', 'overtimeMultiplier', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm mb-2">שעות עבודה מקסימליות ביום</label>
                      <input
                        type="number"
                        value={settings.working.maxWorkingHoursPerDay}
                        onChange={(e) => handleChange('working', 'maxWorkingHoursPerDay', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">🔒 הגדרות אבטחה</h2>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">אורך סיסמה מינימלי</label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleChange('security', 'passwordMinLength', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordRequireNumbers}
                        onChange={(e) => handleChange('security', 'passwordRequireNumbers', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">דרוש מספרים בסיסמה</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordRequireSpecialChars}
                        onChange={(e) => handleChange('security', 'passwordRequireSpecialChars', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">דרוש תווים מיוחדים בסיסמה</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">זמן קצה הפעלה (דקות)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeoutMinutes}
                      onChange={(e) => handleChange('security', 'sessionTimeoutMinutes', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.enableTwoFactor}
                        onChange={(e) => handleChange('security', 'enableTwoFactor', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">הפעל אימות דו-שלבי</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">🔔 הגדרות התראות</h2>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enableEmailNotifications}
                        onChange={(e) => handleChange('notifications', 'enableEmailNotifications', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">הפעל התראות דוא״ל</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enableSMSNotifications}
                        onChange={(e) => handleChange('notifications', 'enableSMSNotifications', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">הפעל התראות SMS</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.notifyOnPendingApproval}
                        onChange={(e) => handleChange('notifications', 'notifyOnPendingApproval', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">הודע על דיווחים בהמתנה</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.notifyOnReportSubmission}
                        onChange={(e) => handleChange('notifications', 'notifyOnReportSubmission', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">הודע על הגשת דיווחים</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.dailyReportEmail}
                        onChange={(e) => handleChange('notifications', 'dailyReportEmail', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">שלח דוח דוא״ל יומי</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">💾 גיבוי וחזור על</h2>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={settings.backup.autoBackupEnabled}
                        onChange={(e) => handleChange('backup', 'autoBackupEnabled', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300">אפשר גיבוי אוטומטי</span>
                    </label>
                  </div>

                  {settings.backup.autoBackupEnabled && (
                    <>
                      <div>
                        <label className="block text-slate-300 text-sm mb-2">תדירות גיבוי</label>
                        <select
                          value={settings.backup.backupFrequency}
                          onChange={(e) => handleChange('backup', 'backupFrequency', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="daily">יומי</option>
                          <option value="weekly">שבועי</option>
                          <option value="monthly">חודשי</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 text-sm mb-2">זמן גיבוי</label>
                        <input
                          type="time"
                          value={settings.backup.backupTime}
                          onChange={(e) => handleChange('backup', 'backupTime', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 text-sm mb-2">ימי שמירה</label>
                        <input
                          type="number"
                          value={settings.backup.retentionDays}
                          onChange={(e) => handleChange('backup', 'retentionDays', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Save size={20} />
                  שמור הגדרות
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
