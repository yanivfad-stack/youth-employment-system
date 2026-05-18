/**
 * Test authentication utilities for development
 * Allows testing different user roles without Firebase auth
 */

export interface TestUserData {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'youth_worker';
  profileImageUrl?: string;
  phoneNumber?: string;
}

const TEST_USERS: Record<string, TestUserData> = {
  admin: {
    id: 'admin_test_001',
    email: 'admin@test.com',
    name: 'מנהל בדיקה',
    role: 'admin',
    profileImageUrl: undefined,
  },
  coordinator: {
    id: 'coordinator_test_001',
    email: 'coordinator@test.com',
    name: 'מתאם בדיקה',
    role: 'coordinator',
    profileImageUrl: undefined,
  },
  worker1: {
    id: 'youth_worker_test_001',
    email: 'yanivfad@gmail.com',
    name: 'יניב פד',
    role: 'youth_worker',
    profileImageUrl: undefined,
  },
  worker2: {
    id: 'youth_worker_test_002',
    email: 'worker2@test.com',
    name: 'עובד צעיר 2',
    role: 'youth_worker',
    profileImageUrl: undefined,
  },
};

const TEST_USER_STORAGE_KEY = '__test_user_mock__';
const TEST_MODE_STORAGE_KEY = '__test_mode_enabled__';

export const getTestUsers = (): TestUserData[] => {
  return Object.values(TEST_USERS);
};

export const setTestUser = (userKey: string): TestUserData | null => {
  const user = TEST_USERS[userKey];
  if (!user) return null;

  if (typeof window !== 'undefined') {
    localStorage.setItem(TEST_USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TEST_MODE_STORAGE_KEY, 'true');
  }

  return user;
};

export const getTestUser = (): TestUserData | null => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(TEST_USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearTestUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TEST_USER_STORAGE_KEY);
    localStorage.removeItem(TEST_MODE_STORAGE_KEY);
  }
};

export const isTestModeEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TEST_MODE_STORAGE_KEY) === 'true';
};
