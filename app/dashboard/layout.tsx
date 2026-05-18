import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
