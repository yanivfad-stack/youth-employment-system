# Authentication API Reference

Complete documentation for authentication hooks, components, and utilities.

## Table of Contents

- [Hooks](#hooks)
- [Components](#components)
- [Utilities](#utilities)
- [Context](#context)
- [Examples](#examples)

## Hooks

### `useAuth()`

Main hook for accessing authentication state and user information.

**Returns:**

```typescript
interface UseAuthReturn {
  user: User | null;              // Full user object from Firestore
  userId: string | null;          // Firebase user UID
  role: UserRole | null;          // User role: 'admin' | 'coordinator' | 'youth_worker'
  email: string | null;           // User email
  name: string | null;            // User name
  loading: boolean;               // Loading state
  error: Error | null;            // Error object if any
  isAuthenticated: boolean;       // Whether user is logged in
  isAdmin: boolean;               // Convenience flag
  isCoordinator: boolean;         // Convenience flag
  isYouthWorker: boolean;         // Convenience flag
  hasRole(role: UserRole | UserRole[]): boolean;  // Check if user has role(s)
}
```

**Usage:**

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, role, isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <div>Please sign in</div>;
  if (isAdmin) return <AdminPanel />;
  
  return <YouthWorkerDashboard user={user} />;
}
```

**Checking Multiple Roles:**

```typescript
const { hasRole } = useAuth();

if (hasRole(['admin', 'coordinator'])) {
  return <ManagementPanel />;
}
```

### `useAuthActions()`

Hook for authentication actions (sign in, sign out).

**Returns:**

```typescript
interface UseAuthActionsReturn {
  signIn: () => Promise<void>;   // Sign in with Google
  signOut: () => Promise<void>;  // Sign out user
}
```

**Usage:**

```typescript
'use client';

import { useAuthActions } from '@/hooks/useAuthActions';

export function AuthButtons() {
  const { signIn, signOut } = useAuthActions();

  return (
    <>
      <button onClick={signIn}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
}
```

## Components

### `LoginButton`

Pre-built login button with Google Sign-In.

**Props:** None

**Features:**
- Loading state with spinner
- Error display
- Accessible button with Lucide icon

**Usage:**

```typescript
import { LoginButton } from '@/components/auth/LoginButton';

export function LoginPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <LoginButton />
    </div>
  );
}
```

### `UserMenu`

User menu with profile info and logout button.

**Props:** None

**Features:**
- Shows user name, email, and profile picture
- Role badge with color coding
- Dropdown menu
- Logout functionality

**Usage:**

```typescript
import { UserMenu } from '@/components/auth/UserMenu';

export function Header() {
  return (
    <header>
      <h1>App Title</h1>
      <UserMenu />
    </header>
  );
}
```

### `ProtectedRoute`

Component to protect routes based on authentication and role.

**Props:**

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];  // Optional role requirement
  fallback?: React.ReactNode;             // Custom fallback UI
}
```

**Usage:**

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Protect entire route
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Require specific role
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// Require multiple roles
<ProtectedRoute requiredRole={['admin', 'coordinator']}>
  <ManagementPanel />
</ProtectedRoute>

// Custom fallback
<ProtectedRoute 
  requiredRole="admin"
  fallback={<AccessDenied />}
>
  <AdminPanel />
</ProtectedRoute>
```

## Utilities

### Firebase Auth Functions

Located in `lib/firebase/auth.ts`

#### `signInWithGoogle()`

Signs in user with Google and creates/updates Firestore user document.

```typescript
import { signInWithGoogle } from '@/lib/firebase/auth';

const firebaseUser = await signInWithGoogle();
```

#### `logOut()`

Signs out the current user.

```typescript
import { logOut } from '@/lib/firebase/auth';

await logOut();
```

#### `getCurrentUser()`

Gets the current Firebase user (without role data).

```typescript
import { getCurrentUser } from '@/lib/firebase/auth';

const firebaseUser = getCurrentUser();
if (firebaseUser) {
  console.log(firebaseUser.uid, firebaseUser.email);
}
```

#### `onAuthStateChange(callback)`

Listens to auth state changes. Returns unsubscribe function.

```typescript
import { onAuthStateChange } from '@/lib/firebase/auth';

const unsubscribe = onAuthStateChange((firebaseUser) => {
  if (firebaseUser) {
    console.log('User signed in:', firebaseUser.email);
  } else {
    console.log('User signed out');
  }
});

// Clean up when component unmounts
return () => unsubscribe();
```

#### `getAuthUserWithRole(firebaseUser)`

Gets user data from Firestore with role information.

```typescript
import { getAuthUserWithRole } from '@/lib/firebase/auth';
import { getCurrentUser } from '@/lib/firebase/auth';

const firebaseUser = getCurrentUser();
if (firebaseUser) {
  const userData = await getAuthUserWithRole(firebaseUser);
  console.log(userData.role);
}
```

### Firestore Functions

Located in `lib/firebase/firestore.ts`

#### `getUserFromFirestore(userId)`

Get user data from Firestore by ID.

```typescript
import { getUserFromFirestore } from '@/lib/firebase/firestore';

const user = await getUserFromFirestore('user-id');
```

#### `setUserInFirestore(user)`

Create or update user in Firestore.

```typescript
import { setUserInFirestore } from '@/lib/firebase/firestore';

await setUserInFirestore({
  id: 'user-id',
  email: 'user@example.com',
  name: 'User Name',
  role: 'youth_worker',
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

#### `updateUserRole(userId, role)`

Update user role in Firestore.

```typescript
import { updateUserRole } from '@/lib/firebase/firestore';

await updateUserRole('user-id', 'coordinator');
```

#### `setYouthWorkerProfile(youthWorker)`

Create or update youth worker profile with extended data.

```typescript
import { setYouthWorkerProfile } from '@/lib/firebase/firestore';

await setYouthWorkerProfile({
  id: 'user-id',
  email: 'youth@example.com',
  name: 'Youth Name',
  role: 'youth_worker',
  dateOfBirth: '2008-05-17',
  israeliId: '123456789',
  bankAccountNumber: '1234567890',
  bankBranchCode: '12',
  bankAccountHolderName: 'Youth Name',
  emergencyContact: {
    name: 'Parent Name',
    phoneNumber: '0501234567',
    relationship: 'Parent',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

#### `getUsersByRole(role)`

Get all users with a specific role.

```typescript
import { getUsersByRole } from '@/lib/firebase/firestore';

const admins = await getUsersByRole('admin');
```

#### `getAllUsers(limit, offset)`

Get all users with pagination.

```typescript
import { getAllUsers } from '@/lib/firebase/firestore';

const users = await getAllUsers(50, 0); // Get first 50 users
```

## Context

### `AuthProvider`

Provider component that wraps your app with authentication context.

**Usage:**

```typescript
// Already included in app/layout.tsx
import { AuthProvider } from '@/lib/firebase/context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### `useAuthContext()`

Direct context hook (usually use `useAuth()` instead).

```typescript
import { useAuthContext } from '@/lib/firebase/context';

const { firebaseUser, user, role, loading, error, isAuthenticated } = useAuthContext();
```

## Examples

### Complete Login Page

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoginButton } from '@/components/auth/LoginButton';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <div>Already signed in!</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Sign In</h1>
      <LoginButton />
    </div>
  );
}
```

### Protected Admin Dashboard

```typescript
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

function AdminDashboardContent() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      {/* Admin content */}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
```

### Role-Based Component Rendering

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export function Dashboard() {
  const { role, isAdmin, isCoordinator, isYouthWorker } = useAuth();

  if (isAdmin) return <AdminDashboard />;
  if (isCoordinator) return <CoordinatorDashboard />;
  if (isYouthWorker) return <YouthWorkerDashboard />;

  return <div>Unknown role: {role}</div>;
}
```

### Form with User Data Pre-fill

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { setYouthWorkerProfile } from '@/lib/firebase/firestore';
import { validateIsraeliId } from '@/utils/validation';

export function YouthWorkerForm() {
  const { user, userId } = useAuth();
  const [formData, setFormData] = React.useState({
    dateOfBirth: '',
    israeliId: '',
    bankAccountNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateIsraeliId(formData.israeliId)) {
      alert('Invalid Israeli ID');
      return;
    }

    if (!user || !userId) return;

    await setYouthWorkerProfile({
      ...user,
      role: 'youth_worker',
      dateOfBirth: formData.dateOfBirth,
      israeliId: formData.israeliId,
      bankAccountNumber: formData.bankAccountNumber,
    });

    alert('Profile updated!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Email: {user?.email}</p>
      <p>Name: {user?.name}</p>
      {/* Form fields */}
    </form>
  );
}
```

## Type Definitions

All types are defined in `types/index.ts`:

```typescript
type UserRole = 'admin' | 'coordinator' | 'youth_worker';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface YouthWorker extends User {
  role: 'youth_worker';
  dateOfBirth: string;
  israeliId: string;
  bankAccountNumber?: string;
  bankBranchCode?: string;
  bankAccountHolderName?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}
```
