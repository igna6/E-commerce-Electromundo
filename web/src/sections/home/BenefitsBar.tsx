import { Headphones, Shield, Tag, Truck } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En compras +$50,000',
  },
  {
    icon: Shield,
    title: 'Garantía Oficial',
    description: 'En todos los productos',
  },
  {
    icon: Tag,
    title: 'Mejores Precios',
    description: 'Precios competitivos',
  },
  {
    icon: Headphones,
    title: 'Atención Personalizada',
    description: 'Estamos para ayudarte',
  },
]

function BenefitsBar() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-center gap-3 sm:gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
                  {benefit.title}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-tight mt-0.5 hidden sm:block">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsBar
