import PropertiesManagement from '../../../components/admin/PropertiesManagement';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

export const metadata = {
  title: 'Manage Properties | Alrabie Real Estate',
  description: 'Admin panel for managing properties',
};

export default function AdminPropertiesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-neutral-900">
        <div className="container-x py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Properties Management</h1>
            <p className="text-neutral-300">Add, edit, and manage all properties in the system</p>
          </div>
          
          <PropertiesManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
}
