import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Bell, CheckCircle } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { timeAgo } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const notifTypeLabel: Record<string, { label: string; variant: 'success' | 'info' | 'danger' | 'default' }> = {
  REFERRAL_REQUEST: { label: 'New Request', variant: 'info' },
  REFERRAL_ACCEPTED: { label: 'Accepted', variant: 'success' },
  REFERRAL_REJECTED: { label: 'Rejected', variant: 'danger' },
  REFERRAL_REFERRED: { label: 'Referred!', variant: 'success' },
  JOB_CLOSED: { label: 'Job Closed', variant: 'default' },
  ADMIN_ACTION: { label: 'Admin', variant: 'default' },
  NEW_MESSAGE: { label: 'Message', variant: 'info' },
  SYSTEM: { label: 'System', variant: 'default' },
}

export default async function SeekerNotificationsPage() {
  const session = await auth()
  const notifications = await db.notification.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#17171c]">Notifications</h1>
          <p className="text-sm text-[#93939f] mt-1">
            {notifications.filter((n) => !n.isRead).length} unread notifications
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={24} />}
          title="No notifications yet"
          description="You'll be notified about referral requests, status updates, and more."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const typeConfig = notifTypeLabel[notif.type] || { label: notif.type, variant: 'default' as const }
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-xl p-4 flex items-start gap-4 ${!notif.isRead ? 'border-l-2 border-[#17171c]' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${notif.isRead ? 'bg-[#eeece7]' : 'bg-[#17171c]'}`}>
                  <Bell size={16} className={notif.isRead ? 'text-[#93939f]' : 'text-white'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={typeConfig.variant as 'success' | 'info' | 'danger' | 'default'}>{typeConfig.label}</Badge>
                    <span className="text-xs text-[#93939f]">{timeAgo(notif.createdAt)}</span>
                  </div>
                  <p className="font-medium text-sm text-[#17171c]">{notif.title}</p>
                  <p className="text-sm text-[#75758a] mt-0.5">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-[#ff7759] mt-1.5 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
