// CRITICAL: Do NOT import from 'firebase/auth' at module level
// This would trigger Firebase initialization at build time
// All Firebase imports must be inside functions that are called at runtime

import { getAuthInstance } from './config';
import { setUserInFirestore, getUserFromFirestore } from './firestore';
import type { User } from '@/types';

// Type declaration for FirebaseUser (to avoid importing Firebase at module level)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FirebaseUser = any;

// Lazy initialization of Google Provider (only in browser)
let cachedGoogleProvider: any = null;

const getGoogleProvider = () => {
  if (!cachedGoogleProvider) {
    // eslint-disable-next-line global-require
    const { GoogleAuthProvider } = require('firebase/auth');
    cachedGoogleProvider = new GoogleAuthProvider();
    cachedGoogleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  }
  return cachedGoogleProvider;
};

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  // Import only when called
  // eslint-disable-next-line global-require
  const { signInWithPopup } = require('firebase/auth');

  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
  }
  try {
    const googleProvider = getGoogleProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create or update user in Firestore
    await setUserInFirestore({
      id: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      profileImageUrl: user.photoURL || undefined,
      role: 'youth_worker', // Default role, can be changed by admin
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const logOut = async (): Promise<void> => {
  // Import only when called
  // eslint-disable-next-line global-require
  const { signOut } = require('firebase/auth');

  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

export const getCurrentUser = (): FirebaseUser | null => {
  const auth = getAuthInstance();
  if (!auth) return null;
  return auth.currentUser;
};

export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  // Import only when called
  // eslint-disable-next-line global-require
  const { onAuthStateChanged } = require('firebase/auth');

  const auth = getAuthInstance();
  if (!auth) {
    // Return a no-op unsubscribe function if auth is not available
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const getAuthUserWithRole = async (
  firebaseUser: FirebaseUser
): Promise<User | null> => {
  if (!firebaseUser) return null;
  return await getUserFromFirestore(firebaseUser.uid);
};
