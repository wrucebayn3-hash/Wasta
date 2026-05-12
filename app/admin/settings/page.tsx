'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Shield, Bell, Globe } from 'lucide-react'

export default function AdminSettingsPage() {
  const [announcement, setAnnouncement] = useState({ title: '', content: '' })
  const [saved, setSaved] = useState(false)

  const saveAnnouncement = async () => {
    await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcement),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Platform Settings</h1>
        <p className="text-sm text-[#93939f] mt-1">Manage platform-wide configurations and announcements</p>
      </div>

      {/* Announcement */}
      <div className="bg-white rounded-[22px] p-6 space-y-5">
        <h2 className="font-semibold text-[#17171c] flex items-center gap-2">
          <Bell size={18} />
          Create Announcement
        </h2>
        <Input
          label="Announcement Title"
          placeholder="Platform update: new features available"
          value={announcement.title}
          onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
        />
        <Textarea
          label="Announcement Message"
          placeholder="Describe the announcement..."
          value={announcement.content}
          onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
        />
        <div className="flex items-center gap-3">
          <Button onClick={saveAnnouncement}>Publish Announcement</Button>
          {saved && <span className="text-sm text-[#003c33]">✓ Published!</span>}
        </div>
      </div>

      {/* Platform info */}
      <div className="bg-white rounded-[22px] p-6 space-y-5">
        <h2 className="font-semibold text-[#17171c] flex items-center gap-2">
          <Globe size={18} />
          Platform Information
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Platform Name', value: 'Wasta' },
            { label: 'Version', value: '1.0.0' },
            { label: 'Environment', value: process.env.NODE_ENV || 'development' },
            { label: 'Database', value: 'SQLite (libsql)' },
          ].map((item) => (
            <div key={item.label} className="p-4 bg-[#eeece7] rounded-xl">
              <p className="text-xs text-[#93939f] mb-1">{item.label}</p>
              <p className="font-medium text-[#17171c]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-[22px] p-6">
        <h2 className="font-semibold text-[#17171c] flex items-center gap-2 mb-4">
          <Shield size={18} />
          Security Settings
        </h2>
        <div className="space-y-4 text-sm text-[#75758a]">
          <div className="flex items-center justify-between p-4 bg-[#edfce9] rounded-xl">
            <div>
              <p className="font-medium text-[#17171c]">Email Verification</p>
              <p className="text-xs mt-0.5">Require email verification on signup</p>
            </div>
            <span className="text-[#003c33] font-medium text-xs">Coming Soon</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#f1f5ff] rounded-xl">
            <div>
              <p className="font-medium text-[#17171c]">Rate Limiting</p>
              <p className="text-xs mt-0.5">Prevent abuse of referral requests</p>
            </div>
            <span className="text-[#1863dc] font-medium text-xs">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
