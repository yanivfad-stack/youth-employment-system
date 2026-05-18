import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { getAuthInstance } from './config';
import { setUserInFirestore, getUserFromFirestore } from './firestore';
import type { User } from '@/types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Firebase is not initialized. Please configure Firebase environment variables.');
  }
  try {
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
