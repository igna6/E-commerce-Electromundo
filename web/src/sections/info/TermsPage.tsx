import PageBreadcrumb from '@/components/PageBreadcrumb'

function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PageBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Términos y Condiciones' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Términos y Condiciones
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Última actualización: marzo 2026
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar el sitio web de ElectroMundo (en adelante,
              "el Sitio"), aceptás estos Términos y Condiciones en su totalidad.
              Si no estás de acuerdo con alguno de estos términos, te pedimos
              que no utilices el Sitio. El uso continuado del Sitio constituye
              la aceptación de cualquier modificación futura de estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Sobre ElectroMundo
            </h2>
            <p>
              ElectroMundo es una tienda online de productos electrónicos con
              sede en la República Argentina. Ofrecemos una amplia variedad de
              productos tecnológicos para el hogar y uso personal. Todos los
              precios publicados están expresados en Pesos Argentinos (ARS) e
              incluyen IVA (21%).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Proceso de Compra
            </h2>
            <p className="mb-3">
              El proceso de compra en ElectroMundo funciona de la siguiente
              manera:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                Navegá por nuestro catálogo y agregá productos al carrito.
              </li>
              <li>
                Revisá tu carrito y completá tus datos de contacto y envío.
              </li>
              <li>
                Al confirmar el pedido, serás redirigido a WhatsApp para
                coordinar el pago y la entrega con nuestro equipo.
              </li>
              <li>
                Un representante de ElectroMundo confirmará la disponibilidad,
                el monto final y las opciones de pago.
              </li>
            </ol>
            <p className="mt-3">
              La confirmación del pedido a través del Sitio no constituye un
              contrato de compraventa. El contrato se perfecciona una vez que
              nuestro equipo confirme la disponibilidad del producto y se
              acuerde la forma de pago vía WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Precios y Disponibilidad
            </h2>
            <p className="mb-3">
              Los precios publicados en el Sitio están sujetos a cambios sin
              previo aviso. ElectroMundo se reserva el derecho de modificar los
              precios en cualquier momento.
            </p>
            <p>
              La disponibilidad de los productos se confirma al momento de
              coordinar el pedido por WhatsApp. La exhibición de un producto en
              el Sitio no garantiza su disponibilidad inmediata en stock.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Medios de Pago
            </h2>
            <p>
              Los medios de pago disponibles serán informados por nuestro equipo
              al momento de coordinar la compra vía WhatsApp. Pueden incluir
              transferencia bancaria, efectivo, tarjeta de débito/crédito u
              otros medios que se acuerden. ElectroMundo no procesa pagos online
              a través del Sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Garantía
            </h2>
            <p>
              Todos los productos comercializados por ElectroMundo cuentan con
              la garantía legal establecida por la Ley 24.240 de Defensa del
              Consumidor de la República Argentina. Adicionalmente, los
              productos pueden contar con garantía del fabricante según las
              condiciones de cada marca.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Propiedad Intelectual
            </h2>
            <p>
              Todo el contenido del Sitio, incluyendo textos, imágenes,
              logotipos, diseño gráfico y software, es propiedad de ElectroMundo
              o de sus respectivos titulares. Queda prohibida su reproducción,
              distribución o modificación sin autorización previa por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Limitación de Responsabilidad
            </h2>
            <p>
              ElectroMundo no será responsable por interrupciones temporales del
              Sitio, errores tipográficos en la información publicada, o demoras
              ocasionadas por causas ajenas a nuestro control. Nos comprometemos
              a corregir cualquier error tan pronto como sea detectado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Modificación de los Términos
            </h2>
            <p>
              ElectroMundo se reserva el derecho de modificar estos Términos y
              Condiciones en cualquier momento. Las modificaciones entrarán en
              vigencia desde su publicación en el Sitio. Es responsabilidad del
              usuario revisar periódicamente esta página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Legislación Aplicable
            </h2>
            <p>
              Estos Términos y Condiciones se rigen por las leyes de la
              República Argentina. Cualquier controversia será sometida a los
              tribunales ordinarios competentes de la Ciudad Autónoma de Buenos
              Aires.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Contacto
            </h2>
            <p>
              Si tenés alguna consulta sobre estos Términos y Condiciones, podés
              comunicarte con nosotros a través de nuestro WhatsApp o enviarnos
              un mensaje desde la sección de contacto del Sitio.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
