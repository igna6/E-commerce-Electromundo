import { CreditCard, Headphones, RotateCcw, Shield, Tag } from 'lucide-react'

const badges = [
  {
    icon: CreditCard,
    title: '12 Cuotas Sin Interés',
    subtitle: 'Con todas las tarjetas',
    color: '#4caf50',
  },
  {
    icon: Tag,
    title: 'Mejores Precios',
    subtitle: 'Te igualamos el precio',
    color: '#ff9800',
  },
  {
    icon: RotateCcw,
    title: 'Cambios Gratis',
    subtitle: '30 días sin preguntas',
    color: '#9c27b0',
  },
  {
    icon: Shield,
    title: 'Garantía Oficial',
    subtitle: 'En todos los productos',
    color: '#f44336',
  },
  {
    icon: Headphones,
    title: 'Atención 24/7',
    subtitle: 'Chat, mail y teléfono',
    color: '#2196f3',
  },
]

function BenefitsBar() {
  return (
    <section className="bg-white border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.title}
                className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: badge.color + '18' }}
                >
                  <Icon size={18} style={{ color: badge.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {badge.title}
                  </p>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5 hidden sm:block">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BenefitsBar
