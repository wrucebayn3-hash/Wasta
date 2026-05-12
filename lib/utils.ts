import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function timeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculateProfileCompletion(profile: {
  bio?: string | null
  phone?: string | null
  location?: string | null
  linkedinUrl?: string | null
  resumeUrl?: string | null
  currentCompany?: string | null
  currentRole?: string | null
  skills?: string
  experience?: string
  education?: string
}): number {
  const fields = [
    profile.bio,
    profile.phone,
    profile.location,
    profile.linkedinUrl,
    profile.resumeUrl,
    profile.currentCompany,
    profile.currentRole,
    profile.skills !== '[]' && profile.skills ? profile.skills : null,
    profile.experience !== '[]' && profile.experience ? profile.experience : null,
    profile.education !== '[]' && profile.education ? profile.education : null,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export const JOB_STATUS_LABELS = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  CLOSED: 'Closed',
  DRAFT: 'Draft',
}

export const REFERRAL_STATUS_LABELS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  REFERRED: 'Referred',
  CLOSED: 'Closed',
}

export const WORK_MODE_LABELS = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
}

export const JOB_TYPE_LABELS = {
  FULLTIME: 'Full-time',
  PARTTIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
}

export const EXPERIENCE_LABELS = {
  ENTRY: 'Entry Level',
  MID: 'Mid Level',
  SENIOR: 'Senior Level',
  LEAD: 'Lead',
  EXECUTIVE: 'Executive',
}

export const ROLE_LABELS = {
  SEEKER: 'Job Seeker',
  POSTER: 'Job Poster / Referrer',
  BOTH: 'Both',
  ADMIN: 'Admin',
}
