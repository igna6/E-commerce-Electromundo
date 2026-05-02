import PageBreadcrumb from '@/components/PageBreadcrumb'

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PageBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Política de Privacidad' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Política de Privacidad
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Última actualización: marzo 2026
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Introducción
            </h2>
            <p>
              En ElectroMundo nos comprometemos a proteger la privacidad de
              nuestros usuarios. Esta Política de Privacidad describe qué datos
              personales recopilamos, cómo los utilizamos y cuáles son tus
              derechos en relación con ellos, de conformidad con la Ley 25.326
              de Protección de Datos Personales de la República Argentina y su
              normativa complementaria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Datos que Recopilamos
            </h2>
            <p className="mb-3">
              Recopilamos únicamente los datos necesarios para procesar tus
              pedidos y brindarte un mejor servicio:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Datos de contacto:</strong> nombre y apellido, dirección
                de correo electrónico, número de teléfono.
              </li>
              <li>
                <strong>Datos de envío:</strong> dirección postal, localidad,
                código postal, provincia.
              </li>
              <li>
                <strong>Datos de la cuenta:</strong> correo electrónico y
                contraseña cifrada (si creás una cuenta).
              </li>
              <li>
                <strong>Datos del pedido:</strong> productos seleccionados,
                cantidades, historial de compras.
              </li>
            </ul>
            <p className="mt-3">
              No recopilamos datos financieros (tarjetas de crédito, cuentas
              bancarias) a través del Sitio, ya que los pagos se coordinan por
              fuera de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Finalidad del Tratamiento
            </h2>
            <p className="mb-3">
              Utilizamos tus datos personales exclusivamente para:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Procesar y gestionar tus pedidos.</li>
              <li>Coordinar el envío de productos a tu domicilio.</li>
              <li>
                Comunicarnos con vos en relación a tu compra (confirmaciones,
                consultas, soporte).
              </li>
              <li>
                Mejorar la experiencia de navegación y el funcionamiento del
                Sitio.
              </li>
              <li>Cumplir con obligaciones legales y fiscales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Compartición de Datos con Terceros
            </h2>
            <p>
              ElectroMundo no vende, alquila ni comparte tus datos personales
              con terceros con fines comerciales o publicitarios. Solo podremos
              compartir información con:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
              <li>
                <strong>Servicios de logística:</strong> exclusivamente los
                datos necesarios para realizar la entrega (nombre, dirección,
                teléfono).
              </li>
              <li>
                <strong>Autoridades competentes:</strong> cuando sea requerido
                por ley o resolución judicial.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Seguridad de los Datos
            </h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tus datos personales contra accesos no autorizados,
              pérdida, alteración o destrucción. Las contraseñas se almacenan de
              forma cifrada y las comunicaciones se realizan a través de
              conexiones seguras (HTTPS).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Conservación de los Datos
            </h2>
            <p>
              Conservamos tus datos personales mientras tu cuenta esté activa o
              sea necesario para prestarte nuestros servicios. También los
              conservaremos el tiempo necesario para cumplir con obligaciones
              legales y resolver disputas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Tus Derechos (Ley 25.326)
            </h2>
            <p className="mb-3">
              De acuerdo con la Ley 25.326 de Protección de Datos Personales,
              tenés derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Acceso:</strong> solicitar información sobre los datos
                personales que tenemos almacenados sobre vos.
              </li>
              <li>
                <strong>Rectificación:</strong> solicitar la corrección de datos
                inexactos o incompletos.
              </li>
              <li>
                <strong>Supresión:</strong> solicitar la eliminación de tus
                datos cuando ya no sean necesarios para la finalidad para la que
                fueron recopilados.
              </li>
              <li>
                <strong>Confidencialidad:</strong> solicitar que tus datos sean
                tratados de forma confidencial.
              </li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, podés contactarnos a
              través de nuestro WhatsApp o por correo electrónico. Responderemos
              tu solicitud dentro de los 10 días hábiles establecidos por la
              normativa vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Cookies
            </h2>
            <p>
              El Sitio puede utilizar cookies y tecnologías similares para
              mejorar la experiencia de navegación, recordar tus preferencias y
              analizar el uso del Sitio. Podés configurar tu navegador para
              rechazar cookies, aunque esto podría afectar algunas
              funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Modificaciones a esta Política
            </h2>
            <p>
              Nos reservamos el derecho de actualizar esta Política de
              Privacidad en cualquier momento. Las modificaciones serán
              publicadas en esta página con la fecha de actualización
              correspondiente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Contacto
            </h2>
            <p>
              Si tenés preguntas o inquietudes sobre esta Política de Privacidad
              o sobre el tratamiento de tus datos personales, podés contactarnos
              a través de nuestro WhatsApp o desde la sección de contacto del
              Sitio.
            </p>
            <p className="mt-3 text-sm text-gray-500">
              La Dirección Nacional de Protección de Datos Personales (Agencia
              de Acceso a la Información Pública) es el órgano de control de la
              Ley 25.326. Para más información, visitá{' '}
              <a
                href="https://www.argentina.gob.ar/aaip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                www.argentina.gob.ar/aaip
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
