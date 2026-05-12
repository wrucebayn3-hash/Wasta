import { db } from '@/lib/db'
import { Activity } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'

export default async function AdminActivityPage() {
  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { name: true, email: true, image: true } },
    },
  })

  const adminActions = await db.adminAction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      admin: { select: { name: true, image: true } },
    },
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Activity Logs</h1>
        <p className="text-sm text-[#93939f] mt-1">Track all platform activity and admin actions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity */}
        <div className="bg-white rounded-[22px] p-6">
          <h2 className="font-semibold text-[#17171c] mb-5 flex items-center gap-2">
            <Activity size={18} />
            User Activity ({logs.length})
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-sm text-[#93939f]">No activity logs yet.</p>
            ) : logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#eeece7] transition-colors">
                <div className="w-2 h-2 rounded-full bg-[#d9d9dd] mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#17171c]">{log.action}</p>
                  {log.details && <p className="text-xs text-[#93939f] mt-0.5">{log.details}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    {log.user && (
                      <span className="text-xs text-[#75758a] font-medium">{log.user.name}</span>
                    )}
                    <span className="text-xs text-[#93939f]">{formatDate(log.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-[22px] p-6">
          <h2 className="font-semibold text-[#17171c] mb-5 flex items-center gap-2">
            <Activity size={18} />
            Admin Actions ({adminActions.length})
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {adminActions.length === 0 ? (
              <p className="text-sm text-[#93939f]">No admin actions yet.</p>
            ) : adminActions.map((action) => (
              <div key={action.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#eeece7] transition-colors">
                <Avatar name={action.admin.name} image={action.admin.image} size="xs" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#17171c]">{action.action}</p>
                  <p className="text-xs text-[#93939f] mt-0.5">
                    {action.targetType} · {action.admin.name} · {formatDate(action.createdAt)}
                  </p>
                  {action.details && (
                    <p className="text-xs text-[#75758a] mt-1">{action.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
