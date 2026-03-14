type AdminErrorStateProps = {
  error: Error
}

export default function AdminErrorState({ error }: AdminErrorStateProps) {
  return (
    <div className="rounded-lg bg-red-50 p-4 text-red-700">
      {error.message}
    </div>
  )
}
