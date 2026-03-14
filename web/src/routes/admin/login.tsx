import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/sections/auth/LoginForm'

function AdminLoginComponent() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.isAdmin) {
      navigate({ to: '/admin/dashboard' })
    }
  }, [isLoading, isAuthenticated, user, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return <LoginForm />
}

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginComponent,
})
