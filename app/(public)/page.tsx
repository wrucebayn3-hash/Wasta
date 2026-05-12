import Link from 'next/link'
import { ArrowRight, Briefcase, Users, Star, CheckCircle, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'

async function getStats() {
  try {
    const [users, jobs, referrals] = await Promise.all([
      db.user.count(),
      db.job.count({ where: { status: 'ACTIVE' } }),
      db.referralRequest.count({ where: { status: 'REFERRED' } }),
    ])
    return { users, jobs, referrals }
  } catch {
    return { users: 0, jobs: 0, referrals: 0 }
  }
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div>
      {/* Hero */}
      <section className="bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#eeece7] rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-[#003c33] animate-pulse-dot" />
              <span className="text-xs font-medium text-[#17171c] font-mono-label tracking-wider">
                REFERRAL-BASED HIRING PLATFORM
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#17171c] leading-[1.05] tracking-tight mb-6">
              Get Referred,
              <br />
              <span className="text-[#003c33]">Not Just Applied</span>
            </h1>
            <p className="text-lg text-[#75758a] max-w-2xl mx-auto mb-10 leading-relaxed">
              Wasta connects job seekers with people inside companies who are willing to refer them.
              Skip the resume black hole — get a warm introduction to your next opportunity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2 group">
                  Start Getting Referred
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="secondary" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-display font-semibold text-[#17171c]">
                {stats.users > 0 ? stats.users.toLocaleString() : '500+'}
              </div>
              <div className="text-sm text-[#93939f] mt-1">Active Users</div>
            </div>
            <div className="text-center border-x border-[#f2f2f2]">
              <div className="text-3xl font-display font-semibold text-[#17171c]">
                {stats.jobs > 0 ? stats.jobs.toLocaleString() : '200+'}
              </div>
              <div className="text-sm text-[#93939f] mt-1">Open Roles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-semibold text-[#17171c]">
                {stats.referrals > 0 ? stats.referrals.toLocaleString() : '1,200+'}
              </div>
              <div className="text-sm text-[#93939f] mt-1">Referrals Made</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#eeece7] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono-label text-[#93939f] mb-4">HOW IT WORKS</p>
            <h2 className="font-display text-4xl font-semibold text-[#17171c] tracking-tight">
              Simple. Transparent. Effective.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Browse Jobs',
                desc: 'Explore hundreds of job openings from companies you love. Filter by role, location, industry, and more.',
                icon: Briefcase,
              },
              {
                step: '02',
                title: 'Request a Referral',
                desc: 'Find someone inside the company willing to refer you. Send a message and your resume with one click.',
                icon: Users,
              },
              {
                step: '03',
                title: 'Get Referred',
                desc: 'Your referrer submits your application internally. Track the status and communicate in real time.',
                icon: Star,
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-[22px] p-8">
                <div className="text-xs font-mono-label text-[#93939f] mb-4">{item.step}</div>
                <div className="w-10 h-10 bg-[#17171c] rounded-lg flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#17171c] mb-3">{item.title}</h3>
                <p className="text-sm text-[#75758a] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Job Seekers & Posters */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Seekers */}
            <div className="bg-[#edfce9] rounded-[22px] p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#003c33] rounded-full mb-6">
                <span className="text-xs font-mono-label text-white tracking-wider">FOR JOB SEEKERS</span>
              </div>
              <h3 className="font-display text-3xl font-semibold text-[#17171c] mb-4 leading-tight">
                Get a warm introduction to your dream job
              </h3>
              <p className="text-sm text-[#75758a] mb-8 leading-relaxed">
                Referrals get 5x more interviews than cold applications. Build connections, get referred,
                and track every step of your journey.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Browse curated job openings',
                  'Request referrals from company insiders',
                  'Track referral status in real-time',
                  'Communicate directly with referrers',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#17171c]">
                    <CheckCircle size={16} className="text-[#003c33] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=SEEKER">
                <Button>Find Your Referral</Button>
              </Link>
            </div>

            {/* Posters */}
            <div className="bg-[#17171c] rounded-[22px] p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6">
                <span className="text-xs font-mono-label text-white tracking-wider">FOR JOB POSTERS</span>
              </div>
              <h3 className="font-display text-3xl font-semibold text-white mb-4 leading-tight">
                Help great people find great jobs
              </h3>
              <p className="text-sm text-[#93939f] mb-8 leading-relaxed">
                Post job openings from your company and refer top candidates. Build your reputation
                as a connector and help grow your team.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Post job openings in minutes',
                  'Receive curated referral requests',
                  'Review profiles, resumes, and messages',
                  'Mark candidates as referred with one click',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle size={16} className="text-[#ff7759] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=POSTER">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#17171c]">
                  Start Referring
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#003c33] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono-label text-[#93939f] mb-4">PLATFORM FEATURES</p>
            <h2 className="font-display text-4xl font-semibold text-white tracking-tight">
              Everything you need for referral success
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Instant Requests',
                desc: 'Submit referral requests in seconds. Attach your resume, add a personal note.',
              },
              {
                icon: Shield,
                title: 'Verified Profiles',
                desc: 'All users are verified. Know exactly who you\'re connecting with.',
              },
              {
                icon: Star,
                title: 'Status Tracking',
                desc: 'Real-time updates on your referral status. No more waiting in the dark.',
              },
              {
                icon: Users,
                title: 'Direct Messaging',
                desc: 'Message your referrer directly once your request is accepted.',
              },
              {
                icon: Briefcase,
                title: 'Smart Filters',
                desc: 'Filter by role, company, location, industry, and remote/hybrid/on-site.',
              },
              {
                icon: CheckCircle,
                title: 'Role Flexibility',
                desc: 'Seek referrals and give referrals — you can do both on Wasta.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-[16px] p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#93939f] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[#17171c] mb-6 tracking-tight">
            Ready to land your next role?
          </h2>
          <p className="text-lg text-[#75758a] mb-10 max-w-xl mx-auto">
            Join thousands of professionals using Wasta to find jobs through referrals.
            It's free, it's fast, and it works.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2 group">
                Create Free Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="lg">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
