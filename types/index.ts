// User Roles
export type UserRole = 'admin' | 'coordinator' | 'youth_worker';

// User Entity
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Youth Worker (extends User)
export interface YouthWorker extends User {
  role: 'youth_worker';
  dateOfBirth: string; // ISO 8601 format (YYYY-MM-DD)
  israeliId: string; // Personal ID number (will be validated with Luhn)
  bankAccountNumber?: string;
  bankBranchCode?: string;
  bankAccountHolderName?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

// Document Types
export type DocumentType = 'id_document' | 'salary_slip' | 'medical_certificate' | 'bank_certificate' | 'other';
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface Document {
  id: string;
  userId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  expiryDate?: Date;
  status: DocumentStatus;
  rejectionReason?: string;
  notes?: string;
  updatedAt: Date;
}

// Job Type
export interface JobType {
  id: string;
  name: string;
  description?: string;
  hourlyRate: number; // In ILS
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Attendance Log with GPS coordinates
export interface AttendanceLog {
  id: string;
  userId: string;
  jobTypeId: string;
  clockInTime: Date;
  clockOutTime?: Date;
  clockInLatitude: number;
  clockInLongitude: number;
  clockOutLatitude?: number;
  clockOutLongitude?: number;
  hoursWorked?: number; // Calculated field
  status: 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Salary Record
export interface SalaryRecord {
  id: string;
  userId: string;
  month: string; // YYYY-MM format
  totalHours: number;
  hourlyRate: number;
  grossAmount: number; // Total salary before deductions (in ILS)
  deductions?: {
    taxAmount?: number;
    insuranceAmount?: number;
    otherDeductions?: number;
  };
  netAmount: number; // Total salary after deductions (in ILS)
  status: 'pending' | 'calculated' | 'approved' | 'paid';
  paymentDate?: Date;
  externalPayrollId?: string; // Integration with Har-Gal system
  createdAt: Date;
  updatedAt: Date;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
