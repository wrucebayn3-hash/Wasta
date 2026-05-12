import { Metadata } from 'next'
import { Users, Target, Heart, Globe } from 'lucide-react'

export const metadata: Metadata = { title: 'About Wasta' }

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-mono-label text-[#93939f] mb-4">ABOUT WASTA</p>
          <h1 className="font-display text-5xl font-semibold text-[#17171c] mb-6 tracking-tight">
            Hiring through trust,<br />not just talent
          </h1>
          <p className="text-lg text-[#75758a] leading-relaxed max-w-2xl mx-auto">
            Wasta was built on a simple belief: the best hires come through referrals.
            We built a platform to make that process simple, fair, and transparent for everyone.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#003c33] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl font-semibold text-white mb-6">Our Mission</h2>
          <p className="text-lg text-[#93939f] leading-relaxed max-w-3xl mx-auto">
            We believe that everyone deserves access to the hidden job market — the one that fills
            roles through referrals, relationships, and trust. Wasta democratizes this access by
            connecting job seekers directly with people who can vouch for them.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#eeece7] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-[#17171c] text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: 'Community',
                desc: 'We believe in the power of human connection and professional networks.',
              },
              {
                icon: Target,
                title: 'Transparency',
                desc: 'Every referral status, every action — tracked and visible to all parties.',
              },
              {
                icon: Heart,
                title: 'Trust',
                desc: 'Verified profiles and authentic referrals build lasting professional relationships.',
              },
              {
                icon: Globe,
                title: 'Opportunity',
                desc: 'Opening doors that were previously closed to those without insider access.',
              },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-[22px] p-8 text-center">
                <div className="w-12 h-12 bg-[#17171c] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-[#17171c] mb-2">{value.title}</h3>
                <p className="text-sm text-[#75758a] leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-[#17171c] mb-8">Our Story</h2>
          <div className="space-y-5 text-[#75758a] leading-relaxed">
            <p>
              The word &ldquo;Wasta&rdquo; comes from Arabic and means &ldquo;connection&rdquo; or
              &ldquo;influence through relationships.&rdquo; In many cultures, having &ldquo;wasta&rdquo;
              means having someone who can vouch for you, open doors, and give you a fair shot.
            </p>
            <p>
              We built Wasta because we saw talented people struggling to break into companies not
              because they lacked skills, but because they lacked connections. Meanwhile, companies
              were missing out on great candidates because those candidates never made it past the
              automated screening.
            </p>
            <p>
              Wasta bridges that gap. It gives job seekers access to the warm introductions that
              can make all the difference, and it gives referrers a structured, easy way to help
              people they believe in.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
