const methods = [
  'Visa',
  'Mastercard',
  'American Express',
  'Naranja X',
  'MercadoPago',
  'MODO',
  'Transferencia',
  'Débito',
]

function PaymentMethods() {
  return (
    <section className="bg-slate-50 border-y border-slate-100 py-5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 font-semibold mr-2">
            Medios de pago:
          </span>
          {methods.map((method) => (
            <span
              key={method}
              className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm"
            >
              {method}
            </span>
          ))}
          <span className="text-xs text-emerald-600 font-semibold ml-2">
            ✓ 12 cuotas sin interés
          </span>
        </div>
      </div>
    </section>
  )
}

export default PaymentMethods
