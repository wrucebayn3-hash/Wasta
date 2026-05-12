import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, UserPlus, Search, Send, CheckCircle, Bell, MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'How It Works' }

const seekerSteps = [
  { icon: UserPlus, step: '01', title: 'Create Your Profile', desc: 'Sign up as a Job Seeker and build a complete profile with your experience, skills, resume, and LinkedIn.' },
  { icon: Search, step: '02', title: 'Browse & Filter Jobs', desc: 'Explore job openings filtered by title, company, location, industry, job type, and more.' },
  { icon: Send, step: '03', title: 'Request a Referral', desc: 'Find a job with referral availability and request a referral. Add a message and attach your resume.' },
  { icon: Bell, step: '04', title: 'Track Your Status', desc: 'Follow your referral request status: Pending, Accepted, Rejected, Referred, or Closed — in real time.' },
  { icon: MessageSquare, step: '05', title: 'Connect with Your Referrer', desc: 'Once accepted, message your referrer directly to coordinate your application.' },
  { icon: CheckCircle, step: '06', title: 'Land the Role', desc: 'Your referrer submits your profile internally. Get notified when you\'re referred.' },
]

const posterSteps = [
  { icon: UserPlus, step: '01', title: 'Create Your Profile', desc: 'Sign up as a Job Poster and add your company, role, and referral preferences.' },
  { icon: Send, step: '02', title: 'Post a Job', desc: 'Create a job listing in minutes. Add the title, company, description, skills needed, and deadline.' },
  { icon: Bell, step: '03', title: 'Receive Requests', desc: 'Get notified when job seekers request referrals. Review their profiles, resumes, and messages.' },
  { icon: CheckCircle, step: '04', title: 'Accept or Reject', desc: 'Review each candidate carefully and accept those you\'d be comfortable referring.' },
  { icon: MessageSquare, step: '05', title: 'Communicate', desc: 'Message accepted candidates to gather any additional info before submitting.' },
  { icon: ArrowRight, step: '06', title: 'Mark as Referred', desc: 'Once you\'ve submitted the candidate internally, mark them as Referred. They get notified instantly.' },
]

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-mono-label text-[#93939f] mb-4">HOW IT WORKS</p>
          <h1 className="font-display text-5xl font-semibold text-[#17171c] mb-6 tracking-tight">
            Referrals, made simple
          </h1>
          <p className="text-lg text-[#75758a] max-w-2xl mx-auto leading-relaxed">
            Whether you're looking for your next role or ready to help others find theirs,
            Wasta makes the referral process structured, transparent, and easy.
          </p>
        </div>
      </section>

      {/* Job Seeker Flow */}
      <section className="bg-[#eeece7] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#003c33] rounded-full mb-4">
              <span className="text-xs font-mono-label text-white tracking-wider">FOR JOB SEEKERS</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-[#17171c]">
              How to get referred
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {seekerSteps.map((step) => (
              <div key={step.step} className="bg-white rounded-[22px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono-label text-[#93939f]">{step.step}</span>
                  <div className="w-8 h-8 bg-[#17171c] rounded-lg flex items-center justify-center">
                    <step.icon size={16} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-[#17171c] mb-2">{step.title}</h3>
                <p className="text-sm text-[#75758a] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/signup?role=SEEKER">
              <Button size="lg" className="gap-2 group">
                Get Started as a Job Seeker
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Job Poster Flow */}
      <section className="bg-[#17171c] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-4">
              <span className="text-xs font-mono-label text-white tracking-wider">FOR JOB POSTERS</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-white">
              How to refer candidates
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posterSteps.map((step) => (
              <div key={step.step} className="bg-white/5 border border-white/10 rounded-[22px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono-label text-[#93939f]">{step.step}</span>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <step.icon size={16} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#93939f] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/signup?role=POSTER">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#17171c] gap-2 group">
                Start Referring Candidates
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-[#17171c] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: 'Is Wasta free to use?', a: 'Yes, Wasta is completely free for both job seekers and job posters.' },
              { q: 'Can I be both a Job Seeker and a Job Poster?', a: 'Absolutely. When you sign up, select "Both" as your role and you can switch between seeker and poster modes anytime.' },
              { q: 'How do I know a referrer is legitimate?', a: 'All users are verified through email. Job Posters add their company and designation details that are visible on their profiles.' },
              { q: 'What happens after I request a referral?', a: 'The Job Poster receives a notification and reviews your profile. They can accept or reject your request. If accepted, you can message them directly.' },
              { q: 'Can a referral request be withdrawn?', a: 'Yes, you can close or withdraw a referral request before it is accepted.' },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-[#f2f2f2] pb-6">
                <h3 className="font-semibold text-[#17171c] mb-2">{faq.q}</h3>
                <p className="text-sm text-[#75758a] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
