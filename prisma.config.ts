import path from 'path'

const dbUrl = `file:${path.join(process.cwd(), 'prisma/dev.db')}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: any = {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: dbUrl,
  },
  migrate: {
    async adapter() {
      const { PrismaLibSql } = await import('@prisma/adapter-libsql')
      return new PrismaLibSql({ url: dbUrl })
    },
  },
}

export default config
