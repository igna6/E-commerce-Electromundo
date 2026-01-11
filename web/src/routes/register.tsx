import { createFileRoute } from '@tanstack/react-router'

import RegisterForm from '../components/sections/auth/RegisterForm'

export const Route = createFileRoute('/register')({
  component: RegisterForm,
})
