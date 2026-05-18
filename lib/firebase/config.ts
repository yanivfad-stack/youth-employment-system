'use client';

// ============================================================================
// BUILD-TIME SAFE FIREBASE CONFIG
// ============================================================================
// This file is carefully designed to NEVER import Firebase modules at build time
// Firebase is only initialized when getAuthInstance/getDbInstance are called
// from client-side code in the browser, never during Next.js build/prerendering
// ============================================================================

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

// Cached instances
let cachedApp: any = null;
let cachedAuth: any = null;
let cachedDb: any = null;
let cachedStorage: any = null;

// Check if Firebase config is valid (not placeholder values or test mode)
const isValidConfig = (): boolean => {
  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  if (testMode) {
    return false;
  }

  return !!(
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes('your_firebase') &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes('your_firebase')
  );
};

// CRITICAL: Only initialize Firebase if we're running in browser
// Never import Firebase during build time
const isBrowserEnvironment = (): boolean => {
  try {
    return typeof window !== 'undefined';
  } catch {
    return false;
  }
};

const initializeFirebase = (): { app: any; auth: any; db: any; storage: any } => {
  // Only attempt initialization once
  if (initializationAttempted) {
    return { app: cachedApp, auth: cachedAuth, db: cachedDb, storage: cachedStorage };
  }

  initializationAttempted = true;

  // CRITICAL: Do not import Firebase unless in browser
  if (!isBrowserEnvironment()) {
    console.warn('[Firebase] Build-time environment detected. Firebase will not initialize during build.');
    return { app: null, auth: null, db: null, storage: null };
  }

  // Skip if invalid config (test mode or missing keys)
  if (!isValidConfig()) {
    console.warn('[Firebase] Not configured. Application will use test mode.');
    return { app: null, auth: null, db: null, storage: null };
  }

  try {
    // ONLY import Firebase after we've confirmed we're in a browser
    // eslint-disable-next-line global-require
    const { initializeApp, getApps } = require('firebase/app');
    // eslint-disable-next-line global-require
    const { getAuth } = require('firebase/auth');
    // eslint-disable-next-line global-require
    const { getFirestore } = require('firebase/firestore');
    // eslint-disable-next-line global-require
    const { getStorage } = require('firebase/storage');

    cachedApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    cachedAuth = getAuth(cachedApp);
    cachedDb = getFirestore(cachedApp);
    cachedStorage = getStorage(cachedApp);
    firebaseInitialized = true;

    console.log('[Firebase] Successfully initialized in browser');
  } catch (error) {
    console.warn('[Firebase] Failed to initialize:', error);
  }

  return { app: cachedApp, auth: cachedAuth, db: cachedDb, storage: cachedStorage };
};

// Lazy getter functions - only initialize when first called from browser
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
