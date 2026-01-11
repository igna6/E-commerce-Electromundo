import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    emailConfirm: '',
    password: '',
    passwordConfirm: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.email !== formData.emailConfirm) {
      setError('Los correos electrónicos no coinciden.')
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    console.log('Registro exitoso:', formData)
    alert('¡Registro validado correctamente!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-brand-dark">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya eres cliente?{' '}
            <Link to="/login" className="font-medium text-brand-blue hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-200">
               {error}
            </div>
          )}

          <div className="space-y-4">
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                placeholder="ejemplo@email.com"
              />
            </div>

            <div>
              <label htmlFor="emailConfirm" className="block text-sm font-medium text-gray-700">
                Confirmar Correo
              </label>
              <input
                id="emailConfirm"
                name="emailConfirm"
                type="email"
                required
                value={formData.emailConfirm}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 sm:text-sm transition-all ${
                    error.includes('correos')
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-brand-blue'
                  }`}
                placeholder="Repite tu correo"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm pr-10"
                  placeholder="••••••••"
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 h-full text-gray-400 hover:text-brand-blue"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 sm:text-sm transition-all pr-10 ${
                    error.includes('contraseñas')
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-brand-blue'
                  }`}
                  placeholder="Repite tu contraseña"
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 h-full text-gray-400 hover:text-brand-blue"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>

          </div>

          <Button
            type="submit"
            className="w-full py-3 font-bold rounded-full bg-brand-orange hover:bg-orange-600 shadow-lg active:scale-95"
            size="lg"
          >
            Registrarse
          </Button>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm