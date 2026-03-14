import { Alert, AlertDescription } from '@/components/ui/alert'

type AdminErrorStateProps = {
  error: Error
}

export default function AdminErrorState({ error }: AdminErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}
