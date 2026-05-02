import PageBreadcrumb from '@/components/PageBreadcrumb'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: '¿Cómo hago una compra en ElectroMundo?',
    answer:
      'Navegá por nuestro catálogo, agregá los productos que te interesen al carrito y completá tus datos de contacto y envío. Al confirmar el pedido, serás redirigido a WhatsApp para coordinar el pago y la entrega con nuestro equipo. Es simple y rápido.',
  },
  {
    question: '¿Qué medios de pago aceptan?',
    answer:
      'Aceptamos transferencia bancaria, efectivo, tarjeta de débito y crédito, entre otros. Los medios de pago disponibles se coordinan directamente con nuestro equipo al momento de confirmar tu compra por WhatsApp. No procesamos pagos online a través del sitio web.',
  },
  {
    question: '¿Cuánto tarda el envío?',
    answer:
      'Los tiempos de entrega varían según tu ubicación. Para CABA y GBA, el plazo estimado es de 2 a 5 días hábiles. Para el resto del país, puede demorar entre 5 y 10 días hábiles. Te enviaremos los datos de seguimiento una vez despachado tu pedido.',
  },
  {
    question: '¿El envío tiene costo?',
    answer:
      'El costo del envío se calcula en función de tu ubicación y se informa al momento de coordinar la compra por WhatsApp. También ofrecemos la opción de retiro en nuestro punto de entrega sin costo adicional.',
  },
  {
    question: '¿Puedo hacer un seguimiento de mi pedido?',
    answer:
      'Una vez que tu pedido sea despachado, te enviaremos por WhatsApp el código de seguimiento y el enlace de la empresa de transporte para que puedas rastrear tu paquete en tiempo real.',
  },
  {
    question: '¿Puedo devolver un producto?',
    answer:
      'Tenés 10 días corridos desde la recepción del producto para solicitar un cambio o devolución, de acuerdo con la Ley de Defensa del Consumidor (Ley 24.240). El producto debe estar sin uso, en su empaque original y con todos los accesorios. Para iniciar el proceso, contactanos por WhatsApp.',
  },
  {
    question: '¿Los productos tienen garantía?',
    answer:
      'Todos nuestros productos cuentan con la garantía legal establecida por la Ley de Defensa del Consumidor. Además, muchos productos incluyen garantía del fabricante. Los plazos y condiciones específicas de garantía se detallan en la descripción de cada producto.',
  },
  {
    question: '¿Hacen envíos a todo el país?',
    answer:
      'Sí, realizamos envíos a todas las provincias de la República Argentina a través de servicios de logística confiables. Los tiempos y costos de envío varían según la zona de destino.',
  },
  {
    question: '¿Puedo retirar mi compra en persona?',
    answer:
      'Sí, ofrecemos la opción de retiro sin costo en nuestro punto de entrega. Al coordinar tu compra por WhatsApp, indicá que preferís retiro en persona y te enviaremos la dirección y los horarios de atención.',
  },
  {
    question: '¿Cómo me contacto con ElectroMundo?',
    answer:
      'Podés contactarnos fácilmente a través de WhatsApp, que es nuestro canal principal de atención al cliente. También podés enviarnos un correo electrónico desde la sección de contacto del sitio. Nuestro equipo responde de lunes a viernes de 9 a 18 hs.',
  },
]

function FaqsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PageBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Preguntas Frecuentes' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Preguntas Frecuentes
        </h1>
        <p className="text-gray-600 mb-8">
          Encontrá respuestas a las consultas más comunes sobre compras, envíos,
          pagos y más.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-base font-medium text-gray-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-600">
            Escribinos por WhatsApp y nuestro equipo te va a ayudar con tu
            consulta.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FaqsPage
