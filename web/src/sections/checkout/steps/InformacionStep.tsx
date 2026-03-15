import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCheckout } from '@/contexts/CheckoutContext'
import CheckoutStepLayout from '../CheckoutStepLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Email invalido'),
  phone: z.string().min(1, 'Telefono requerido'),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
})

type FormData = z.infer<typeof schema>

export default function InformacionStep() {
  const navigate = useNavigate()
  const { data, updateData, completeStep } = useCheckout()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: data.email ?? '',
      phone: data.phone ?? '',
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
    },
  })

  const onSubmit = (formData: FormData) => {
    updateData(formData)
    completeStep('informacion')
    navigate({ to: '/checkout/confirmar' })
  }

  return (
    <CheckoutStepLayout currentStep="informacion" stepLabel="Contacto">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Informacion de Contacto</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="Perez"
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
              <Label htmlFor="phone">Telefono</Label>
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
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
              Revisar Pedido
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </form>
      </div>
    </CheckoutStepLayout>
  )
}
