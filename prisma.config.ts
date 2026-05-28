import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const isLocalDev = process.env.DATABASE_URL?.startsWith('file:')

export default defineConfig({
  schema: isLocalDev ? 'prisma/schema.dev.prisma' : 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
