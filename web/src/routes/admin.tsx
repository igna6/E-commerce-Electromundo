import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/sections/auth/LoginForm'

export const Route = createFileRoute('/admin')({
  component: LoginForm,
})