import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout/')({
  component: () => <Navigate to="/checkout/informacion" />,
})
