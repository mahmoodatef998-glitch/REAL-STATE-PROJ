import AddPropertyPage from '../../../components/broker/AddPropertyPage';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

export const metadata = {
  title: 'Add Property | Alrabie Real Estate',
  description: 'Add a new property to the system',
};

export default function BrokerAddPropertyPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-900">
        <AddPropertyPage />
      </div>
    </ProtectedRoute>
  );
}

