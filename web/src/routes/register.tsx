import { createFileRoute } from '@tanstack/react-router'

import RegisterForm from '../sections/auth/RegisterForm'

export const Route = createFileRoute('/register')({
  component: RegisterForm,
})
