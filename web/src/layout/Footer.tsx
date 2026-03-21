import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Mail, MapPin, Phone, Shield, Twitter, Youtube } from 'lucide-react'

function Footer() {
  const linkClass = 'text-sm text-white/50 hover:text-white transition-colors'

  return (
    <footer className="bg-[#1a1a2e] text-white mt-6">
      {/* Newsletter */}
      <div className="bg-primary py-5">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-white text-lg">
              Suscribite a nuestras ofertas
            </p>
            <p className="text-white/80 text-sm">
              Recibí descuentos exclusivos y novedades
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Tu email aquí..."
              className="flex-1 sm:w-64 px-4 py-2.5 rounded-lg bg-white text-slate-800 text-sm outline-none"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
              Suscribirme
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3">
              <span className="text-2xl font-black">Electro</span>
              <span className="text-2xl font-black text-amber-500">Mundo</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Tu tienda de electrónica y tecnología de confianza.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-black text-white mb-4 text-sm uppercase tracking-wide">
              Empresa
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={linkClass}>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className={linkClass}>
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/products" search={{ sortBy: 'price-asc', inStock: true }} className={linkClass}>
                  Mejores Precios
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClass}>
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="font-black text-white mb-4 text-sm uppercase tracking-wide">
              Ayuda
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faqs" className={linkClass}>
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/shipping" className={linkClass}>
                  Política de Envíos
                </Link>
              </li>
              <li>
                <Link to="/returns" className={linkClass}>
                  Cambios y Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={linkClass}>
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-black text-white mb-4 text-sm uppercase tracking-wide">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/50 text-sm">
                  Argentina
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary flex-shrink-0" />
                <span className="text-white/50 text-sm">
                  +54 9 3407 66-9329
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary flex-shrink-0" />
                <span className="text-white/50 text-sm">
                  contacto@electromundo.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} ElectroMundo. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3 text-white/30 text-xs">
            <Shield size={12} className="text-emerald-500" />
            <span>Sitio seguro</span>
            <span>·</span>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
