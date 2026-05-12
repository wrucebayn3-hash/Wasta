import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: any = {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
}

export default config
