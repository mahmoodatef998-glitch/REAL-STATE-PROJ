import BrokerDashboard from '../../../components/broker/BrokerDashboard';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

export const metadata = {
  title: 'Broker Dashboard | Alrabie Real Estate',
  description: 'Broker dashboard for managing your properties',
};

export default function BrokerDashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-900">
        <BrokerDashboard />
      </div>
    </ProtectedRoute>
  );
}

