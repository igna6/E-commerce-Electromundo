import Header from '@/layout/Header'
import { Outlet } from '@tanstack/react-router'

function App() {
  return (
    <div className="contenedor-principal">
      <Header />
      <hr className="border-gray-200 my-4" />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default App
