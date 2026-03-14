import PageBreadcrumb from '@/components/PageBreadcrumb'

function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PageBreadcrumb
            items={[{ label: 'Inicio', href: '/' }, { label: 'Cambios y Devoluciones' }]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cambios y Devoluciones</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Derecho de Arrepentimiento
            </h2>
            <p>
              De acuerdo con el artículo 34 de la Ley 24.240 de Defensa del Consumidor, tenés
              derecho a revocar la compra dentro de los{' '}
              <strong>10 (diez) días corridos</strong> contados a partir de la recepción del
              producto, sin necesidad de justificar tu decisión y sin penalidad alguna.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Condiciones para Cambios y Devoluciones
            </h2>
            <p className="mb-3">
              Para que podamos procesar tu cambio o devolución, el producto debe cumplir con las
              siguientes condiciones:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Estar sin uso y en el mismo estado en que fue recibido.</li>
              <li>Conservar su embalaje y empaque original, sin daños.</li>
              <li>Incluir todos los accesorios, manuales y documentación que acompañaban al producto.</li>
              <li>Presentar la factura o comprobante de compra.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Cómo Inicio un Cambio o Devolución?
            </h2>
            <p className="mb-3">
              El proceso es sencillo y se gestiona íntegramente por WhatsApp:
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong>Contactanos por WhatsApp</strong> indicando tu número de pedido y el motivo
                del cambio o devolución.
              </li>
              <li>
                <strong>Nuestro equipo evaluará tu solicitud</strong> y te confirmará si cumple con
                las condiciones requeridas.
              </li>
              <li>
                <strong>Coordinamos la logística inversa:</strong> te indicaremos cómo enviarnos el
                producto o dónde dejarlo para su retiro.
              </li>
              <li>
                <strong>Recibimos y verificamos el producto.</strong> Una vez confirmado que está en
                condiciones, procedemos con el cambio o reembolso.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Reembolsos</h2>
            <p className="mb-3">
              Si optás por una devolución, el reembolso se realizará por el mismo medio de pago
              utilizado en la compra original:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Transferencia bancaria:</strong> el reembolso se acredita en un plazo de 5 a
                10 días hábiles.
              </li>
              <li>
                <strong>Efectivo:</strong> se coordina la devolución del monto por transferencia o
                en persona.
              </li>
              <li>
                <strong>Tarjeta de crédito/débito:</strong> el plazo depende de la entidad emisora,
                pudiendo demorar hasta 30 días hábiles en reflejarse en tu resumen.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Productos con Defectos o Fallas
            </h2>
            <p>
              Si recibiste un producto con defectos de fabricación o fallas, tenés derecho a
              solicitar la reparación, el cambio por uno nuevo, o la devolución del monto abonado,
              conforme a lo establecido por la Ley 24.240. En estos casos, los costos de logística
              inversa corren por cuenta de ElectroMundo. Contactanos por WhatsApp con fotos del
              producto y una descripción de la falla para iniciar el proceso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Garantía Legal</h2>
            <p>
              Todos los productos nuevos comercializados por ElectroMundo cuentan con un plazo
              mínimo de <strong>6 meses de garantía legal</strong> conforme a la Ley de Defensa del
              Consumidor. Durante este período, si el producto presenta defectos o fallas de
              fabricación, podés solicitar la reparación, el cambio o la devolución del dinero.
              Muchos productos cuentan además con garantía extendida del fabricante.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Excepciones</h2>
            <p className="mb-3">
              No se aceptan cambios ni devoluciones en los siguientes casos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Productos que hayan sido usados, instalados o que presenten signos de manipulación.</li>
              <li>Productos sin su empaque original o con el empaque dañado por el cliente.</li>
              <li>Productos que no incluyan todos sus accesorios originales.</li>
              <li>Solicitudes realizadas fuera del plazo de 10 días corridos (excepto por defectos cubiertos por garantía).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Costos de Devolución</h2>
            <p>
              En caso de arrepentimiento (sin defectos en el producto), los costos de envío de la
              devolución podrán ser compartidos entre el cliente y ElectroMundo, según se coordine
              al momento de gestionar la solicitud. En caso de productos defectuosos, ElectroMundo
              se hace cargo del costo total de la logística inversa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contacto</h2>
            <p>
              Para iniciar un cambio, devolución o realizar cualquier consulta relacionada,
              contactanos a través de WhatsApp. Nuestro equipo de atención al cliente está
              disponible de lunes a viernes de 9 a 18 hs para asistirte en todo el proceso.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ReturnsPage
