'use client';

import { useCallback } from 'react';
import {
  signInWithGoogle,
  logOut,
} from '@/lib/firebase/auth';

interface UseAuthActionsReturn {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Custom hook for authentication actions (sign in, sign out)
 * Provides methods to handle user authentication flows
 *
 * @example
 * const { signIn, signOut } = useAuthActions();
 * <button onClick={signIn}>Sign in with Google</button>
 * <button onClick={signOut}>Sign out</button>
 */
export const useAuthActions = (): UseAuthActionsReturn => {
  const signIn = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }, []);

  return {
    signIn,
    signOut,
  };
};
