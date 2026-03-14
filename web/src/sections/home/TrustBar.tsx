import { Lock, Truck, MessageCircle, ShieldCheck } from 'lucide-react'

const trustItems = [
  {
    icon: Lock,
    title: 'Compra segura',
    description: 'Protegemos tus datos',
  },
  {
    icon: Truck,
    title: 'Envíos a todo el país',
    description: 'Llegamos a donde estés',
  },
  {
    icon: MessageCircle,
    title: 'Atención por WhatsApp',
    description: 'Respuesta inmediata',
  },
  {
    icon: ShieldCheck,
    title: 'Garantía oficial',
    description: 'En todos los productos',
  },
]

function TrustBar() {
  return (
    <section className="bg-white border-t border-slate-200 py-8 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 sm:gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm leading-tight">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 leading-tight mt-0.5 hidden sm:block">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBar
