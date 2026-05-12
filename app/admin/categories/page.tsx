'use client'

import { useEffect, useState } from 'react'
import { Tag, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Category {
  id: string
  name: string
  createdAt: string
}

export default function AdminCategoriesPage() {
  const [industries, setIndustries] = useState<Category[]>([])
  const [skills, setSkills] = useState<Category[]>([])
  const [newIndustry, setNewIndustry] = useState('')
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories?type=industry').then((r) => r.json()),
      fetch('/api/admin/categories?type=skill').then((r) => r.json()),
    ]).then(([ind, sk]) => {
      setIndustries(ind)
      setSkills(sk)
    })
  }, [])

  const addIndustry = async () => {
    if (!newIndustry.trim()) return
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'industry', name: newIndustry.trim() }),
    })
    const updated = await fetch('/api/admin/categories?type=industry').then((r) => r.json())
    setIndustries(updated)
    setNewIndustry('')
  }

  const addSkill = async () => {
    if (!newSkill.trim()) return
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'skill', name: newSkill.trim() }),
    })
    const updated = await fetch('/api/admin/categories?type=skill').then((r) => r.json())
    setSkills(updated)
    setNewSkill('')
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#17171c]">Categories Management</h1>
        <p className="text-sm text-[#93939f] mt-1">Manage industries, skills, and platform categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industries */}
        <div className="bg-white rounded-[22px] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Tag size={18} className="text-[#17171c]" />
            <h2 className="font-semibold text-[#17171c]">Industries ({industries.length})</h2>
          </div>
          <div className="flex gap-2 mb-5">
            <input
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              placeholder="Add new industry..."
              className="flex-1 rounded-lg border border-[#d9d9dd] px-4 py-2 text-sm focus:outline-none focus:border-[#9b60aa]"
              onKeyDown={(e) => e.key === 'Enter' && addIndustry()}
            />
            <Button size="sm" onClick={addIndustry} className="gap-1">
              <Plus size={14} />
              Add
            </Button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {industries.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#eeece7] transition-colors">
                <span className="text-sm text-[#17171c]">{item.name}</span>
                <button className="text-[#b30000] p-1 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {industries.length === 0 && (
              <p className="text-sm text-[#93939f] text-center py-4">No industries yet.</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-[22px] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Tag size={18} className="text-[#17171c]" />
            <h2 className="font-semibold text-[#17171c]">Skills ({skills.length})</h2>
          </div>
          <div className="flex gap-2 mb-5">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add new skill..."
              className="flex-1 rounded-lg border border-[#d9d9dd] px-4 py-2 text-sm focus:outline-none focus:border-[#9b60aa]"
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button size="sm" onClick={addSkill} className="gap-1">
              <Plus size={14} />
              Add
            </Button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {skills.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#eeece7] transition-colors">
                <span className="text-sm text-[#17171c]">{item.name}</span>
                <button className="text-[#b30000] p-1 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-[#93939f] text-center py-4">No skills yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
