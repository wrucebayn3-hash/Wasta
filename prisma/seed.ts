import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import path from 'path'

async function main() {
  const { PrismaLibSql } = await import('@prisma/adapter-libsql')
  const adapter = new PrismaLibSql({
    url: `file:${path.join(process.cwd(), 'prisma/dev.db')}`,
  })
  const prisma = new PrismaClient({ adapter })

  console.log('🌱 Seeding database...')

  // Create admin
  const adminPassword = await bcrypt.hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wasta.com' },
    update: {},
    create: {
      email: 'admin@wasta.com',
      name: 'Wasta Admin',
      password: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          bio: 'Platform administrator',
          currentRole: 'Admin',
          completionPct: 100,
        },
      },
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Create sample job poster
  const posterPassword = await bcrypt.hash('poster123456', 12)
  const poster = await prisma.user.upsert({
    where: { email: 'poster@wasta.com' },
    update: {},
    create: {
      email: 'poster@wasta.com',
      name: 'Sarah Chen',
      password: posterPassword,
      role: 'POSTER',
      profile: {
        create: {
          bio: 'Senior Engineering Manager at TechCorp. Happy to refer great candidates!',
          currentCompany: 'TechCorp',
          currentRole: 'Senior Engineering Manager',
          location: 'San Francisco, CA',
          linkedinUrl: 'https://linkedin.com/in/sarahchen',
          skills: '["Engineering Management", "React", "Python", "System Design"]',
          isOpenToRefer: true,
          completionPct: 90,
        },
      },
    },
  })
  console.log('✅ Poster created:', poster.email)

  // Create sample job seeker
  const seekerPassword = await bcrypt.hash('seeker123456', 12)
  const seeker = await prisma.user.upsert({
    where: { email: 'seeker@wasta.com' },
    update: {},
    create: {
      email: 'seeker@wasta.com',
      name: 'Alex Johnson',
      password: seekerPassword,
      role: 'SEEKER',
      profile: {
        create: {
          bio: 'Full-stack developer with 5 years of experience. Looking for my next opportunity!',
          currentCompany: 'StartupXYZ',
          currentRole: 'Software Engineer',
          location: 'New York, NY',
          skills: '["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"]',
          completionPct: 80,
        },
      },
    },
  })
  console.log('✅ Seeker created:', seeker.email)

  // Create sample jobs
  const jobsData = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      workMode: 'HYBRID' as const,
      jobType: 'FULLTIME' as const,
      experienceLevel: 'SENIOR' as const,
      description: `We're looking for a Senior Software Engineer to join our platform team. You'll work on building scalable systems that serve millions of users.\n\nResponsibilities:\n- Design and implement new features across our stack\n- Lead technical architecture decisions\n- Mentor junior engineers\n- Collaborate with product and design teams`,
      requirements: `- 5+ years of software engineering experience\n- Strong proficiency in React and TypeScript\n- Experience with cloud infrastructure (AWS/GCP)\n- Strong system design skills\n- Excellent communication skills`,
      skills: '["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"]',
      industry: 'Technology',
      salary: '$150,000 - $200,000',
      referralAvailable: true,
      posterId: poster.id,
    },
    {
      title: 'Product Manager',
      company: 'TechCorp',
      location: 'Remote',
      workMode: 'REMOTE' as const,
      jobType: 'FULLTIME' as const,
      experienceLevel: 'MID' as const,
      description: `Join our product team as a Product Manager. You'll own key product areas and work closely with engineering and design.\n\nThis is an exciting opportunity to shape the future of our platform and make a real impact.`,
      requirements: `- 3+ years of product management experience\n- Track record of launching successful products\n- Strong analytical and data-driven mindset\n- Excellent stakeholder management skills`,
      skills: '["Product Strategy", "Agile", "SQL", "User Research"]',
      industry: 'Technology',
      salary: '$120,000 - $160,000',
      referralAvailable: true,
      posterId: poster.id,
    },
    {
      title: 'UX Designer',
      company: 'DesignCo',
      location: 'Austin, TX',
      workMode: 'HYBRID' as const,
      jobType: 'FULLTIME' as const,
      experienceLevel: 'MID' as const,
      description: `We're looking for a talented UX Designer to join our growing team. You'll work on designing beautiful, intuitive experiences for our users.`,
      requirements: `- 3+ years of UX/Product design experience\n- Proficiency in Figma and design tools\n- Portfolio demonstrating end-to-end design process\n- Experience with user research and testing`,
      skills: '["Figma", "User Research", "Prototyping", "Design Systems"]',
      industry: 'Design',
      salary: '$100,000 - $130,000',
      referralAvailable: true,
      posterId: poster.id,
    },
    {
      title: 'Data Scientist',
      company: 'DataFlow Inc',
      location: 'New York, NY',
      workMode: 'ONSITE' as const,
      jobType: 'FULLTIME' as const,
      experienceLevel: 'SENIOR' as const,
      description: `Join our data science team and help us unlock insights from our data. You'll build ML models and data pipelines that directly impact our business decisions.`,
      requirements: `- 5+ years of data science experience\n- Strong proficiency in Python and SQL\n- Experience with ML frameworks (PyTorch, TensorFlow)\n- Excellent communication of technical concepts`,
      skills: '["Python", "Machine Learning", "SQL", "TensorFlow", "Data Visualization"]',
      industry: 'Technology',
      salary: '$160,000 - $220,000',
      referralAvailable: true,
      posterId: poster.id,
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudSystems',
      location: 'Chicago, IL',
      workMode: 'REMOTE' as const,
      jobType: 'FULLTIME' as const,
      experienceLevel: 'MID' as const,
      description: `We're building the future of cloud infrastructure. Join our DevOps team and help us scale our systems to serve customers globally.`,
      requirements: `- 3+ years of DevOps experience\n- Strong knowledge of Kubernetes and Docker\n- Experience with CI/CD pipelines\n- Infrastructure as code experience (Terraform)`,
      skills: '["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"]',
      industry: 'Technology',
      salary: '$130,000 - $170,000',
      referralAvailable: false,
      posterId: poster.id,
    },
    {
      title: 'Marketing Manager',
      company: 'GrowthBrand',
      location: 'Los Angeles, CA',
      workMode: 'HYBRID' as const,
      jobType: 'FULLTIME' as const,
      experienceLevel: 'MID' as const,
      description: `Lead our marketing efforts and drive user growth. You'll own our content strategy, paid channels, and brand voice.`,
      requirements: `- 4+ years of marketing experience\n- Proven track record in B2B or B2C marketing\n- Experience with marketing analytics tools\n- Strong writing and communication skills`,
      skills: '["Content Marketing", "SEO", "Paid Advertising", "Analytics", "Brand Strategy"]',
      industry: 'Marketing',
      salary: '$90,000 - $120,000',
      referralAvailable: true,
      posterId: poster.id,
    },
  ]

  for (const jobData of jobsData) {
    await prisma.job.create({ data: jobData })
  }
  console.log(`✅ Created ${jobsData.length} sample jobs`)

  // Add industries and skills
  const industries = ['Technology', 'Finance', 'Healthcare', 'Design', 'Marketing', 'Education', 'Retail', 'Media', 'Real Estate']
  for (const name of industries) {
    await prisma.industry.upsert({ where: { name }, update: {}, create: { name } })
  }

  const skills = ['React', 'TypeScript', 'Python', 'Node.js', 'AWS', 'Machine Learning', 'Product Management', 'UI/UX Design', 'Data Science', 'DevOps', 'Kubernetes', 'Go', 'Java', 'SQL', 'MongoDB']
  for (const name of skills) {
    await prisma.skillTag.upsert({ where: { name }, update: {}, create: { name } })
  }
  console.log('✅ Categories seeded')

  console.log('\n🚀 Seeding complete!')
  console.log('\nTest accounts:')
  console.log('  Admin:  admin@wasta.com / admin123456')
  console.log('  Poster: poster@wasta.com / poster123456')
  console.log('  Seeker: seeker@wasta.com / seeker123456')

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
