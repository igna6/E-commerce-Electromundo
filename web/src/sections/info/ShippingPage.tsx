import PageBreadcrumb from '@/components/PageBreadcrumb'

function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PageBreadcrumb
            items={[{ label: 'Inicio', href: '/' }, { label: 'Política de Envíos' }]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Envíos</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Envío Gratuito</h2>
            <p>
              En ElectroMundo ofrecemos <strong>envío gratuito</strong> para todas las compras
              superiores a <strong>$50.000</strong>. Para pedidos de menor monto, el costo del envío
              se calcula en función de tu ubicación y se te informa al momento de coordinar la
              compra por WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Zona de Cobertura</h2>
            <p>
              Realizamos envíos a todo el territorio de la República Argentina. Trabajamos con
              servicios de logística confiables para garantizar que tu pedido llegue en óptimas
              condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Tiempos Estimados de Entrega
            </h2>
            <p className="mb-3">
              Los plazos de entrega se cuentan a partir del despacho del pedido y pueden variar
              según la zona de destino:
            </p>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900">Zona</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                      Plazo Estimado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm">CABA</td>
                    <td className="px-4 py-3 text-sm">1 a 3 días hábiles</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">Gran Buenos Aires (GBA)</td>
                    <td className="px-4 py-3 text-sm">2 a 5 días hábiles</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">Interior del país</td>
                    <td className="px-4 py-3 text-sm">5 a 10 días hábiles</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Estos plazos son estimativos y pueden verse afectados por factores externos como
              condiciones climáticas, feriados o demoras en los servicios de logística.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Seguimiento del Pedido</h2>
            <p>
              Una vez despachado tu pedido, te enviaremos por WhatsApp el código de seguimiento junto
              con el enlace de la empresa de transporte. De esta manera, podés rastrear tu paquete
              en tiempo real hasta que llegue a tu domicilio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Retiro en Punto de Entrega
            </h2>
            <p>
              Si preferís no esperar al envío, podés optar por retirar tu compra en nuestro punto de
              entrega <strong>sin costo adicional</strong>. Al coordinar tu pedido por WhatsApp,
              indicá que preferís retiro en persona y te enviaremos la dirección y los horarios
              disponibles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Recepción del Pedido</h2>
            <p className="mb-3">Al recibir tu pedido, te recomendamos:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Verificar que el embalaje se encuentre en buen estado antes de firmar la recepción.</li>
              <li>Controlar que los productos recibidos coincidan con los detallados en tu pedido.</li>
              <li>
                En caso de encontrar algún daño o faltante, contactanos inmediatamente por WhatsApp
                con fotos del paquete y los productos.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Consultas</h2>
            <p>
              Para cualquier consulta sobre el estado de tu envío o sobre nuestra política de
              envíos, no dudes en contactarnos a través de WhatsApp. Nuestro equipo está disponible
              de lunes a viernes de 9 a 18 hs.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ShippingPage
