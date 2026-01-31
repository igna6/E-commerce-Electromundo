import { createFileRoute, Outlet, Navigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/sections/admin/AdminLayout'

function AdminRouteComponent() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  const isLoginPage = location.pathname === '/admin/login'

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  // Allow login page without authentication
  if (isLoginPage) {
    return <Outlet />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />
  }

  // Redirect to home if not admin
  if (!user?.isAdmin) {
    return <Navigate to="/" />
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}

export const Route = createFileRoute('/admin')({
  component: AdminRouteComponent,
})
