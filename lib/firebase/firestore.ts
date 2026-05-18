import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { getDbInstance } from './config';
import type { User, YouthWorker, AttendanceLog } from '@/types';

const USERS_COLLECTION = 'users';

/**
 * Get user from Firestore by ID
 */
export const getUserFromFirestore = async (userId: string): Promise<User | null> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return null;
  }
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Set user in Firestore (create or update)
 */
export const setUserInFirestore = async (user: User): Promise<void> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return;
  }
  try {
    const userRef = doc(db, USERS_COLLECTION, user.id);
    const existingUser = await getDoc(userRef);

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profileImageUrl: user.profileImageUrl || null,
      phoneNumber: user.phoneNumber || null,
      updatedAt: Timestamp.now(),
    };

    if (!existingUser.exists()) {
      // New user - add createdAt
      await setDoc(userRef, {
        ...userData,
        createdAt: Timestamp.now(),
      });
    } else {
      // Update existing user
      await updateDoc(userRef, userData);
    }
  } catch (error) {
    console.error('Error setting user:', error);
    throw error;
  }
};

/**
 * Update user role in Firestore
 */
export const updateUserRole = async (userId: string, role: string): Promise<void> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return;
  }
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      role,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Create or update youth worker profile
 */
export const setYouthWorkerProfile = async (
  youthWorker: YouthWorker
): Promise<void> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return;
  }
  try {
    const userRef = doc(db, USERS_COLLECTION, youthWorker.id);

    const youthWorkerData = {
      id: youthWorker.id,
      email: youthWorker.email,
      name: youthWorker.name,
      role: 'youth_worker' as const,
      profileImageUrl: youthWorker.profileImageUrl || null,
      phoneNumber: youthWorker.phoneNumber || null,
      dateOfBirth: youthWorker.dateOfBirth,
      israeliId: youthWorker.israeliId,
      bankAccountNumber: youthWorker.bankAccountNumber || null,
      bankBranchCode: youthWorker.bankBranchCode || null,
      bankAccountHolderName: youthWorker.bankAccountHolderName || null,
      emergencyContact: youthWorker.emergencyContact || null,
      updatedAt: Timestamp.now(),
    };

    const existingUser = await getDoc(userRef);
    if (!existingUser.exists()) {
      await setDoc(userRef, {
        ...youthWorkerData,
        createdAt: Timestamp.now(),
      });
    } else {
      await updateDoc(userRef, youthWorkerData);
    }
  } catch (error) {
    console.error('Error setting youth worker profile:', error);
    throw error;
  }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: string): Promise<User[]> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return [];
  }
  try {
    const q = query(collection(db, USERS_COLLECTION), where('role', '==', role));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as User;
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};

/**
 * Get all users with pagination
 */
export const getAllUsers = async (
  limit: number = 50,
  offset: number = 0
): Promise<User[]> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return [];
  }
  try {
    const q = query(collection(db, USERS_COLLECTION));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs
      .slice(offset, offset + limit)
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User;
      });
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Attendance logging functions
const ATTENDANCE_COLLECTION = 'attendanceLogs';

/**
 * Create a new attendance log (clock in)
 */
export const createAttendanceLog = async (
  userId: string,
  jobTypeId: string,
  latitude: number,
  longitude: number,
  accuracy: number,
  isManual: boolean = false,
  notes?: string
): Promise<string> => {
  const db = getDbInstance();
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  try {
    const attendanceRef = collection(db, ATTENDANCE_COLLECTION);
    const newLog: Omit<AttendanceLog, 'id'> = {
      userId,
      jobTypeId,
      clockInTime: new Date(),
      clockInLatitude: latitude,
      clockInLongitude: longitude,
      status: 'in_progress',
      notes: notes || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add accuracy info as metadata
      ...(accuracy && {
        metadata: {
          clockInAccuracy: accuracy,
          isManualEntry: isManual,
          approvalStatus: isManual ? 'manual-pending-approval' : 'auto-approved',
        },
      }),
    };

    const docRef = await addDoc(attendanceRef, {
      ...newLog,
      clockInTime: Timestamp.fromDate(newLog.clockInTime),
      createdAt: Timestamp.fromDate(newLog.createdAt),
      updatedAt: Timestamp.fromDate(newLog.updatedAt),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating attendance log:', error);
    throw error;
  }
};

/**
 * Clock out and update attendance log
 */
export const clockOutAttendanceLog = async (
  attendanceId: string,
  latitude: number,
  longitude: number,
  accuracy: number
): Promise<void> => {
  const db = getDbInstance();
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  try {
    const logRef = doc(db, ATTENDANCE_COLLECTION, attendanceId);
    const logDoc = await getDoc(logRef);

    if (!logDoc.exists()) {
      throw new Error('Attendance log not found');
    }

    const clockInTime = logDoc.data().clockInTime?.toDate() || new Date();
    const clockOutTime = new Date();
    const hoursWorked =
      (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

    await updateDoc(logRef, {
      clockOutTime: Timestamp.fromDate(clockOutTime),
      clockOutLatitude: latitude,
      clockOutLongitude: longitude,
      hoursWorked: Math.round(hoursWorked * 100) / 100, // Round to 2 decimals
      status: 'completed',
      updatedAt: Timestamp.now(),
      ...(accuracy && {
        metadata: {
          clockOutAccuracy: accuracy,
        },
      }),
    });
  } catch (error) {
    console.error('Error clocking out:', error);
    throw error;
  }
};

/**
 * Get current active attendance log for user
 */
export const getActiveAttendanceLog = async (
  userId: string
): Promise<AttendanceLog | null> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return null;
  }
  try {
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('userId', '==', userId),
      where('status', '==', 'in_progress')
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      clockInTime: data.clockInTime?.toDate() || new Date(),
      clockOutTime: data.clockOutTime?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as AttendanceLog;
  } catch (error) {
    console.error('Error fetching active attendance log:', error);
    throw error;
  }
};

/**
 * Get attendance logs for user with optional date filter
 */
export const getUserAttendanceLogs = async (
  userId: string,
  days: number = 7
): Promise<AttendanceLog[]> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return [];
  }
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('userId', '==', userId),
      where('clockInTime', '>=', Timestamp.fromDate(startDate))
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        clockInTime: data.clockInTime?.toDate() || new Date(),
        clockOutTime: data.clockOutTime?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as AttendanceLog;
    });
  } catch (error) {
    console.error('Error fetching user attendance logs:', error);
    throw error;
  }
};

/**
 * Get manual attendance logs pending approval
 */
export const getPendingManualAttendanceLogs = async (): Promise<AttendanceLog[]> => {
  const db = getDbInstance();
  if (!db) {
    console.warn('Firestore is not initialized. Using test mode or configure Firebase.');
    return [];
  }
  try {
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('metadata.approvalStatus', '==', 'manual-pending-approval')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        clockInTime: data.clockInTime?.toDate() || new Date(),
        clockOutTime: data.clockOutTime?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as AttendanceLog;
    });
  } catch (error) {
    console.error('Error fetching pending manual logs:', error);
    throw error;
  }
};

/**
 * Approve or reject manual attendance log
 */
export const approveManualAttendanceLog = async (
  attendanceId: string,
  approved: boolean,
  rejectionReason?: string
): Promise<void> => {
  const db = getDbInstance();
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  try {
    const logRef = doc(db, ATTENDANCE_COLLECTION, attendanceId);

    await updateDoc(logRef, {
      'metadata.approvalStatus': approved ? 'approved' : 'rejected',
      'metadata.rejectionReason': rejectionReason || null,
      'metadata.approvedAt': Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error approving attendance log:', error);
    throw error;
  }
};
