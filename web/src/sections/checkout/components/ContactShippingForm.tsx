import { Link } from '@tanstack/react-router'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { StockError } from '@/machines/checkoutMachine'

type ContactFormData = {
  email: string
  phone: string
  firstName: string
  lastName: string
}

type ContactShippingFormProps = {
  register: UseFormRegister<ContactFormData>
  errors: FieldErrors<ContactFormData>
  onSubmit: () => void
  isSubmitting: boolean
  submitError: string | null
  stockErrors: StockError[]
}

export default function ContactShippingForm({
  register,
  errors,
  onSubmit,
  isSubmitting,
  submitError,
  stockErrors,
}: ContactShippingFormProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Información de Contacto
        </h2>
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Retiro en sucursal
        </Badge>
      </div>

      {/* Error messages */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <p className="font-medium">{submitError}</p>
          {stockErrors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {stockErrors.map((item, i) => (
                <li key={i}>
                  <strong>{item.productName}</strong>: pediste {item.requested}, disponible{' '}
                  {item.available === 0 ? 'agotado' : item.available}
                </li>
              ))}
            </ul>
          )}
          <Link to="/cart" className="inline-block mt-2 text-primary hover:underline font-medium">
            Volver al carrito para ajustar
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            placeholder="Juan"
            className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            placeholder="Pérez"
            className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+54 11 1234-5678"
            className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          type="button"
          onClick={onSubmit}
          size="lg"
          className="bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Procesando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Confirmar Pedido
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
