import PendingBrokersApproval from '../../../components/admin/PendingBrokersApproval';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

export const metadata = {
  title: 'Broker Approvals | Alrabie Real Estate',
  description: 'Admin panel for approving broker registrations',
};

export default function ApprovalsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-neutral-900">
        <div className="container-x py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Broker Approvals</h1>
            <p className="text-neutral-300">Review and approve broker registration requests</p>
          </div>
          
          <PendingBrokersApproval />
        </div>
      </div>
    </ProtectedRoute>
  );
}

