"use client";

export default function ActivityTimeline({ activities = [] }) {
  const getActivityIcon = (type) => {
    const icons = {
      property_created: '🏠',
      property_updated: '✏️',
      property_deleted: '🗑️',
      status_changed: '🔄',
      deal_created: '🤝',
      deal_updated: '💼',
      lead_created: '👤',
      lead_updated: '📝',
      commission_approved: '✅',
      user_login: '🔐',
      user_logout: '🚪'
    };
    return icons[type] || '📌';
  };

  const getActivityColor = (type) => {
    const colors = {
      property_created: 'border-green-500/30 bg-green-500/10',
      property_updated: 'border-blue-500/30 bg-blue-500/10',
      property_deleted: 'border-red-500/30 bg-red-500/10',
      status_changed: 'border-yellow-500/30 bg-yellow-500/10',
      deal_created: 'border-green-500/30 bg-green-500/10',
      deal_updated: 'border-blue-500/30 bg-blue-500/10',
      lead_created: 'border-purple-500/30 bg-purple-500/10',
      lead_updated: 'border-blue-500/30 bg-blue-500/10',
      commission_approved: 'border-green-500/30 bg-green-500/10',
      user_login: 'border-neutral-500/30 bg-neutral-500/10',
      user_logout: 'border-neutral-500/30 bg-neutral-500/10'
    };
    return colors[type] || 'border-white/10 bg-neutral-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-lg p-8 border border-white/10 text-center">
        <div className="text-6xl mb-4">📜</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Activity Yet</h3>
        <p className="text-neutral-400">Recent activities will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-6">Activity Timeline</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id || index}
            className="flex gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0"
          >
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl border ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.description}</p>
                  {activity.details && (
                    <p className="text-sm text-neutral-400 mt-1">{activity.details}</p>
                  )}
                  {activity.user && (
                    <p className="text-xs text-neutral-500 mt-1">
                      by {activity.user.name || 'System'}
                    </p>
                  )}
                </div>
                <span className="text-xs text-neutral-500 whitespace-nowrap">
                  {formatDate(activity.created_at || activity.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

