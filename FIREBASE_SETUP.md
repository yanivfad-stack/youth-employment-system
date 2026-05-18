# Firebase Setup Guide

This document provides step-by-step instructions for configuring Firebase for the Youth Employment Management System.

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com/)
- Google Cloud project associated with Firebase

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "Youth Employment System")
4. Accept terms and click "Create project"
5. Wait for the project to be created

## Step 2: Register Web App

1. In Firebase Console, click "Create app" or the web icon `</>`
2. Register app with a nickname (e.g., "Youth Employment Web App")
3. Copy the Firebase configuration object with these credentials:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Step 3: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Firebase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## Step 4: Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Google** and enable it
3. Add email address for support (if needed)
4. Save configuration

## Step 5: Configure Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select location (recommended: closest to your users)
4. Click **Create database**

### Create Users Collection

The application automatically creates user documents when users sign in, but you can pre-configure the collection:

1. In Firestore, click **Start collection**
2. Collection ID: `users`
3. Add a test document with these fields:
   ```json
   {
     "id": "user_uid",
     "email": "user@example.com",
     "name": "User Name",
     "role": "youth_worker",
     "profileImageUrl": null,
     "phoneNumber": null,
     "createdAt": "2024-05-17T00:00:00.000Z",
     "updatedAt": "2024-05-17T00:00:00.000Z"
   }
   ```

### Firestore Security Rules

For development, use these permissive rules (replace with stricter rules for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Other collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Configure Firebase Storage

1. Go to **Storage** → **Get started**
2. Choose location and click **Done**
3. Update security rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.token.role == 'admin';
    }
  }
}
```

## Step 7: OAuth Consent Screen Setup

For production:

1. Go to **Google Cloud Console** → **OAuth consent screen**
2. Configure as "External" application
3. Add required scopes:
   - `email`
   - `profile`
   - `openid`
4. Add test users or make app available to all users

## Step 8: Verify Setup

Start the development server and test authentication:

```bash
npm run dev
```

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click "Sign in with Google"
3. Complete the Google authentication flow
4. Verify that:
   - User is logged in
   - User document is created in Firestore
   - User role is displayed correctly

## Authentication Flow

### User Sign In

```typescript
import { useAuthActions } from '@/hooks/useAuthActions';

const { signIn } = useAuthActions();
await signIn(); // Triggers Google login popup
```

### Access User Data

```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, role, isAdmin, isCoordinator, isYouthWorker } = useAuth();
```

### Protect Routes

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## Firestore Collection Schema

### Users Collection

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'youth_worker';
  profileImageUrl?: string;
  phoneNumber?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Documents Collection (to be created)

```typescript
interface Document {
  id: string;
  userId: string;
  documentType: 'id_document' | 'salary_slip' | 'medical_certificate' | 'bank_certificate' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: Timestamp;
  expiryDate?: Timestamp;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  rejectionReason?: string;
  notes?: string;
  updatedAt: Timestamp;
}
```

### AttendanceLogs Collection (to be created)

```typescript
interface AttendanceLog {
  id: string;
  userId: string;
  jobTypeId: string;
  clockInTime: Timestamp;
  clockOutTime?: Timestamp;
  clockInLatitude: number;
  clockInLongitude: number;
  clockOutLatitude?: number;
  clockOutLongitude?: number;
  hoursWorked?: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Troubleshooting

### "Firebase configuration is invalid"
- Verify all environment variables are set correctly
- Check that `.env.local` is in the project root
- Restart the development server after updating `.env.local`

### "Google Sign-in not working"
- Verify Google is enabled in Firebase Authentication
- Check that the Firebase domain is added to authorized domains
- Clear browser cache and cookies
- Check browser console for specific error messages

### "User not found in Firestore"
- The user document is created automatically on first sign-in
- Check that Firestore database is created and accessible
- Verify Firestore security rules allow writing user documents

### "Permission denied" errors
- Review Firestore security rules
- Ensure your user UID matches the document ID
- Check that user is authenticated (check `useAuth()` hook)

## Next Steps

1. Create additional Firestore collections for:
   - `documents` - for document management
   - `attendanceLogs` - for GPS-verified attendance
   - `jobTypes` - for available job types
   - `salaryRecords` - for salary tracking

2. Implement role-based access control in Firestore rules

3. Add custom claims for enhanced authorization

4. Set up Firestore indexes for efficient queries

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)
