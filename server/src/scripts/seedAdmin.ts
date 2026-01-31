import bcrypt from 'bcryptjs'
import db from '../db/db'
import { usersTable } from '../db/schema'
import { eq } from 'drizzle-orm'

const ADMIN_EMAIL = 'admin@electromundo.com'
const ADMIN_PASSWORD = 'Admin123!' // Change this
const ADMIN_NAME = 'Admin'

async function seedAdmin() {
  try {
    console.log('Checking for existing admin user...')

    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, ADMIN_EMAIL))
      .limit(1)

    if (existingUsers[0]) {
      console.log('Admin user already exists. Updating isAdmin flag...')
      await db
        .update(usersTable)
        .set({ isAdmin: true })
        .where(eq(usersTable.email, ADMIN_EMAIL))
      console.log('Admin user updated successfully!')
    } else {
      console.log('Creating admin user...')
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

      await db.insert(usersTable).values({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        isAdmin: true,
      })

      console.log('Admin user created successfully!')
    }

    console.log('')
    console.log('Admin credentials:')
    console.log(`  Email: ${ADMIN_EMAIL}`)
    console.log(`  Password: ${ADMIN_PASSWORD}`)
    console.log('')
    console.log('Please change the password in production!')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding admin user:', error)
    process.exit(1)
  }
}

seedAdmin()
