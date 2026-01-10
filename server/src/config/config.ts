import dotenv from 'dotenv'

dotenv.config()

interface Config {
  port: number
  nodeEnv: string
  databaseName: string
  databaseUrl: string
  databaseHost: string
  databasePort: number
  databaseUser: string
  databasePassword: string
}

const config: Config = {
  port: parseInt(process.env.PORT || '9000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'electromundo',
  databasePort: parseInt(process.env.DATABASE_PORT || '5432'),
  databaseHost: process.env.DATABASE_HOST || 'localhost',
  databaseUser: process.env.DATABASE_USER || 'root',
  databasePassword: process.env.DATABASE_PASSWORD || 'root',
  databaseName: process.env.DATABASE_NAME || 'electromundo',
}

export default config
