import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

function AdminIndexComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: '/admin/dashboard', replace: true })
  }, [navigate])

  return null
}

export const Route = createFileRoute('/admin/')({
  component: AdminIndexComponent,
})
