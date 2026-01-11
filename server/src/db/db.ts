import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import config from '../config/config'
import * as schema from './schema'

const db = drizzle({
  connection: {
    host: config.databaseHost,
    port: config.databasePort,
    user: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseName,
    ssl: false,
  },
  schema: {
    ...schema,
  },
})

export default db
