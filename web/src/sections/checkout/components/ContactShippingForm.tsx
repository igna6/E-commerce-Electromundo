import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type ContactShippingFormData = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  apartment?: string
  city: string
  province: string
  zipCode: string
}

type ContactShippingFormProps = {
  register: UseFormRegister<ContactShippingFormData>
  errors: FieldErrors<ContactShippingFormData>
  onNext: () => void
}

export default function ContactShippingForm({ register, errors, onNext }: ContactShippingFormProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Información de Contacto y Envío
      </h2>

      {/* Contact Info */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">Información de Contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <Separator className="my-6" />

      {/* Shipping Address */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Dirección de Envío</h3>
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
          <div className="md:col-span-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              placeholder="Av. Corrientes 1234"
              className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
              {...register('address')}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="apartment">Depto / Piso (opcional)</Label>
            <Input
              id="apartment"
              placeholder="Piso 5, Depto A"
              className="mt-1"
              {...register('apartment')}
            />
          </div>
          <div>
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              placeholder="Buenos Aires"
              className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
              {...register('city')}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="province">Provincia</Label>
            <Input
              id="province"
              placeholder="CABA"
              className={`mt-1 ${errors.province ? 'border-red-500' : ''}`}
              {...register('province')}
            />
            {errors.province && (
              <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="zipCode">Código Postal</Label>
            <Input
              id="zipCode"
              placeholder="C1043"
              className={`mt-1 ${errors.zipCode ? 'border-red-500' : ''}`}
              {...register('zipCode')}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          type="button"
          onClick={onNext}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          Continuar al Envío
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
