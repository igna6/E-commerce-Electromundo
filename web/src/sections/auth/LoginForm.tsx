import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

function LoginForm() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('¡Bienvenido!') 
        // navigate({ to: '/admin/dashboard' }) // Descomenta esto cuando tengas la ruta dashboard
      } else {
        setError('Credenciales incorrectas')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-brand-dark">
                Accede a tu cuenta
          </h2>
        </div>

        {/* FORMULARIO */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-center font-bold">{error}</div>}
          <div className="space-y-4">

                <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                        Correo Electrónico
                    </label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm transition-all"
                        placeholder="ejemplo@email.com"
                    />
                </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
              </label>
              <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm transition-all"
                    placeholder="••••••••"
                />
            </div>
          </div>

          <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                        Recordarme
                    </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-brand-blue hover:underline">
                    ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
                <Button
                    type="submit"
                    className="w-full py-3 font-bold rounded-full bg-brand-orange hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30 active:scale-95"
                    size="lg"
                >
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm