type AdminLoadingStateProps = {
  message?: string
}

export default function AdminLoadingState({
  message = 'Cargando...',
}: AdminLoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-lg">{message}</div>
    </div>
  )
}
