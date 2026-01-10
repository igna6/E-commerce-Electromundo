import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

import config from './src/config/config.ts'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: config.databaseHost,
    port: config.databasePort,
    user: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseName,
    ssl: false,
  },
})
