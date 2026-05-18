'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, MapPin, Calendar, FileText, Edit2, Save, X } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  verified: boolean;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '050-1234567',
    address: 'רחוב הפרחים 10, תל אביב',
    birthDate: '2005-03-15',
    startDate: '2025-09-01',
  });

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'תעודת זהות',
      type: 'PDF',
      uploadedAt: '2026-01-15',
      verified: true,
    },
    {
      id: '2',
      name: 'תעודת בטיחות',
      type: 'PDF',
      uploadedAt: '2026-02-20',
      verified: true,
    },
    {
      id: '3',
      name: 'אישור מעסיק קודם',
      type: 'PDF',
      uploadedAt: '2026-03-10',
      verified: true,
    },
    {
      id: '4',
      name: 'הסכם עבודה',
      type: 'PDF',
      uploadedAt: '2026-04-05',
      verified: true,
    },
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the data to your backend
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">👤 הפרופיל שלי</h1>
          <p className="text-slate-400">צפה וערוך את פרטי הפרופיל שלך</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 flex items-end gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-900 flex items-center justify-center border-4 border-white">
              <User size={48} className="text-blue-300" />
            </div>
            <div className="flex-1 text-right">
              <h2 className="text-3xl font-bold text-white mb-2">{editData.name}</h2>
              <p className="text-blue-100">עובד צעיר</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 text-sm mb-2">שם מלא</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">דוא״ל</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">טלפון</label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm mb-2">תאריך לידה</label>
                    <input
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-300 text-sm mb-2">כתובת</label>
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <X size={18} />
                    ביטול
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Save size={18} />
                    שמור שינויים
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <User className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-slate-400 text-sm">שם מלא</p>
                      <p className="text-white font-semibold">{editData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-slate-400 text-sm">דוא״ל</p>
                      <p className="text-white font-semibold">{editData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-slate-400 text-sm">טלפון</p>
                      <p className="text-white font-semibold">{editData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-slate-400 text-sm">כתובת</p>
                      <p className="text-white font-semibold">{editData.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-slate-400 text-sm">תאריך לידה</p>
                      <p className="text-white font-semibold">
                        {formatDate(editData.birthDate)} ({calculateAge(editData.birthDate)} שנים)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-slate-400 text-sm">תאריך התחלה</p>
                      <p className="text-white font-semibold">{formatDate(editData.startDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-700">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    ערוך פרופיל
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText size={24} />
            מסמכים
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-blue-600/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{doc.name}</p>
                      <p className="text-slate-400 text-sm">{doc.type}</p>
                    </div>
                  </div>
                  {doc.verified && (
                    <span className="inline-block px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold">
                      ✓ מאומת
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs mb-3">הועלה: {doc.uploadedAt}</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1 bg-slate-600 text-white hover:bg-slate-500 transition-colors rounded text-sm font-medium">
                    הורדה
                  </button>
                  <button className="flex-1 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded text-sm font-medium">
                    צפייה
                  </button>
                </div>
              </div>
            ))}

            {/* Upload New */}
            <div className="bg-slate-700/30 border-2 border-dashed border-slate-600 rounded-lg p-4 flex items-center justify-center hover:border-blue-500 hover:bg-slate-700/50 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="text-3xl mb-2">📄</div>
                <p className="text-slate-300 text-sm font-medium">הוסף מסמך חדש</p>
                <p className="text-slate-500 text-xs">גרור או לחץ להעלאה</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
