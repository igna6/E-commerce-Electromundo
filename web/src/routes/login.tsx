import { createFileRoute } from '@tanstack/react-router'

import LoginForm from '../components/sections/auth/LoginForm'

export const Route = createFileRoute('/login')({
  component: LoginForm,
})