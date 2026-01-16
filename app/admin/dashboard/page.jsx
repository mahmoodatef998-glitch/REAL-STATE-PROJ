import AdminDashboard from '../../../components/admin/AdminDashboard';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

export const metadata = {
  title: 'Admin Dashboard | Alrabie Real Estate',
  description: 'Admin dashboard for managing properties and users',
};

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-neutral-900">
        <AdminDashboard />
      </div>
    </ProtectedRoute>
  );
}

