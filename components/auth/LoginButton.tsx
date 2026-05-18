'use client';

import React, { useState } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { LogIn, Loader } from 'lucide-react';

export const LoginButton: React.FC = () => {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'כישלון בהתחברות'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <button
        onClick={handleLogin}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            מתחבר...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            התחבר עם Google
          </>
        )}
      </button>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
