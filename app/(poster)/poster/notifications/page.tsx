import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Bell } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { timeAgo } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default async function PosterNotificationsPage() {
  const session = await auth()
  const notifications = await db.notification.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Notifications</h1>
        <p className="text-sm text-[#93939f] mt-1">
          {notifications.filter((n) => !n.isRead).length} unread
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={24} />}
          title="No notifications yet"
          description="You'll be notified about new referral requests, messages, and more."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl p-4 flex items-start gap-4 ${!notif.isRead ? 'border-l-2 border-[#17171c]' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${notif.isRead ? 'bg-[#eeece7]' : 'bg-[#17171c]'}`}>
                <Bell size={16} className={notif.isRead ? 'text-[#93939f]' : 'text-white'} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#93939f]">{timeAgo(notif.createdAt)}</span>
                </div>
                <p className="font-medium text-sm text-[#17171c]">{notif.title}</p>
                <p className="text-sm text-[#75758a] mt-0.5">{notif.message}</p>
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-[#ff7759] mt-1.5 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
