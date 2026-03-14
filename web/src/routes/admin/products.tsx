import { Outlet, createFileRoute } from '@tanstack/react-router'

function ProductsLayout() {
  return <Outlet />
}

export const Route = createFileRoute('/admin/products')({
  component: ProductsLayout,
})
