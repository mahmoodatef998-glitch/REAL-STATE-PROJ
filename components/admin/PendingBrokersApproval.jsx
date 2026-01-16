"use client";
import { usePendingBrokers, useApproveBroker, useRejectBroker } from '../../hooks/useUsers';
import { useAuth } from '../../contexts/AuthContext';

export default function PendingBrokersApproval() {
  const { isAdmin } = useAuth();
  const { data: pendingBrokers = [], isLoading, error } = usePendingBrokers();
  const approveMutation = useApproveBroker();
  const rejectMutation = useRejectBroker();

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-neutral-300">Only administrators can access this page.</p>
      </div>
    );
  }

  const handleApprove = async (userId) => {
    if (confirm('Are you sure you want to approve this broker?')) {
      try {
        await approveMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Approval failed:', error);
      }
    }
  };

  const handleReject = async (userId) => {
    if (confirm('Are you sure you want to reject this broker? This action cannot be undone.')) {
      try {
        await rejectMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Rejection failed:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <p className="text-neutral-300 mt-4">Loading pending brokers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
        <p className="text-neutral-300 mb-4">
          {error.message || 'Failed to load pending brokers. Please check the console for details.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Pending Broker Requests ({pendingBrokers.length})
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Brokers awaiting approval to access the system
          </p>
        </div>
      </div>

      {/* Pending Brokers List */}
      {pendingBrokers.length === 0 ? (
        <div className="text-center py-12 bg-neutral-800 rounded-lg border border-white/10">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Pending Requests</h3>
          <p className="text-neutral-300">
            All broker registration requests have been processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-neutral-800 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{broker.name}</h3>
                    <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded">
                      Pending Approval
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">📧</span>
                      <span>{broker.email}</span>
                    </div>
                    {broker.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">📞</span>
                        <span>{broker.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">📅</span>
                      <span>Registered: {new Date(broker.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(broker.id)}
                    disabled={approveMutation.isPending}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus-ring disabled:opacity-50"
                  >
                    {approveMutation.isPending ? 'Approving...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(broker.id)}
                    disabled={rejectMutation.isPending}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus-ring disabled:opacity-50"
                  >
                    {rejectMutation.isPending ? 'Rejecting...' : '✕ Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

