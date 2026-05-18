'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange, getAuthUserWithRole } from './auth';
import { getTestUser, isTestModeEnabled } from './test-auth';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only run on client side, never on server
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      // Check for test mode first
      const testUser = getTestUser();
      if (isTestModeEnabled() && testUser) {
        setFirebaseUser(null);
        setUser({
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role,
          profileImageUrl: testUser.profileImageUrl,
          phoneNumber: testUser.phoneNumber,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setRole(testUser.role);
        setLoading(false);
        return;
      }

      const unsubscribe = onAuthStateChange(async (authUser) => {
        try {
          setFirebaseUser(authUser);

          if (authUser) {
            const userData = await getAuthUserWithRole(authUser);
            setUser(userData);
            setRole(userData?.role || null);
          } else {
            setUser(null);
            setRole(null);
          }

          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Auth error'));
          setUser(null);
          setRole(null);
        } finally {
          setLoading(false);
        }
      });

      return unsubscribe;
    } catch (err) {
      console.warn('AuthProvider initialization error:', err);
      setError(err instanceof Error ? err : new Error('Auth initialization error'));
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    firebaseUser,
    user,
    role,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
