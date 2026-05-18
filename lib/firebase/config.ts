'use client';

// Lazy imports - only loaded when Firebase is actually needed
let firebaseInitialized = false;
let initializationAttempted = false;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is valid (not placeholder values or test mode)
const isValidConfig = () => {
  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  if (testMode) return false;

  return !!(
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes('your_firebase') &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes('your_firebase')
  );
};

// Cached instances
let cachedApp: any = null;
let cachedAuth: any = null;
let cachedDb: any = null;
let cachedStorage: any = null;

const initializeFirebase = () => {
  // Only attempt initialization once
  if (initializationAttempted) {
    return { app: cachedApp, auth: cachedAuth, db: cachedDb, storage: cachedStorage };
  }

  initializationAttempted = true;

  // Skip if invalid config (test mode or missing keys)
  if (!isValidConfig()) {
    console.warn('Firebase not configured. Application will use test mode.');
    return { app: null, auth: null, db: null, storage: null };
  }

  try {
    // Lazy load Firebase modules only when needed
    const { initializeApp, getApps } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');
    const { getStorage } = require('firebase/storage');

    cachedApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    cachedAuth = getAuth(cachedApp);
    cachedDb = getFirestore(cachedApp);
    cachedStorage = getStorage(cachedApp);
    firebaseInitialized = true;
  } catch (error) {
    console.warn('Failed to initialize Firebase:', error);
  }

  return { app: cachedApp, auth: cachedAuth, db: cachedDb, storage: cachedStorage };
};

// Lazy getter functions - only initialize when first called
export const getAuthInstance = (): any => {
  const { auth } = initializeFirebase();
  return auth;
};

export const getDbInstance = (): any => {
  const { db } = initializeFirebase();
  return db;
};

export const getStorageInstance = (): any => {
  const { storage } = initializeFirebase();
  return storage;
};

export const getAppInstance = (): any => {
  const { app } = initializeFirebase();
  return app;
};

// Backward compatibility - these are now lazy getters
export const auth = null;
export const db = null;
export const storage = null;
export const app = null;

export default app;
