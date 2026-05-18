'use client';

import dynamic from 'next/dynamic';

// Dynamically import AuthProvider with ssr disabled (client-only)
// This MUST be in a Client Component file, not in layout.tsx
const AuthProvider = dynamic(
  () => import('@/lib/firebase/context').then(mod => ({ default: mod.AuthProvider })),
  {
    ssr: false,
    loading: () => null,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
